/* eslint-disable no-case-declarations */
import { AppAction, AppState } from "../types";
import { initialState } from "./initialState";

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload, error: null };

    case "SET_ERROR":
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.message || "Terjadi kesalahan yang tidak diketahui";
      return {
        ...state,
        isLoading: false,
        isSubmitting: false,
        error: { message: errorMessage },
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "LOGIN_SUCCESS":
      localStorage.setItem("authToken", action.payload.token);
      return {
        ...state,
        isLoading: false,
        isSubmitting: false,
        authToken: action.payload.token,
        error: null,
      };

    case "LOGOUT":
      localStorage.removeItem("authToken");
      return {
        ...initialState,
        authToken: null,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isSubmitting: false,
      };

    case "SET_BALANCE":
      return {
        ...state,
        balance: action.payload,
        isLoading: false,
        isSubmitting: false,
      };

    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload,
        isLoading: false,
      };

    case "SET_BANNERS":
      return {
        ...state,
        banners: action.payload,
        isLoading: false,
      };

    case "SET_TRANSACTION_HISTORY":
      const payload = action.payload;
      const newRecords = "records" in payload ? payload.records : [];
      const limit =
        "limit" in payload ? payload.limit : state.transactionHistory.limit;
      const offset =
        "offset" in payload ? payload.offset : state.transactionHistory.offset;
      const append = "append" in payload ? payload.append : false;
      const hasMore = newRecords.length === limit;

      return {
        ...state,
        transactionHistory: {
          records: append
            ? [...state.transactionHistory.records, ...newRecords]
            : newRecords,
          offset: append ? offset + newRecords.length : offset,
          limit,
          hasMore,
        },
        isLoading: false,
      };

    case "NAVIGATE":
      return {
        ...state,
        error: null,
        pageData: action.payload.data,
      };

    default:
      return state;
  }
}
