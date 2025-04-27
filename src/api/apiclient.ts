/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/apiClient.ts
import axios, { AxiosError, AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && !config.headers?.isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers?.isPublic) {
      delete config.headers.isPublic;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (response.data.status !== 0) {
      return Promise.reject({
        status: response.data.status,
        message: response.data.message || "Terjadi kesalahan API",
        data: response.data.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject({
      status: error.response?.status || 500,
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "Terjadi kesalahan tidak dikenal.",
      data: (error.response?.data as any)?.data || null,
    });
  }
);

export default apiClient;
