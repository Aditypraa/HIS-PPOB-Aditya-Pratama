import { useEffect, useContext } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import { AppContext } from './contexts/AppContext';
import AppRoutes from './routes';
import apiService from './api';
import ErrorDisplay from './components/common/ErrorDisplay';
import { AppProvider } from './contexts/AppContext';

// App with router
function AppWithProvider() {
  const { state, dispatch } = useContext(AppContext);

  // Check token validity on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        if (state.authToken) {
          dispatch({ type: 'LOGOUT' });
        }
        return;
      }

      if (!state.user) {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        try {
          const profileRes = await apiService.getProfile();
          dispatch({ type: 'SET_USER', payload: profileRes.data });

          const balanceRes = await apiService.getBalance();
          dispatch({ type: 'SET_BALANCE', payload: balanceRes.data.balance });
        } catch (error) {
          console.error("Token validation failed:", error);
          const typedError = error as any;
          if (typedError?.status === 401 || typedError?.status === 108) {
            dispatch({ type: 'LOGOUT' });
          } else {
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memverifikasi sesi Anda.' });
          }
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    checkAuth();
  }, [dispatch, state.authToken, state.user]);

  // Show loading overlay if loading critical initial data while authenticated
  if (state.isLoading && state.authToken && !state.user) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-[100]">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <ErrorDisplay />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

// Main App component with provider
function App() {
  return (
    <AppProvider>
      <AppWithProvider />
    </AppProvider>
  );
}

export default App;
