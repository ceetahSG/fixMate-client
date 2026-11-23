import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",

  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});
export const { signIn, signUp, useSession } = createAuthClient();
