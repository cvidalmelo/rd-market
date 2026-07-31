"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  normalizarUsuario,
} from "@/lib/usuarios";

export async function crearUsuarioAction(formData: FormData) {
  const datos = normalizarUsuario(Object.fromEntries(formData));
  await crearUsuario(datos);

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function actualizarUsuarioAction(formData: FormData) {
  const id = String(formData.get("id"));
  const datos = normalizarUsuario(Object.fromEntries(formData));
  await actualizarUsuario(id, datos);

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function eliminarUsuarioAction(formData: FormData) {
  const id = String(formData.get("id"));
  await eliminarUsuario(id);

  revalidatePath("/usuarios");
}
