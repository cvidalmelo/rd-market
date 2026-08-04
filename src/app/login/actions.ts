"use server";

import { redirect } from "next/navigation";
import { conManejoDeError } from "@/lib/formularios";
import { autenticar, cerrarSesion, crearSesion } from "@/lib/sesion";

export async function iniciarSesionAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const usuario = await conManejoDeError("/login", () => autenticar(email, password));
  await crearSesion(usuario.id);

  redirect("/");
}

export async function cerrarSesionAction() {
  await cerrarSesion();

  redirect("/login");
}
