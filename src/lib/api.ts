const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("qr_token") : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok) throw new Error(json.message || "Something went wrong");

  return json;
}

export const api = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
};