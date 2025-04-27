/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { Loader2, Repeat, PlusCircle, MinusCircle } from "lucide-react";
import Button from "../components/common/Button";
import BottomNav from "../components/layout/BottomNav";
import Navbar from "../components/layout/Navbar";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Transaction } from "../types";
import apiService from "../api/apiService";

function TransactionPage() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  // Use local state for history specific loading/data
  const [history, setHistory] = useState<Transaction[]>(
    state.transactionHistory.records
  );
  const [offset, setOffset] = useState(state.transactionHistory.offset);
  const [limit] = useState(5); // Keep limit consistent
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMore, setHasMore] = useState(state.transactionHistory.hasMore);

  const fetchHistory = useCallback(
    async (currentOffset: number) => {
      setIsLoadingHistory(true);
      dispatch({ type: "CLEAR_ERROR" });
      try {
        const response = await apiService.getTransactionHistory(
          currentOffset,
          limit
        );
        const newRecords = response.data.records || [];

        // Update local state
        setHistory((prev) =>
          currentOffset === 0 ? newRecords : [...prev, ...newRecords]
        );
        setOffset(currentOffset + newRecords.length);
        setHasMore(newRecords.length === limit);

        // Update global state too
        dispatch({
          type: "SET_TRANSACTION_HISTORY",
          payload: {
            records: newRecords,
            offset: currentOffset + newRecords.length,
            limit,
            append: currentOffset !== 0,
          },
        });
      } catch (error) {
        console.error("Fetch History API call failed:", error);
        dispatch({ type: "SET_ERROR", payload: error });

        const typedError = error as any;
        if (typedError?.status === 401 || typedError?.status === 108) {
          setTimeout(() => dispatch({ type: "LOGOUT" }), 100);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [dispatch, limit]
  );

  useEffect(() => {
    // Fetch initial history only if it hasn't been fetched yet
    if (offset === 0 && history.length === 0) {
      fetchHistory(0);
    }
  }, [fetchHistory, offset, history.length]);

  const handleLoadMore = () => {
    if (!isLoadingHistory && hasMore) {
      fetchHistory(offset); // Fetch next page using the current offset
    }
  };

  // Helper to determine text color and sign based on transaction type
  const getTransactionStyle = (type: string) => {
    if (type === "TOPUP") {
      return { color: "text-green-600", sign: "+" };
    } else if (type === "PAYMENT") {
      return { color: "text-red-600", sign: "-" };
    }
    return { color: "text-gray-800", sign: "" }; // Default
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Use the reusable Navbar component */}
      <Navbar
        title="Riwayat Transaksi"
        showBackButton={true}
        onBackButtonClick={() => navigate("/")}
      />

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Semua Transaksi
          </h2>

          {isLoadingHistory && history.length === 0 && (
            <div className="text-center py-10">
              <Loader2
                className="animate-spin text-red-500 mx-auto"
                size={32}
              />
              <p className="text-gray-500 mt-2">Memuat riwayat...</p>
            </div>
          )}

          {!isLoadingHistory && history.length === 0 && (
            <div className="text-center py-10">
              <Repeat size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada riwayat transaksi.</p>
            </div>
          )}

          {history.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {history.map((tx, index) => {
                const style = getTransactionStyle(tx.transaction_type);
                return (
                  <li
                    key={`${tx.invoice_number}-${index}`}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      {tx.transaction_type === "TOPUP" ? (
                        <PlusCircle className="text-green-500 mr-3" size={24} />
                      ) : (
                        <MinusCircle className="text-red-500 mr-3" size={24} />
                      )}
                      <div>
                        <p className={`font-medium ${style.color}`}>
                          {tx.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(tx.created_on)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Inv: {tx.invoice_number}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold text-lg ${style.color}`}>
                      {style.sign}
                      {formatCurrency(tx.total_amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Load More Button */}
          {history.length > 0 && hasMore && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleLoadMore}
                isLoading={isLoadingHistory}
                disabled={isLoadingHistory}
                variant="secondary"
              >
                Tampilkan Lebih Banyak
              </Button>
            </div>
          )}
          {!hasMore && history.length > 0 && (
            <p className="text-center text-gray-400 mt-6 text-sm">
              -- Akhir Riwayat --
            </p>
          )}
        </div>
      </main>

      <BottomNav activePage="transaction" navigate={(path) => navigate(path)} />
    </div>
  );
}

export default TransactionPage;
