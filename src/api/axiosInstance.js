import axios from "axios";
import * as apiUrls from "./apiUrls";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const ugxToken = localStorage.getItem("UGXAuthorization");

    if (ugxToken) {
      config.headers.Authorization = `Bearer ${ugxToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("UGXAuthorization");
        window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
