import axios, { AxiosError, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 30000,
});

const handleLogout = () => {
  localStorage.clear();
  window.location.reload();
};

const normalizeResponse = (response: AxiosResponse) => {
  return {
    message:
      response?.data?.message ||
      (response.status === 200
        ? "Request successful"
        : "Unable to process request. Try again later!"),
    data: response.data?.data || response.data || null,
    status: response.status,
    headers: response.headers,
    fullResponse: response?.data,
  };
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      config.headers["Content-Type"] === "multipart/form-data" ||
      config.url?.includes("download")
    ) {
      config.timeout = 0;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(undefined, (err) => {
  const url = err.response.config.url;

  if (url.startsWith("/auth/")) {
    return Promise.reject(err);
  }

  if (err.response.status === 401) {
    return handleLogout();
  }

  return Promise.reject(err);
});

export const request = {
  get: (url: string, headers?: any) =>
    instance
      .get(url, { headers })
      .then((res) => normalizeResponse(res))
      .catch((err: AxiosError) => Promise.reject(err.response)),

  post: <B>(url: string, body?: B, headers?: any) =>
    instance
      .post(url, body, { ...headers })
      .then((res) => normalizeResponse(res))
      .catch((err: AxiosError) => Promise.reject(err.response)),
  put: <B>(url: string, body: B, headers?: any) =>
    instance
      .put(url, body, { ...headers })
      .then((res) => normalizeResponse(res))
      .catch((err: AxiosError) => Promise.reject(err.response)),
  delete: <B>(url: string, body?: B, headers?: any) =>
    instance
      .delete(url, { data: body, ...headers })
      .then((res) => normalizeResponse(res))
      .catch((err: AxiosError) => Promise.reject(err.response)),
};
