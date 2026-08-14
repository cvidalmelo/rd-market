import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/** Cliente de Better Auth para los componentes que corren en el navegador. */
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
