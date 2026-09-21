import dotenv from "dotenv";

import { hashPassword } from "./auth.js";
import { connectDatabase } from "./database.js";
import { ActivityLog, Banner, Category, Comment, Contact, FAQ, LoginHistory, News, Product, SiteConfig, Slider, SocialNetwork, User } from "./models.js";

dotenv.config();

function getSeedPassword(name: string) {
  const password = process.env[name]?.trim();
  if (!password) {
    throw new Error(`${name} no está configurada. Define las contraseñas del seed antes de ejecutarlo.`);
  }

  return password;
}

export async function seedDatabaseIfNeeded() {
  await connectDatabase();
  const hasUsers = Boolean(await User.exists({}));

  const adminPassword = await hashPassword(getSeedPassword("SEED_ADMIN_PASSWORD"));
  const editorPassword = await hashPassword(getSeedPassword("SEED_EDITOR_PASSWORD"));
  const clientPassword = await hashPassword(getSeedPassword("SEED_CLIENT_PASSWORD"));

  const admin = await User.findOneAndUpdate(
    { correo: "admin@dcinnovacion.mx" },
    {
      $setOnInsert: {
        nombre: "Administrador",
      },
      $set: {
        email: "admin@dcinnovacion.mx",
        password: adminPassword,
        rol: "admin",
        role: "admin",
        telefono: "6180000000",
        foto: "",
        activo: true,
        ultimoLogin: new Date(),
      },
    },
    { upsert: true, new: true },
  );

  const editor = await User.findOneAndUpdate(
    { correo: "editor@dcinnovacion.mx" },
    {
      $setOnInsert: {
        nombre: "Editor",
      },
      $set: {
        email: "editor@dcinnovacion.mx",
        password: editorPassword,
        rol: "editor",
        role: "editor",
        telefono: "6180000001",
        foto: "",
        activo: true,
      },
    },
    { upsert: true, new: true },
  );

  const clientOne = await User.findOneAndUpdate(
    { correo: "cliente1@dcinnovacion.mx" },
    {
      $setOnInsert: {
        nombre: "Cliente Uno",
      },
      $set: {
        email: "cliente1@dcinnovacion.mx",
        password: clientPassword,
        rol: "cliente",
        role: "cliente",
        telefono: "6180000002",
        foto: "",
        activo: true,
      },
    },
    { upsert: true, new: true },
  );

  const clientTwo = await User.findOneAndUpdate(
    { correo: "cliente2@dcinnovacion.mx" },
    {
      $setOnInsert: {
        nombre: "Cliente Dos",
      },
      $set: {
        email: "cliente2@dcinnovacion.mx",
        password: clientPassword,
        rol: "cliente",
        role: "cliente",
        telefono: "6180000003",
        foto: "",
        activo: true,
      },
    },
    { upsert: true, new: true },
  );

  const clients = [clientOne, clientTwo];

  if (!admin || !editor || !clientOne || !clientTwo) {
    throw new Error("No se pudieron preparar los usuarios base del sistema.");
  }

  if (hasUsers) {
    console.log("La base de datos ya tenía usuarios; se actualizaron las cuentas base sin duplicar contenido.");
    return false;
  }

  const categories = await Category.insertMany([
    { nombre: "Vasos", descripcion: "Vasos premium personalizados", activo: true },
    { nombre: "Termos", descripcion: "Termos personalizados", activo: true },
    { nombre: "Regalos", descripcion: "Regalos corporativos", activo: true },
    { nombre: "Grabado", descripcion: "Productos grabados", activo: true },
    { nombre: "Accesorios", descripcion: "Accesorios promocionales", activo: true },
  ]);

  const products = await Product.insertMany([
    { nombre: "Vaso térmico premium", descripcion: "Vaso térmico de acero con diseño premium", precio: 420, stock: 18, categoria: categories[0]._id, marca: "DYC Innovación", modelo: "VT-01", imagenes: [], activo: true },
    { nombre: "Termo de doble pared", descripcion: "Termo para regalo corporativo", precio: 560, stock: 9, categoria: categories[1]._id, marca: "DYC Innovación", modelo: "TR-12", imagenes: [], activo: true },
    { nombre: "Caja de regalo deluxe", descripcion: "Caja premium para obsequios", precio: 320, stock: 12, categoria: categories[2]._id, marca: "DYC Innovación", modelo: "RG-08", imagenes: [], activo: true },
    { nombre: "Placa grabada", descripcion: "Placa con grabado láser y detalles premium", precio: 360, stock: 14, categoria: categories[3]._id, marca: "DYC Innovación", modelo: "PG-04", imagenes: [], activo: true },
    { nombre: "Llavero corporativo", descripcion: "Llavero para eventos y promociones", precio: 180, stock: 30, categoria: categories[4]._id, marca: "DYC Innovación", modelo: "LK-16", imagenes: [], activo: true },
    { nombre: "Mug personalizado", descripcion: "Mug blanco con impresión personalizada", precio: 260, stock: 22, categoria: categories[0]._id, marca: "DYC Innovación", modelo: "MG-20", imagenes: [], activo: true },
    { nombre: "Botella deportiva", descripcion: "Botella con acabado sobrio y elegante", precio: 290, stock: 15, categoria: categories[1]._id, marca: "DYC Innovación", modelo: "BD-07", imagenes: [], activo: true },
    { nombre: "Mousepad grabado", descripcion: "Accesorio de escritorio premium", precio: 240, stock: 11, categoria: categories[3]._id, marca: "DYC Innovación", modelo: "MS-09", imagenes: [], activo: true },
    { nombre: "Agenda corporativa", descripcion: "Agenda de cuero con logo", precio: 480, stock: 8, categoria: categories[2]._id, marca: "DYC Innovación", modelo: "AG-11", imagenes: [], activo: true },
    { nombre: "Cenicero de cristal", descripcion: "Pieza para marcas premium", precio: 610, stock: 7, categoria: categories[4]._id, marca: "DYC Innovación", modelo: "CN-02", imagenes: [], activo: true },
  ]);

  await News.insertMany([
    { titulo: "Nuevo catálogo para temporada", contenido: "Hemos lanzado una nueva colección para regalos corporativos.", imagen: "", autor: "D&C Innovación", fecha: new Date(), activo: true },
    { titulo: "Grabado láser en promociones", contenido: "El grabado láser sigue siendo una de las opciones más solicitadas.", imagen: "", autor: "D&C Innovación", fecha: new Date(), activo: true },
    { titulo: "Personalización para eventos", contenido: "Creamos obsequios para convenciones, conferencias y más.", imagen: "", autor: "D&C Innovación", fecha: new Date(), activo: true },
    { titulo: "Nuevos materiales premium", contenido: "Exploramos acabados premium y detalles de alta gama.", imagen: "", autor: "D&C Innovación", fecha: new Date(), activo: true },
    { titulo: "Diseño para marcas", contenido: "Acompañamos marcas con productos que refuerzan su identidad.", imagen: "", autor: "D&C Innovación", fecha: new Date(), activo: true },
  ]);

  await FAQ.insertMany([
    { pregunta: "¿Hacen entregas a domicilio?", respuesta: "Sí, realizamos entregas nacionales con logística disponible.", imagen: "", orden: 1, activo: true },
    { pregunta: "¿Puedo personalizar mi producto?", respuesta: "Sí, ofrecemos personalización para marcas, nombres y diseños.", imagen: "", orden: 2, activo: true },
    { pregunta: "¿Qué tiempo de producción tienen?", respuesta: "Depende del volumen y acabado, pero normalmente entregamos en 3 a 7 días.", imagen: "", orden: 3, activo: true },
    { pregunta: "¿Trabajan con pedidos corporativos?", respuesta: "Sí, atendemos pedidos de volumen para empresas y eventos.", imagen: "", orden: 4, activo: true },
    { pregunta: "¿Puedo cotizar por WhatsApp?", respuesta: "Claro, puedes enviar tu requerimiento por WhatsApp o correo electrónico.", imagen: "", orden: 5, activo: true },
  ]);

  await Comment.insertMany([
    { usuario: admin._id, product: products[0]._id, comentario: "Muy buen producto y excelente acabado.", rating: 5, aprobado: true },
    { usuario: clients[0]._id, product: products[1]._id, comentario: "La calidad es muy buena.", rating: 4, aprobado: true },
    { usuario: clients[1]._id, product: products[2]._id, comentario: "Comentario pendiente de revisión.", rating: 5, aprobado: false },
    { usuario: admin._id, product: products[3]._id, comentario: "Excelente propuesta para regalos corporativos.", rating: 5, aprobado: true },
    { usuario: clients[0]._id, product: products[4]._id, comentario: "Muy buen servicio, lo recomiendo.", rating: 4, aprobado: false },
  ]);

  await Slider.insertMany([
    { titulo: "Personalización premium", descripcion: "Regalos, marca y detalles con distinción.", imagen: "", botonTexto: "Ver catálogo", botonLink: "/productos", orden: 1, activo: true },
    { titulo: "Producción ágil", descripcion: "Desde conceptos hasta entrega final.", imagen: "", botonTexto: "Cotizar", botonLink: "/contacto", orden: 2, activo: true },
    { titulo: "Diseño para marcas", descripcion: "Productos para negocios y eventos.", imagen: "", botonTexto: "Ver servicios", botonLink: "/servicios", orden: 3, activo: true },
  ]);

  await Banner.insertMany([
    { titulo: "Oferta especial", descripcion: "Regalos para empresas", imagen: "", enlace: "/productos", activo: true },
    { titulo: "Nuevos materiales", descripcion: "Personalización premium en cada detalle", imagen: "", enlace: "/servicios", activo: true },
    { titulo: "Eventos y promociones", descripcion: "Diseños para marcas y regalos corporativos", imagen: "", enlace: "/contacto", activo: true },
  ]);

  await SiteConfig.create({
    nombreEmpresa: "D&C Innovación",
    logo: "/uploads/logo.png",
    telefono: "618 444 4686",
    correo: "contacto@dcinnovacion.mx",
    direccion: "Durango, México",
    colorPrincipal: "#7b1e3a",
    colorSecundario: "#f4e7eb",
    descripcion: "Productos personalizados con grabado láser, impresión 3D y diseño a medida.",
  });

  await SocialNetwork.insertMany([
    { nombre: "Facebook", url: "https://facebook.com/dcinnovacion", activo: true },
    { nombre: "Instagram", url: "https://instagram.com/dcinnovacion", activo: true },
    { nombre: "TikTok", url: "https://www.tiktok.com/@dc_d61?_r=1&_t=ZS-98rTFsFa8JB", activo: true },
    { nombre: "WhatsApp", url: "https://wa.me/526184444686", activo: true },
  ]);

  await Contact.insertMany([
    { nombre: "María García", telefono: "6181112233", correo: "maria@example.com", mensaje: "Necesitamos cotización para regalos de empresa.", origen: "web", leido: false },
    { nombre: "Luis Pérez", telefono: "6182223344", correo: "luis@example.com", mensaje: "Consulta sobre thermo personalizado.", origen: "web", leido: true },
    { nombre: "Ana López", telefono: "6183334455", correo: "ana@example.com", mensaje: "Solicitamos información para un evento.", origen: "web", leido: false },
  ]);

  await ActivityLog.insertMany([
    { usuario: admin._id, accion: "LOGIN", recurso: "Auth", recursoId: String(admin._id), fecha: new Date(), ip: "127.0.0.1", userAgent: "seed" },
    { usuario: editor._id, accion: "CREATE", recurso: "Product", recursoId: String(products[0]._id), fecha: new Date(), ip: "127.0.0.1", userAgent: "seed" },
    { usuario: admin._id, accion: "APPROVE", recurso: "Comment", recursoId: String(products[0]._id), fecha: new Date(), ip: "127.0.0.1", userAgent: "seed" },
  ]);

  await LoginHistory.insertMany([
    { usuario: admin._id, ip: "127.0.0.1", userAgent: "seed", fecha: new Date(), exitoso: true },
    { usuario: editor._id, ip: "127.0.0.1", userAgent: "seed", fecha: new Date(), exitoso: true },
    { usuario: clients[0]._id, ip: "127.0.0.1", userAgent: "seed", fecha: new Date(), exitoso: false },
  ]);

  console.log("Seed ejecutado correctamente.");
  return true;
}

export async function seed() {
  return seedDatabaseIfNeeded();
}

if (process.argv[1] && /seed\.(ts|js)$/.test(process.argv[1])) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error ejecutando el seed:", error);
      process.exit(1);
    });
}
