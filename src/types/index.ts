// API Response Types
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// User Types
export interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

// Service Types
export interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

// Transaction Types
export interface Transaction {
  invoice_number: string;
  transaction_type: string;
  description: string;
  total_amount: number;
  created_on: string;
}

export interface TransactionHistory {
  records: Transaction[];
  offset: number;
  limit: number;
  hasMore: boolean;
}

// Banner Types
export interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

// Page Data Types
export interface PaymentPageData {
  serviceCode: string;
  serviceName: string;
  amount: number;
}

// App State Types
export interface AppState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: { message: string } | null;
  authToken: string | null;
  user: User | null;
  balance: number | null;
  services: Service[];
  banners: Banner[];
  transactionHistory: TransactionHistory;
  pageData: PaymentPageData | null;
}

// Action Types
export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: any }
  | { type: "CLEAR_ERROR" }
  | { type: "LOGIN_SUCCESS"; payload: { token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_BALANCE"; payload: number }
  | { type: "SET_SERVICES"; payload: Service[] }
  | { type: "SET_BANNERS"; payload: Banner[] }
  | {
      type: "SET_TRANSACTION_HISTORY";
      payload:
        | TransactionHistory
        | {
            records: Transaction[];
            offset: number;
            limit: number;
            append?: boolean;
          };
    }
  | { type: "NAVIGATE"; payload: { page: string; data: any } };
