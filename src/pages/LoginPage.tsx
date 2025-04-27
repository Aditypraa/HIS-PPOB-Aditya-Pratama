import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { Mail, Lock } from "lucide-react";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import apiService from "../api";
import Illustrasi_Login from "../assets/Illustrasi_Login.png";

function LoginPage() {
  const { state, dispatch } = useContext(AppContext);
  const { isLoading } = state;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    dispatch({ type: "CLEAR_ERROR" });

    // Form validation
    if (!email || !password) {
      setFormError("Email dan password harus diisi.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError("Format email tidak valid.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password minimal 8 karakter.");
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiService.login(email, password);
      if (response.data?.token) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { token: response.data.token },
        });

        try {
          const profileRes = await apiService.getProfile();
          dispatch({ type: "SET_USER", payload: profileRes.data });

          const balanceRes = await apiService.getBalance();
          dispatch({ type: "SET_BALANCE", payload: balanceRes.data.balance });

          navigate("/"); // Navigate to home
        } catch (fetchError) {
          dispatch({ type: "SET_ERROR", payload: fetchError });
          navigate("/"); // Navigate home even if fetch fails
        }
      }
    } catch (error: any) {
      // Handle API error responses
      let errorMessage = "Terjadi kesalahan saat login.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;

        if (status === 400) {
          errorMessage = "Email atau password salah.";
        } else if (status === 401) {
          errorMessage = "Email atau password tidak valid.";
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormError(errorMessage);
      dispatch({ type: "SET_ERROR", payload: error });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Helper function to determine if an error should be shown with a field
  const hasError = (field: string) =>
    formError && formError.toLowerCase().includes(field);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 order-2 md:order-1">
        <div className="max-w-md mx-auto w-full">
          {/* Logo and Title */}
          <div className="flex items-center mb-6">
            <img
              src="https://placehold.co/30x30/f87171/ffffff?text=S"
              alt="SIMS Logo"
              className="h-8 w-8 mr-2 rounded"
            />
            <span className="text-xl font-bold text-gray-800">SIMS PPOB</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Masuk atau buat akun
          </h2>
          <p className="text-gray-600 mb-8 text-sm">untuk memulai</p>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <InputField
              icon={Mail}
              type="email"
              placeholder="masukan email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={hasError("email") ? formError : null}
            />

            <InputField
              icon={Lock}
              type="password"
              placeholder="masukan password anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={hasError("password") ? formError : null}
            />

            {formError && !hasError("email") && !hasError("password") && (
              <p className="text-red-500 text-sm mb-4">{formError}</p>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Masuk
            </Button>
          </form>

          {/* Link to Register */}
          <p className="text-center text-sm text-gray-600 mt-6">
            belum punya akun?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              disabled={isLoading}
            >
              Registrasi di sini
            </Button>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-8 relative overflow-hidden bg-[#FFF8F4] order-1 md:order-2">
        <img
          src={Illustrasi_Login}
          alt="Ilustrasi Login"
          className="max-w-sm lg:max-w-md xl:max-w-lg object-contain z-10 rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://placehold.co/400x400/cccccc/ffffff?text=Gagal+Muat";
          }}
        />
        {/* Decorative elements simplified */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-red-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-lg opacity-50 transform rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-8 h-8 bg-green-200 rounded-full opacity-50"></div>
      </div>
    </div>
  );
}

export default LoginPage;
