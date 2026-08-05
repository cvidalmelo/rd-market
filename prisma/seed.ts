import prisma from "../src/lib/prisma";

const productos = [
  {
    nombre: "Leche entera 1L",
    descripcion: "Leche pasteurizada en envase de un litro",
    precio: 2.5,
    stock: 24,
    categoria: "Lacteos",
  },
  {
    nombre: "Arroz 1kg",
    descripcion: "Arroz blanco de grano largo",
    precio: 1.75,
    stock: 40,
    categoria: "Granos",
  },
  {
    nombre: "Aceite de girasol 900ml",
    descripcion: null,
    precio: 3.2,
    stock: 18,
    categoria: "Aceites",
  },
  {
    nombre: "Pan de molde",
    descripcion: "Paquete de 500g",
    precio: 2.1,
    stock: 12,
    categoria: "Panaderia",
  },
];

const usuarios = [
  { nombre: "Ana Perez", email: "ana@minimarket.com", password: "ana1234" },
  { nombre: "Carlos Vidal", email: "carlos@minimarket.com", password: "carlos1234" },
];

async function main() {
  await prisma.compra.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.usuario.deleteMany();

  const productosCreados = await Promise.all(
    productos.map((producto) => prisma.producto.create({ data: producto })),
  );

  const usuariosCreados = await Promise.all(
    usuarios.map((usuario) => prisma.usuario.create({ data: usuario })),
  );

  // Una compra de ejemplo, descontando el stock igual que lo hace la aplicacion.
  const cantidad = 2;
  await prisma.compra.create({
    data: {
      usuarioId: usuariosCreados[0].id,
      productoId: productosCreados[0].id,
      cantidad,
    },
  });
  await prisma.producto.update({
    where: { id: productosCreados[0].id },
    data: { stock: { decrement: cantidad } },
  });

  console.log(
    `Datos de ejemplo cargados: ${productosCreados.length} productos, ${usuariosCreados.length} usuarios y 1 compra.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
