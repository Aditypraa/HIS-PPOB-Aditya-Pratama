import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { CreditCard, Wallet } from 'lucide-react';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import BottomNav from '../components/layout/BottomNav';
import Navbar from '../components/layout/Navbar';
import { formatCurrency } from '../utils/formatters';
import apiService from '../api';

// Top Up Page
function TopUpPage() {
    const { state, dispatch } = useContext(AppContext);
    const { balance, isSubmitting } = state;
    const [amount, setAmount] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');
        dispatch({ type: 'CLEAR_ERROR' });

        // Validate input is a number
        if (!amount || amount.trim() === '') {
            setFormError('Jumlah top up harus diisi.');
            return;
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            setFormError('Jumlah top up harus berupa angka.');
            return;
        }

        if (numericAmount <= 0) {
            setFormError('Jumlah top up harus lebih dari 0.');
            return;
        }

        // Check if it's a whole number
        if (!Number.isInteger(numericAmount)) {
            setFormError('Jumlah top up harus berupa angka bulat.');
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', payload: true });
        try {
            const response = await apiService.topUp(numericAmount);
            // Update balance in context with the new balance from API response
            dispatch({ type: 'SET_BALANCE', payload: response.data.balance });
            setSuccessMessage(`Top up sebesar ${formatCurrency(numericAmount)} berhasil! Saldo baru Anda: ${formatCurrency(response.data.balance)}`);
            setAmount(''); // Clear input on success
        } catch (error) {
            console.error("Top Up API call failed:", error);
            dispatch({ type: 'SET_ERROR', payload: error });
            setFormError(error.message || 'Gagal melakukan top up. Silakan coba lagi nanti.');
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Use the reusable Navbar */}
            <Navbar
                title="Top Up Saldo"
                showBackButton={true}
                onBackButtonClick={() => navigate('/')}
            />

            {/* Main Content */}
            <main className="container mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <div className="mb-6 text-center">
                        <Wallet size={48} className="text-red-500 mx-auto mb-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Top Up Saldo Anda</h2>
                        <p className="text-sm text-gray-600 mt-1">Saldo saat ini: <span className="font-bold">{formatCurrency(balance)}</span></p>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleTopUp}>
                        <InputField
                            icon={CreditCard}
                            type="number"
                            placeholder="Jumlah Top Up"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            error={formError}
                            min="1" // Set minimum value for number input
                            step="1" // Only allow whole numbers
                        />
                        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
                            Top Up Sekarang
                        </Button>
                    </form>
                </div>
            </main>

            <BottomNav activePage="topup" navigate={(path) => navigate(path)} />
        </div>
    );
}

export default TopUpPage;