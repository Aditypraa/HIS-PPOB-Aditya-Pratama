import { useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import ServiceIcon from '../components/common/ServiceIcon';
import PromoBanner from '../components/common/PromoBanner';
import BottomNav from '../components/layout/BottomNav';
import Navbar from '../components/layout/Navbar';
import { formatCurrency } from '../utils/formatters';
import apiService from '../api';
import { Service } from '../types';

function HomePage() {
    const { state, dispatch } = useContext(AppContext);
    const { user, balance, services, banners, isLoading } = state;
    const [showBalance, setShowBalance] = useState(false);
    const navigate = useNavigate();

    // Standardized navigation handler
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Fetch data on component mount
    const fetchData = useCallback(async () => {
        // Skip fetch if data already exists or already loading
        if ((user && balance !== null && services.length > 0 && banners.length > 0) || isLoading) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        let hasError = false;

        try {
            const results = await Promise.allSettled([
                !state.user ? apiService.getProfile() : Promise.resolve({ value: { data: state.user, status: 0 }, status: 'fulfilled' as const }),
                state.balance === null ? apiService.getBalance() : Promise.resolve({ value: { data: { balance: state.balance }, status: 0 }, status: 'fulfilled' as const }),
                state.services.length === 0 ? apiService.getServices() : Promise.resolve({ value: { data: state.services, status: 0 }, status: 'fulfilled' as const }),
                state.banners.length === 0 ? apiService.getBanners() : Promise.resolve({ value: { data: state.banners, status: 0 }, status: 'fulfilled' as const }),
            ]);

            const [profileRes, balanceRes, servicesRes, bannersRes] = results;

            // Process results - Handle Fulfilled and Rejected promises
            if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
                dispatch({ type: 'SET_USER', payload: profileRes.value.data });
            }
            else if (profileRes.status === 'rejected') {
                const error = profileRes.reason as any;
                if (!hasError) {
                    dispatch({ type: 'SET_ERROR', payload: error || 'Gagal memuat profil.' });
                    hasError = true;
                }
                if (error?.status === 401 || error?.status === 108) {
                    setTimeout(logout, 100);
                }
            }

            if (balanceRes.status === 'fulfilled' && balanceRes.value?.data?.balance !== undefined) {
                dispatch({ type: 'SET_BALANCE', payload: balanceRes.value.data.balance });
            }
            else if (balanceRes.status === 'rejected') {
                const error = balanceRes.reason as any;
                if (!hasError) {
                    dispatch({ type: 'SET_ERROR', payload: error || 'Gagal memuat saldo.' });
                    hasError = true;
                }
                if (error?.status === 401 || error?.status === 108) {
                    setTimeout(logout, 100);
                }
            }

            if (servicesRes.status === 'fulfilled' && servicesRes.value?.data) {
                dispatch({ type: 'SET_SERVICES', payload: servicesRes.value.data });
            }
            else if (servicesRes.status === 'rejected') {
                const error = servicesRes.reason as any;
                if (!hasError) {
                    dispatch({ type: 'SET_ERROR', payload: error || 'Gagal memuat layanan.' });
                    hasError = true;
                }
                if (error?.status === 401 || error?.status === 108) {
                    setTimeout(logout, 100);
                }
            }

            if (bannersRes.status === 'fulfilled' && bannersRes.value?.data) {
                dispatch({ type: 'SET_BANNERS', payload: bannersRes.value.data });
            }
            else if (bannersRes.status === 'rejected') {
                const error = bannersRes.reason as any;
                if (!hasError) {
                    dispatch({ type: 'SET_ERROR', payload: error || 'Gagal memuat banner.' });
                    hasError = true;
                }
            }
        } catch (error) {
            console.error("Error fetching homepage data:", error);
            if (!hasError) dispatch({ type: 'SET_ERROR', payload: error });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [dispatch, state.user, state.balance, state.services.length, state.banners.length, user, balance, services.length, banners.length, isLoading]);

    useEffect(() => {
        if (state.authToken) {
            fetchData();
        }
    }, [fetchData, state.authToken]);

    const handleServiceClick = (service: Service) => {
        // Store service data in state and navigate to payment page
        dispatch({
            type: 'NAVIGATE',
            payload: {
                page: 'payment',
                data: {
                    serviceCode: service.service_code,
                    serviceName: service.service_name,
                    amount: service.service_tariff
                }
            }
        });
        navigate('/payment');
    };

    // Initial loading state
    if (isLoading && !user && balance === null) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="animate-spin text-red-500" size={48} />
            </div>
        );
    }

    // Calculate default avatar
    const defaultAvatar = user?.first_name
        ? `https://placehold.co/40x40/7f9cf5/ffffff?text=${user.first_name.charAt(0)}`
        : `https://placehold.co/40x40/cccccc/ffffff?text=U`;

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Use the reusable Navbar component */}
            <Navbar showLogoutButton={true} />

            {/* Main Content */}
            <main className="container mx-auto p-4">
                {/* Welcome and Balance */}
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <img
                            src={user?.profile_image || defaultAvatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = defaultAvatar;
                            }}
                        />
                        <div>
                            <p className="text-sm text-gray-600">Selamat datang,</p>
                            <h1 className="text-xl font-semibold text-gray-800">
                                {user ? `${user.first_name} ${user.last_name}` : 'Pengguna'}
                            </h1>
                        </div>
                    </div>
                    <div className="bg-red-500 text-white p-5 rounded-lg shadow-lg">
                        <p className="text-sm opacity-90">Saldo anda</p>
                        <div className="flex justify-between items-center mt-1">
                            <h2 className="text-3xl font-bold">
                                {balance === null ?
                                    (<Loader2 className="animate-spin" size={28} />) :
                                    showBalance ? (formatCurrency(balance)) : ('Rp *******')
                                }
                            </h2>
                            <Button
                                onClick={() => setShowBalance(!showBalance)}
                                variant="secondary"
                                className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 text-xs px-3 py-1"
                                disabled={balance === null}
                            >
                                {showBalance ?
                                    <EyeOff size={14} className="inline mr-1" /> :
                                    <Eye size={14} className="inline mr-1" />
                                }
                                {showBalance ? 'Tutup' : 'Lihat'} Saldo
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Layanan Kami</h3>
                {isLoading && services.length === 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 mb-8 justify-items-center">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center p-2 w-16 sm:w-20">
                                <div className="p-3 bg-gray-200 rounded-lg mb-1 w-12 h-12 animate-pulse"></div>
                                <div className="h-2 w-10 bg-gray-200 rounded animate-pulse mt-1"></div>
                            </div>
                        ))}
                    </div>
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
                    <p className="text-center text-gray-500 mb-8">Gagal memuat layanan.</p>
                )}

                {/* Promotions */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Temukan promo menarik</h3>
                    {isLoading && banners.length === 0 ? (
                        <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-64 h-36 bg-gray-200 rounded-lg shadow-md mr-4 animate-pulse"></div>
                            ))}
                        </div>
                    ) : banners.length > 0 ? (
                        <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
                            {banners.map((banner, index) => (
                                <PromoBanner key={index} banner={banner} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Gagal memuat banner promosi.</p>
                    )}
                </div>
            </main>

            <BottomNav activePage="home" navigate={handleNavigation} />
        </div>
    );
}

export default HomePage;