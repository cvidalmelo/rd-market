"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin } from "@/lib/dal";
import { conManejoDeError } from "@/lib/formularios";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  normalizarProducto,
} from "@/lib/productos";

// El catalogo lo consulta cualquier usuario con sesion, pero solo la
// administracion puede modificarlo.

export async function crearProductoAction(formData: FormData) {
  await exigirAdmin();

  const datos = normalizarProducto(Object.fromEntries(formData));
  await conManejoDeError("/productos/nuevo", () => crearProducto(datos));

  revalidatePath("/productos");
  redirect("/productos");
}

export async function actualizarProductoAction(formData: FormData) {
  await exigirAdmin();

  const id = String(formData.get("id"));
  const datos = normalizarProducto(Object.fromEntries(formData));
  await conManejoDeError(`/productos/${id}/editar`, () => actualizarProducto(id, datos));

  revalidatePath("/productos");
  redirect("/productos");
}

export async function eliminarProductoAction(formData: FormData) {
  await exigirAdmin();

  const id = String(formData.get("id"));
  await eliminarProducto(id);

  revalidatePath("/productos");
}
