import vaso from "@/assets/vasos.jpg?url";
import laser from "@/assets/grabado.jpg?url";
import tercer from "@/assets/figuras.jpg?url";
import llavero from "@/assets/llaveros.jpg?url";
import termo from "@/assets/termo.jpg?url";

export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  badge: string;
};

export type ServiceItem = {
  title: string;
  description: string;
  image: string;
  accent: string;
};

export const productCatalog: Product[] = [
  {
    id: 1,
    name: "Vaso térmico premium",
    category: "Vasos",
    description: "Termo premium grabado con nombre y logo para regalos corporativos o eventos.",
    price: 420,
    stock: 18,
    image: vaso,
    badge: "Más vendido",
  },
  {
    id: 2,
    name: "Placa grabada en madera",
    category: "Grabado Láser",
    description: "Pieza decorativa de alta precisión para regalos, aniversarios o branding.",
    price: 360,
    stock: 12,
    image: laser,
    badge: "Personalizable",
  },
  {
    id: 3,
    name: "Figuras 3D a medida",
    category: "Impresión 3D",
    description: "Prototipos y figuras con acabado limpio, exacto y visual premium.",
    price: 680,
    stock: 9,
    image: tercer,
    badge: "Nuevo",
  },
  {
    id: 4,
    name: "Llaveros metalizados",
    category: "Llaveros",
    description: "Diseño elegante y duradero para marca personal o souvenirs promocionales.",
    price: 190,
    stock: 28,
    image: llavero,
    badge: "Asignación",
  },
  {
    id: 5,
    name: "Termo de acero",
    category: "Termos",
    description: "Termo con personalización láser para marcas, equipos y regalos premium.",
    price: 520,
    stock: 15,
    image: termo,
    badge: "Calidad",
  },
];

export const serviceCatalog: ServiceItem[] = [
  {
    title: "Grabado Láser",
    description: "Grabado permanente en madera, metal, vidrio y acrílico con detalles finos.",
    image: laser,
    accent: "Precisión",
  },
  {
    title: "Impresión 3D",
    description: "Prototipos, piezas funcionales y piezas con diseño 3D personalizado.",
    image: tercer,
    accent: "Diseño",
  },
  {
    title: "Vasos y regalos",
    description: "Productos promocionales ideales para bodas, eventos y negocios.",
    image: vaso,
    accent: "Promocional",
  },
];

export const siteStats = [
  { label: "Piezas entregadas", value: "+500" },
  { label: "Tiempo de entrega", value: "48 h" },
  { label: "Satisfacción", value: "100%" },
];

export const heroSlides = [
  {
    title: "Personalización premium para ideas que marcan diferencia.",
    subtitle: "Diseñamos piezas únicas en grabado láser, impresión 3D y regalos corporativos.",
    image: vaso,
    ctaPrimary: "Cotizar ahora",
    ctaSecondary: "Ver catálogo",
  },
  {
    title: "Detalles finos y acabados que transmiten calidad.",
    subtitle:
      "La combinación entre tecnología y creatividad convierte cada pieza en una experiencia premium.",
    image: laser,
    ctaPrimary: "Solicitar diseño",
    ctaSecondary: "Explorar servicios",
  },
  {
    title: "Productos hechos a medida para tu marca y estilo.",
    subtitle:
      "Desde regalos empresariales hasta regalos personalizados para momentos inolvidables.",
    image: termo,
    ctaPrimary: "Hablar con un asesor",
    ctaSecondary: "Ver galería",
  },
];
