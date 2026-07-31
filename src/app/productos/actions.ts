"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  normalizarProducto,
} from "@/lib/productos";

export async function crearProductoAction(formData: FormData) {
  const datos = normalizarProducto(Object.fromEntries(formData));
  await crearProducto(datos);

  revalidatePath("/productos");
  redirect("/productos");
}

export async function actualizarProductoAction(formData: FormData) {
  const id = String(formData.get("id"));
  const datos = normalizarProducto(Object.fromEntries(formData));
  await actualizarProducto(id, datos);

  revalidatePath("/productos");
  redirect("/productos");
}

export async function eliminarProductoAction(formData: FormData) {
  const id = String(formData.get("id"));
  await eliminarProducto(id);

  revalidatePath("/productos");
}
