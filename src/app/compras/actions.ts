"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearCompra, eliminarCompra, normalizarCompra } from "@/lib/compras";
import { conManejoDeError } from "@/lib/formularios";

export async function crearCompraAction(formData: FormData) {
  const datos = normalizarCompra(Object.fromEntries(formData));
  await conManejoDeError("/compras/nueva", () => crearCompra(datos));

  revalidatePath("/compras");
  revalidatePath("/productos");
  redirect("/compras");
}

export async function eliminarCompraAction(formData: FormData) {
  const id = String(formData.get("id"));
  await eliminarCompra(id);

  revalidatePath("/compras");
  revalidatePath("/productos");
}
