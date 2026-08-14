import { auth } from "../src/lib/auth";
import prisma from "../src/lib/prisma";
import { ROL_ADMIN, ROL_USUARIO, type Rol } from "../src/lib/roles";

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

const usuarios: { nombre: string; email: string; password: string; rol: Rol }[] = [
  {
    nombre: "Ana Perez",
    email: "ana@minimarket.com",
    password: "ana1234",
    rol: ROL_ADMIN,
  },
  {
    nombre: "Carlos Vidal",
    email: "carlos@minimarket.com",
    password: "carlos1234",
    rol: ROL_USUARIO,
  },
];

/**
 * Las cuentas se crean a traves de Better Auth para que la contrasena quede
 * hasheada (scrypt) y se genere su fila en `account`. El rol se ajusta despues
 * porque el alta publica siempre asigna el rol por defecto.
 */
async function crearCuenta(datos: (typeof usuarios)[number]) {
  await auth.api.signUpEmail({
    body: { name: datos.nombre, email: datos.email, password: datos.password },
  });

  return prisma.user.update({
    where: { email: datos.email },
    data: { role: datos.rol },
  });
}

async function main() {
  await prisma.compra.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  const productosCreados = await Promise.all(
    productos.map((producto) => prisma.producto.create({ data: producto })),
  );

  // En serie: Better Auth escribe en varias tablas por cada alta.
  const usuariosCreados = [];
  for (const usuario of usuarios) {
    usuariosCreados.push(await crearCuenta(usuario));
  }

  // Una compra de ejemplo por usuario, descontando el stock igual que lo hace
  // la aplicacion. Asi se puede comprobar que cada quien ve solo las suyas.
  const compras = [
    { usuario: usuariosCreados[0], producto: productosCreados[0], cantidad: 2 },
    { usuario: usuariosCreados[1], producto: productosCreados[3], cantidad: 1 },
  ];

  for (const compra of compras) {
    await prisma.compra.create({
      data: {
        usuarioId: compra.usuario.id,
        productoId: compra.producto.id,
        cantidad: compra.cantidad,
      },
    });
    await prisma.producto.update({
      where: { id: compra.producto.id },
      data: { stock: { decrement: compra.cantidad } },
    });
  }

  console.log(
    `Datos de ejemplo cargados: ${productosCreados.length} productos, ${usuariosCreados.length} usuarios y ${compras.length} compras.`,
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
