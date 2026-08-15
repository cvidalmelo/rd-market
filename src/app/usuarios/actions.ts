"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin } from "@/lib/dal";
import { conManejoDeError } from "@/lib/formularios";
import {
  actualizarUsuario,
  banearUsuario,
  crearUsuario,
  desbanearUsuario,
  eliminarUsuario,
  normalizarUsuario,
} from "@/lib/usuarios";

// Toda la administracion de usuarios exige rol de administrador.

export async function crearUsuarioAction(formData: FormData) {
  await exigirAdmin();

  const datos = normalizarUsuario(Object.fromEntries(formData));
  await conManejoDeError("/usuarios/nuevo", () => crearUsuario(datos));

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function actualizarUsuarioAction(formData: FormData) {
  await exigirAdmin();

  const id = String(formData.get("id"));
  const datos = normalizarUsuario(Object.fromEntries(formData));
  await conManejoDeError(`/usuarios/${id}/editar`, () => actualizarUsuario(id, datos));

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function eliminarUsuarioAction(formData: FormData) {
  const administrador = await exigirAdmin();
  const id = String(formData.get("id"));

  if (id === administrador.id) {
    redirect(
      `/usuarios?error=${encodeURIComponent("No puedes eliminar tu propia cuenta.")}`,
    );
  }

  await conManejoDeError("/usuarios", () => eliminarUsuario(id));

  revalidatePath("/usuarios");
}

export async function banearUsuarioAction(formData: FormData) {
  const administrador = await exigirAdmin();
  const id = String(formData.get("id"));

  if (id === administrador.id) {
    redirect(`/usuarios?error=${encodeURIComponent("No puedes bloquear tu propia cuenta.")}`);
  }

  await conManejoDeError("/usuarios", () => banearUsuario(id));

  revalidatePath("/usuarios");
}

export async function desbanearUsuarioAction(formData: FormData) {
  await exigirAdmin();

  const id = String(formData.get("id"));
  await conManejoDeError("/usuarios", () => desbanearUsuario(id));

  revalidatePath("/usuarios");
}
