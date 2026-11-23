import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(
  /\/$/,
  "",
);

export function backendUrlFor(path: string) {
  return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getToken(requestHeaders?: Headers) {
  const jwtToken = await auth.api.getToken({
    headers: requestHeaders ?? (await headers()),
  });

  if (!jwtToken?.token) {
    throw new Error("No session found. User might not be authenticated.");
  }

  return jwtToken.token;
}

export async function authFetch(
  api: string,
  options: RequestInit = {},
) {
  const token = await getToken();
  const headers = new Headers(options.headers);

  if (!headers.has("authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(api, {
    ...options,
    headers,
  });
}
