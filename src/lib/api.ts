import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// gets a short-lived JWT from Better Auth for calling the Express API (browser only)
async function getToken(): Promise<string | null> {
  const { data } = await authClient.$fetch<{ token: string }>("/token");
  return data?.token ?? null;
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean; // attach the JWT (default false)
};

// small fetch wrapper for the Express API
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = false, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  if (body !== undefined) finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Please sign in to continue", 401);
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again.", 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message || "Something went wrong", res.status);
  }

  return data as T;
}
