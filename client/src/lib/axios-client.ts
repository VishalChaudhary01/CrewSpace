import axios from "axios";

import type { CustomError } from "@/types/error.type";

export const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.message;
    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/";
    }
    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  },
);

export default API;
