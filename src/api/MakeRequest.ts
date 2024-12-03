import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "https://9q80z8w6k0.execute-api.us-east-1.amazonaws.com/dev";

export const getAuthToken = (): string | null => {
    return localStorage.getItem("jwtToken");
  };

const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
): Promise<T> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Sec-Fetch-Mode": "cors",
    };

    if (token) {
      headers.Authorization = token;
    }

    const config: AxiosRequestConfig = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      data,
    };

        const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error("Request Error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("jwtToken"); 
      window.location.href = "/login";
    }

    throw error.response?.data || new Error("Something went wrong");
  }
};

export const api = {
  get: <T>(endpoint: string) =>
    apiRequest<T>("GET", endpoint, undefined),

  post: <T>(endpoint: string, data: any) =>
    apiRequest<T>("POST", endpoint, data),

  put: <T>(endpoint: string, data: any) =>
    apiRequest<T>("PUT", endpoint, data),

  delete: <T>(endpoint: string) =>
    apiRequest<T>("DELETE", endpoint, undefined),
};
