"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearCompra, eliminarCompra, normalizarCompra } from "@/lib/compras";
import { exigirUsuario } from "@/lib/dal";
import { conManejoDeError } from "@/lib/formularios";

export async function crearCompraAction(formData: FormData) {
  const usuario = await exigirUsuario();

  const datos = normalizarCompra(Object.fromEntries(formData));
  await conManejoDeError("/compras/nueva", () => crearCompra(datos, usuario));

  revalidatePath("/compras");
  revalidatePath("/productos");
  redirect("/compras");
}

export async function eliminarCompraAction(formData: FormData) {
  const usuario = await exigirUsuario();

  const id = String(formData.get("id"));
  await conManejoDeError("/compras", () => eliminarCompra(id, usuario));

  revalidatePath("/compras");
  revalidatePath("/productos");
}
