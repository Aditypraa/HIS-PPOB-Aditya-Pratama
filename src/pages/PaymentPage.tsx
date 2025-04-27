import { useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { ArrowLeft, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import apiService from '../api';
import { getFallbackIcon } from '../utils/serviceIcons';

function PaymentPage() {
    const { state, dispatch } = useContext(AppContext);
    const { user, balance, pageData, isLoading, isSubmitting } = state;
    const [step, setStep] = useState('confirm');
    const { serviceCode = 'UNKNOWN', serviceName = 'Layanan Tidak Dikenal', amount = 0 } = pageData || {};
    const navigate = useNavigate();

    const refetchBalance = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true }); dispatch({ type: 'CLEAR_ERROR' });
        try {
            const balanceRes = await apiService.getBalance();
            dispatch({ type: 'SET_BALANCE', payload: balanceRes.data.balance });
        } catch (error) { dispatch({ type: 'SET_ERROR', payload: error }); }
        finally { dispatch({ type: 'SET_LOADING', payload: false }); }
    }, [dispatch]);

    const handleConfirmPayment = async () => {
        dispatch({ type: 'SET_SUBMITTING', payload: true }); dispatch({ type: 'CLEAR_ERROR' });
        try {
            if (balance !== null && balance < amount) { throw { message: 'Saldo tidak mencukupi.' }; } // Throw local error
            const response = await apiService.createTransaction(serviceCode);
            setStep('success');
            await refetchBalance(); // Refetch balance after success
        } catch (error) {
            console.error("Transaction API call failed:", error);
            dispatch({ type: 'SET_ERROR', payload: error });
            setStep('failed');
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    };

    const handleGoHome = () => navigate('/');
    const handleCancel = () => navigate('/');
    const ServiceDisplayIcon = serviceCode ? getFallbackIcon(serviceCode) : CreditCard;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md text-center relative">
                {/* Back/Close Buttons */}
                {step === 'confirm' && !isSubmitting && (
                    <button onClick={handleCancel} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700" aria-label="Kembali">
                        <ArrowLeft size={24} />
                    </button>
                )}
                {(step === 'success' || step === 'failed') && !isSubmitting && (<button onClick={handleGoHome} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" aria-label="Tutup"> <XCircle size={24} /> </button>)}
                {/* Header Info */}
                <div className="mb-6 border-b pb-4"> <p className="text-sm text-gray-500">Selamat datang,</p> <h2 className="text-lg font-medium text-gray-800">{user ? `${user.first_name} ${user.last_name}` : 'Pengguna'}</h2> <p className="text-sm text-gray-600 mt-2">Saldo anda: <span className={`font-semibold ml-1 ${balance === null ? 'italic text-gray-400' : ''}`}> {balance === null ? 'Memuat...' : formatCurrency(balance)} </span> </p> </div>
                {/* Payment Steps */}
                {step === 'confirm' && (<> <ServiceDisplayIcon size={48} className="text-red-500 mx-auto mb-4" /> <h3 className="text-xl font-semibold text-gray-800 mb-2">Konfirmasi Pembayaran</h3> <p className="text-gray-600 mb-1">Anda akan melakukan pembayaran</p> <p className="text-lg font-medium text-gray-900 mb-1">{serviceName}</p> <p className="text-gray-600 mb-4">senilai</p> <p className="text-3xl font-bold text-red-600 mb-8">{formatCurrency(amount)}</p> <div className="flex flex-col sm:flex-row gap-3"> <Button onClick={handleCancel} variant="secondary" fullWidth disabled={isSubmitting}> Batalkan </Button> <Button onClick={handleConfirmPayment} fullWidth isLoading={isSubmitting} disabled={isSubmitting || balance === null || balance < amount}> {balance !== null && balance < amount ? 'Saldo Kurang' : 'Lanjutkan Bayar'} </Button> </div> {balance !== null && balance < amount && <p className="text-red-500 text-xs mt-2">Saldo Anda tidak mencukupi untuk transaksi ini.</p>} </>)}
                {step === 'success' && (<> <CheckCircle size={64} className="text-green-500 mx-auto mb-4" /> <h3 className="text-xl font-semibold text-gray-800 mb-2">Pembayaran Berhasil</h3> <p className="text-gray-600 mb-1">Pembayaran {serviceName} sebesar</p> <p className="text-2xl font-bold text-gray-900 mb-6">{formatCurrency(amount)}</p> <p className="text-sm text-gray-500 mb-6">berhasil dilakukan.</p> <Button onClick={handleGoHome} fullWidth isLoading={isSubmitting}> Kembali ke Beranda </Button> </>)}
                {step === 'failed' && (<> <XCircle size={64} className="text-red-500 mx-auto mb-4" /> <h3 className="text-xl font-semibold text-gray-800 mb-2">Pembayaran Gagal</h3> <p className="text-gray-600 mb-1">Pembayaran {serviceName} sebesar</p> <p className="text-2xl font-bold text-gray-900 mb-6">{formatCurrency(amount)}</p> <p className="text-sm text-gray-500 mb-6">Silakan coba lagi nanti atau hubungi dukungan.</p> <Button onClick={handleGoHome} fullWidth isLoading={isSubmitting}> Kembali ke Beranda </Button> </>)}
            </div>
        </div>
    );
}

export default PaymentPage;