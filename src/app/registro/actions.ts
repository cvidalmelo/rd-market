"use server";

import { redirect } from "next/navigation";
import { conManejoDeError } from "@/lib/formularios";
import { registrarUsuario } from "@/lib/sesion";
import { normalizarUsuario, validarDatosDeCuenta } from "@/lib/usuarios";

export async function registrarseAction(formData: FormData) {
  const datos = normalizarUsuario(Object.fromEntries(formData));

  await conManejoDeError("/registro", async () => {
    validarDatosDeCuenta(datos);

    return registrarUsuario(datos.nombre, datos.email, datos.password);
  });

  redirect("/");
}
