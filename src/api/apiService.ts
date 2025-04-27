// src/api/apiService.ts

import { ApiResponse, Banner, Service, Transaction, User } from "../types";
import apiClient from "./apiclient";

const apiService = {
  // Membership
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) =>
    apiClient
      .post<ApiResponse>(
        "/registration",
        {
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        },
        { headers: { isPublic: true } }
      )
      .then((res) => res.data),

  login: (email: string, password: string) =>
    apiClient
      .post<ApiResponse<{ token: string }>>(
        "/login",
        {
          email,
          password,
        },
        { headers: { isPublic: true } }
      )
      .then((res) => res.data),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>("/profile").then((res) => res.data),

  updateProfile: (firstName: string, lastName: string) =>
    apiClient
      .put<ApiResponse<User>>("/profile/update", {
        first_name: firstName,
        last_name: lastName,
      })
      .then((res) => res.data),

  updateProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient
      .put<ApiResponse<User>>("/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  // Information
  getBanners: () =>
    apiClient
      .get<ApiResponse<Banner[]>>("/banner", {
        headers: { isPublic: true },
      })
      .then((res) => res.data),

  getServices: () =>
    apiClient.get<ApiResponse<Service[]>>("/services").then((res) => res.data),

  // Transaction
  getBalance: () =>
    apiClient
      .get<ApiResponse<{ balance: number }>>("/balance")
      .then((res) => res.data),

  topUp: (amount: number) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return Promise.reject({
        status: 400,
        message: "Jumlah top up tidak valid.",
      });
    }
    return apiClient
      .post<ApiResponse<{ balance: number }>>("/topup", {
        top_up_amount: numericAmount,
      })
      .then((res) => res.data);
  },

  createTransaction: (serviceCode: string) =>
    apiClient
      .post<ApiResponse>("/transaction", {
        service_code: serviceCode,
      })
      .then((res) => res.data),

  getTransactionHistory: (offset = 0, limit = 5) =>
    apiClient
      .get<ApiResponse<{ records: Transaction[] }>>("/transaction/history", {
        params: { offset, limit },
      })
      .then((res) => res.data),
};

export default apiService;
