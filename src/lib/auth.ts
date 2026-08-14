import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import prisma from "./prisma";
import { ROL_ADMIN, ROL_USUARIO } from "./roles";

/**
 * Instancia de Better Auth. Solo se habilita email y contrasena: el resto de
 * proveedores queda fuera del alcance del proyecto.
 *
 * `nextCookies()` tiene que ser el ultimo plugin para que las server actions
 * puedan escribir la cookie de sesion.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // El minimo por defecto es 8; se baja a 4 para respetar la regla de negocio
    // que ya validaba el formulario de usuarios.
    minPasswordLength: 4,
  },
  plugins: [
    admin({ defaultRole: ROL_USUARIO, adminRoles: [ROL_ADMIN] }),
    nextCookies(),
  ],
});

export type UsuarioSesion = typeof auth.$Infer.Session.user;
