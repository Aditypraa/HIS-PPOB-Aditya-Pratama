import { AppState } from "../types";

export const initialState: AppState = {
  isLoading: false,
  isSubmitting: false,
  error: null,
  authToken: localStorage.getItem("authToken") || null,
  user: null,
  balance: null,
  services: [],
  banners: [],
  transactionHistory: { records: [], offset: 0, limit: 5, hasMore: true },
  pageData: null,
};
