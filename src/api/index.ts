import axios, { AxiosError } from "axios";
import { User, ApiResponse, Banner, Service, Transaction } from "../types";

// --- API Configuration ---
const API_BASE_URL = "https://take-home-test-api.nutech-integrasi.com";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomAxiosConfig {
  headers: Record<string, any> & {
    isPublic?: boolean;
  };
}

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const newConfig = config as CustomAxiosConfig;

    if (token && !newConfig.headers.isPublic) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Remove custom header so it's not sent to the server
    if (newConfig.headers.isPublic) {
      delete newConfig.headers.isPublic;
    }

    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    // Check the 'status' field within the JSON data as per API docs
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
    const errorData = {
      status: error.response?.status || 500,
      message: error.response?.data
        ? (error.response.data as any).message
        : error.message ||
          "Tidak dapat terhubung ke server atau terjadi kesalahan tidak dikenal.",
      data: error.response?.data ? (error.response.data as any).data : null,
    };
    return Promise.reject(errorData);
  }
);

// --- API Service Functions ---
const apiService = {
  // --- Membership ---
  register: async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    try {
      const res = await apiClient.post<ApiResponse>(
        "/registration",
        {
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        },
        { headers: { isPublic: true } }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await apiClient.post<ApiResponse<{ token: string }>>(
        "/login",
        {
          email,
          password,
        },
        { headers: { isPublic: true } }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const res = await apiClient.get<ApiResponse<User>>("/profile");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (firstName: string, lastName: string) => {
    try {
      const res = await apiClient.put<ApiResponse<User>>("/profile/update", {
        first_name: firstName,
        last_name: lastName,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfileImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.put<ApiResponse<User>>(
        "/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Information ---
  getBanners: async () => {
    try {
      const res = await apiClient.get<ApiResponse<Banner[]>>("/banner", {
        headers: { isPublic: true },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getServices: async () => {
    try {
      const res = await apiClient.get<ApiResponse<Service[]>>("/services");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Transaction ---
  getBalance: async () => {
    try {
      const res = await apiClient.get<ApiResponse<{ balance: number }>>(
        "/balance"
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  topUp: async (amount: number) => {
    // Ensure amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw {
        status: 400,
        message: "Jumlah top up tidak valid.",
      };
    }

    try {
      const res = await apiClient.post<ApiResponse<{ balance: number }>>(
        "/topup",
        {
          top_up_amount: numericAmount,
        }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  createTransaction: async (serviceCode: string) => {
    try {
      const res = await apiClient.post<ApiResponse>("/transaction", {
        service_code: serviceCode,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getTransactionHistory: async (offset = 0, limit = 5) => {
    try {
      const res = await apiClient.get<ApiResponse<{ records: Transaction[] }>>(
        "/transaction/history",
        {
          params: { offset, limit },
        }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
