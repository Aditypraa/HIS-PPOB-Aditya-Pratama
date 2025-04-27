/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { AppContext } from "../contexts/AppContext";
import { useHomePageData } from "../hooks/useHomePageData";
import { generateDefaultAvatar } from "../utils/avatar";

import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/common/Button";
import ServiceIcon from "../components/common/ServiceIcon";
import PromoBanner from "../components/common/PromoBanner";
import { formatCurrency } from "../utils/formatters";
import { SkeletonLoader } from "../components/common/SkeletonLoader";

function HomePage() {
  const { state, dispatch } = useContext(AppContext);
  const { user, balance, services, banners, isLoading } = state;
  const [showBalance, setShowBalance] = useState(false);
  const navigate = useNavigate();
  const { fetchData } = useHomePageData();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (state.authToken) fetchData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [fetchData, state.authToken]);

  const handleServiceClick = (service: any) => {
    dispatch({
      type: "NAVIGATE",
      payload: {
        page: "payment",
        data: {
          serviceCode: service.service_code,
          serviceName: service.service_name,
          amount: service.service_tariff,
        },
      },
    });
    navigate("/payment");
  };

  if (isLoading && !user && balance === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  const defaultAvatar = generateDefaultAvatar(user?.first_name);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar showLogoutButton={true} />

      <main className="container mx-auto p-4">
        {/* Welcome and Balance */}
        <section className="mb-6">
          <div className="flex items-center mb-4">
            <img
              src={user?.profile_image || defaultAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow object-cover"
              onError={(e) => (e.currentTarget.src = defaultAvatar)}
            />
            <div>
              <p className="text-sm text-gray-600">Selamat datang,</p>
              <h1 className="text-xl font-semibold text-gray-800">
                {user ? `${user.first_name} ${user.last_name}` : "Pengguna"}
              </h1>
            </div>
          </div>

          <div className="bg-red-500 text-white p-5 rounded-lg shadow-lg">
            <p className="text-sm opacity-90">Saldo anda</p>
            <div className="flex justify-between items-center mt-1">
              <h2 className="text-3xl font-bold">
                {balance === null ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : showBalance ? (
                  formatCurrency(balance)
                ) : (
                  "Rp *******"
                )}
              </h2>
              <Button
                onClick={() => setShowBalance(!showBalance)}
                variant="secondary"
                className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 text-xs px-3 py-1"
                disabled={balance === null}
              >
                {showBalance ? (
                  <EyeOff size={14} className="inline mr-1" />
                ) : (
                  <Eye size={14} className="inline mr-1" />
                )}
                {showBalance ? "Tutup" : "Lihat"} Saldo
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Layanan Kami
          </h3>
          {isLoading && services.length === 0 ? (
            <SkeletonLoader />
          ) : services.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 mb-8 justify-items-center">
              {services.map((service) => (
                <ServiceIcon
                  key={service.service_code}
                  iconUrl={service.service_icon}
                  label={service.service_name}
                  serviceCode={service.service_code}
                  onClick={() => handleServiceClick(service)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-8">
              Gagal memuat layanan.
            </p>
          )}
        </section>

        {/* Promotions */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Temukan promo menarik
          </h3>
          {isLoading && banners.length === 0 ? (
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 h-36 bg-gray-200 rounded-lg shadow-md mr-4 animate-pulse"
                ></div>
              ))}
            </div>
          ) : banners.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
              {banners.map((banner, index) => (
                <PromoBanner key={index} banner={banner} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Gagal memuat banner promosi.
            </p>
          )}
        </section>
      </main>

      <BottomNav activePage="home" navigate={navigate} />
    </div>
  );
}

export default HomePage;
