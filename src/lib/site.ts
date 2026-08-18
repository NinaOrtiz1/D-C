import { Facebook, Instagram, MessageCircle, Music4, type LucideIcon } from "lucide-react";

export const SITE = {
  name: "DYC",
  tagline: "Diseño, creatividad y personalización para proyectos únicos y memorables.",
  whatsapp: "618 444 4686",
  whatsappUrl: "https://wa.me/526184444686",
  facebook: "https://www.facebook.com/profile.php?id=61567450161287",
  instagram:
    "https://www.instagram.com/cdinovacion?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  tiktok: "https://www.tiktok.com/@dc_d61?_r=1&_t=ZS-98rTFsFa8JB",
  city: "Durango, México",
  email: "contacto@dcinnovacion.mx",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Servicios", to: "/servicios" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Galería", to: "/galeria" },
  { label: "FAQ", to: "/faq" },
  { label: "Contacto", to: "/contacto" },
  { label: "Administración", to: "/admin" },
] as const;

export const SOCIALS: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
  colorClass: string;
}> = [
  { label: "Facebook", href: SITE.facebook, icon: Facebook, colorClass: "bg-[#1877F2] text-white" },
  {
    label: "Instagram",
    href: SITE.instagram,
    icon: Instagram,
    colorClass: "bg-gradient-to-tr from-[#405DE6] via-[#C13584] to-[#F56040] text-white",
  },
  { label: "TikTok", href: SITE.tiktok, icon: Music4, colorClass: "bg-[#000000] text-white" },
  {
    label: "WhatsApp",
    href: SITE.whatsappUrl,
    icon: MessageCircle,
    colorClass: "bg-[#25D366] text-white",
  },
] as const;
