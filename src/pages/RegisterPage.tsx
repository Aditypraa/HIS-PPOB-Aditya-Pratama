import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { Mail, User, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import apiService from '../api';

function RegisterPage() {
    const { state, dispatch } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setFormError('');
        dispatch({ type: 'CLEAR_ERROR' });

        // Local Validation
        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            setFormError('Semua field harus diisi.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError('Format email tidak valid.');
            return;
        }
        if (password.length < 8) {
            setFormError('Password minimal 8 karakter.');
            return;
        }
        if (password !== confirmPassword) {
            setFormError('Konfirmasi password tidak cocok.');
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', payload: true });
        try {
            const response = await apiService.register(email, firstName, lastName, password);
            alert(response.message || 'Registrasi berhasil! Silakan masuk.');
            navigate('/login');
        } catch (error) {
            console.error("Registration API call failed:", error);
            dispatch({ type: 'SET_ERROR', payload: error });
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 order-2 md:order-1">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo and Title */}
                    <div className="flex items-center mb-6"> <img src="https://placehold.co/30x30/f87171/ffffff?text=S" alt="SIMS Logo" className="h-8 w-8 mr-2 rounded" /> <span className="text-xl font-bold text-gray-800">SIMS PPOB</span> </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Lengkapi data</h2>
                    <p className="text-gray-600 mb-8 text-sm">untuk membuat akun</p>
                    {/* Registration Form */}
                    <form onSubmit={handleRegister}>
                        <InputField icon={Mail} type="email" placeholder="masukan email anda" value={email} onChange={(e) => setEmail(e.target.value)} error={formError.includes('email') ? formError : null} />
                        <InputField icon={User} type="text" placeholder="nama depan" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={formError && !firstName ? formError : null} />
                        <InputField icon={User} type="text" placeholder="nama belakang" value={lastName} onChange={(e) => setLastName(e.target.value)} error={formError && !lastName ? formError : null} />
                        <InputField icon={Lock} type="password" placeholder="buat password" value={password} onChange={(e) => setPassword(e.target.value)} error={formError.includes('password') || formError.includes('minimal') ? formError : null} />
                        <InputField icon={Lock} type="password" placeholder="konfirmasi password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={formError.includes('cocok') ? formError : null} />
                        {/* Display local form error */}
                        {formError && !formError.includes('email') && !formError.includes('password') && !formError.includes('minimal') && !formError.includes('cocok') && !formError.includes('field') && <p className="text-red-500 text-sm mb-4">{formError}</p>}
                        {formError.includes('field') && <p className="text-red-500 text-sm mb-4">{formError}</p>}
                        <Button type="submit" fullWidth isLoading={state.isSubmitting} disabled={state.isSubmitting}>Registrasi</Button>
                    </form>
                    {/* Link to Login */}
                    <p className="text-center text-sm text-gray-600 mt-6"> sudah punya akun?{' '} <Button variant="link" onClick={() => navigate('login')} disabled={state.isSubmitting}> Masuk di sini </Button> </p>
                </div>
            </div>
            {/* Image Section */}
            <div className="hidden md:flex w-1/2 items-center justify-center p-8 relative overflow-hidden bg-[#FFF8F4] order-1 md:order-2">
                <img src="https://placehold.co/400x400/3b82f6/ffffff?text=Ilustrasi" alt="Ilustrasi Registrasi" className="max-w-sm lg:max-w-md xl:max-w-lg object-contain z-10 rounded-lg" onError={(e) => e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Gagal+Muat'} />
                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-12 h-12 bg-yellow-200 rounded-full opacity-50"></div> <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-200 rounded-lg opacity-50 transform -rotate-12"></div> <div className="absolute top-1/2 left-10 w-8 h-8 bg-pink-200 rounded-full opacity-50"></div>
            </div>
        </div>
    );
}

export default RegisterPage;