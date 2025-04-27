/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import apiService from "../api/apiService";

export const useHomePageData = () => {
  const { state, dispatch } = useContext(AppContext);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const fetchData = useCallback(async () => {
    if (
      (state.user &&
        state.balance !== null &&
        state.services.length > 0 &&
        state.banners.length > 0) ||
      state.isLoading
    ) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    let hasError = false;

    try {
      const results = await Promise.allSettled([
        !state.user
          ? apiService.getProfile()
          : Promise.resolve({ data: state.user }),
        state.balance === null
          ? apiService.getBalance()
          : Promise.resolve({ data: { balance: state.balance } }),
        state.services.length === 0
          ? apiService.getServices()
          : Promise.resolve({ data: state.services }),
        state.banners.length === 0
          ? apiService.getBanners()
          : Promise.resolve({ data: state.banners }),
      ]);

      const [profileRes, balanceRes, servicesRes, bannersRes] = results;

      if (profileRes.status === "fulfilled" && profileRes.value.data) {
        dispatch({ type: "SET_USER", payload: profileRes.value.data });
      } else if (profileRes.status === "rejected") {
        handleApiError(profileRes.reason, "Gagal memuat profil.", logout);
        hasError = true;
      }

      if (
        balanceRes.status === "fulfilled" &&
        balanceRes.value.data.balance !== undefined
      ) {
        dispatch({
          type: "SET_BALANCE",
          payload: balanceRes.value.data.balance,
        });
      } else if (balanceRes.status === "rejected") {
        handleApiError(balanceRes.reason, "Gagal memuat saldo.", logout);
        hasError = true;
      }

      if (servicesRes.status === "fulfilled" && servicesRes.value.data) {
        dispatch({ type: "SET_SERVICES", payload: servicesRes.value.data });
      } else if (servicesRes.status === "rejected") {
        handleApiError(servicesRes.reason, "Gagal memuat layanan.", logout);
        hasError = true;
      }

      if (bannersRes.status === "fulfilled" && bannersRes.value.data) {
        dispatch({ type: "SET_BANNERS", payload: bannersRes.value.data });
      } else if (bannersRes.status === "rejected") {
        handleApiError(bannersRes.reason, "Gagal memuat banner.", logout);
        hasError = true;
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      if (!hasError) {
        dispatch({ type: "SET_ERROR", payload: "Terjadi kesalahan jaringan." });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state, dispatch]);

  return { fetchData };
};

const handleApiError = (
  error: any,
  defaultMessage: string,
  logout: () => void
) => {
  const { dispatch } = useContext(AppContext);

  dispatch({
    type: "SET_ERROR",
    payload: error?.message || defaultMessage,
  });

  if (error?.status === 401 || error?.status === 108) {
    setTimeout(logout, 100);
  }
};
