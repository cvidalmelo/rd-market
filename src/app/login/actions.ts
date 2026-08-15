"use server";

import { redirect } from "next/navigation";
import { conManejoDeError } from "@/lib/formularios";
import { cerrarSesion, iniciarSesion } from "@/lib/sesion";

export async function iniciarSesionAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  await conManejoDeError("/login", () => iniciarSesion(email, password));

  redirect("/");
}

export async function cerrarSesionAction() {
  await cerrarSesion();

  redirect("/login");
}
