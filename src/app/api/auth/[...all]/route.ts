import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/** Endpoints de Better Auth: /api/auth/sign-in/email, /api/auth/sign-up/email, etc. */
export const { GET, POST } = toNextJsHandler(auth);
