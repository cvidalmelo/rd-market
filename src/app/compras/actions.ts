"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearCompra, eliminarCompra, normalizarCompra } from "@/lib/compras";
import { ErrorDeValidacion } from "@/lib/errores";

export async function crearCompraAction(formData: FormData) {
  const datos = normalizarCompra(Object.fromEntries(formData));

  try {
    await crearCompra(datos);
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      redirect(`/compras/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

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
