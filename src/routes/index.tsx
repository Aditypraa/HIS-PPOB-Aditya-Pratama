import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import TopUpPage from "../pages/TopUpPage";
import TransactionPage from "../pages/TransactionPage";
import PaymentPage from "../pages/PaymentPage";

// Auth Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { state } = useContext(AppContext);

    if (!state.authToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// Public Route (redirect to home if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { state } = useContext(AppContext);

    if (state.authToken) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />

            {/* Protected routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/topup"
                element={
                    <ProtectedRoute>
                        <TopUpPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <ProtectedRoute>
                        <PaymentPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transaction"
                element={
                    <ProtectedRoute>
                        <TransactionPage />
                    </ProtectedRoute>
                }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}


