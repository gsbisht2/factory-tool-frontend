import axios from "axios";
import * as apiUrls from "./apiUrls";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const ugxToken = localStorage.getItem("UGXAuthorization");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (ugxToken) {
      config.headers.UGXAuthorization = `Uniqgrid ${ugxToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const resp = await axios.post(apiUrls.refresh, { refreshToken });

        if (resp.status === 200) {
          localStorage.setItem("authToken", resp.data.token);
          localStorage.setItem("refreshToken", resp.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${resp.data.token}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
