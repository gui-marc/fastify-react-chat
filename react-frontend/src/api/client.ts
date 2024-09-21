import axios from "axios";
import { toast } from "sonner";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  if (import.meta.env.DEV) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// toast on timeout
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export { client };
