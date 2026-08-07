import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import vasos from "@/assets/g-vasos.jpg";
import laser from "@/assets/g-laser.jpg";
import tridi from "@/assets/g-3d.jpg";
import llaveros from "@/assets/g-llaveros.jpg";
import termos from "@/assets/g-termos.jpg";
import empresarial from "@/assets/g-empresarial.jpg";
import tazas from "@/assets/g-tazas.jpg";

type Category =
  "Todos" | "Vasos" | "Grabado Láser" | "Impresión 3D" | "Llaveros" | "Termos" | "Empresarial";

const categories: Category[] = [
  "Todos",
  "Vasos",
  "Grabado Láser",
  "Impresión 3D",
  "Llaveros",
  "Termos",
  "Empresarial",
];

const items: { src: string; alt: string; category: Exclude<Category, "Todos">; ratio: string }[] = [
  { src: vasos, alt: "Vaso térmico negro personalizado", category: "Vasos", ratio: "4/5" },
  {
    src: laser,
    alt: "Grabado láser sobre placa de madera",
    category: "Grabado Láser",
    ratio: "1/1",
  },
  {
    src: tridi,
    alt: "Impresora 3D imprimiendo una pieza geométrica",
    category: "Impresión 3D",
    ratio: "3/4",
  },
  { src: llaveros, alt: "Llaveros metálicos grabados", category: "Llaveros", ratio: "1/1" },
  { src: termos, alt: "Termos de acero personalizados", category: "Termos", ratio: "4/5" },
  {
    src: empresarial,
    alt: "Kit de regalos empresariales personalizados",
    category: "Empresarial",
    ratio: "8/9",
  },
  { src: tazas, alt: "Tazas de cerámica personalizadas", category: "Vasos", ratio: "1/1" },
];

function GalleryImage({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative" style={{ aspectRatio: ratio }}>
      {!loaded ? <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" /> : null}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full rounded-2xl object-cover transition-all duration-700 group-hover:scale-[1.04] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export function Gallery() {
  const [active, setActive] = useState<Category>("Todos");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const filtered = active === "Todos" ? items : items.filter((i) => i.category === active);

  return (
    <section
      id="galeria"
      className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Galería"
          title="Trabajos que hablan por sí solos"
          description="Una selección de piezas personalizadas para clientes particulares y empresas."
        />

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Filtros de galería"
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active === cat
                    ? "border-wine bg-wine text-wine-foreground shadow-soft"
                    : "border-border bg-background text-muted-foreground hover:border-wine/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.button
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox({ src: item.src, alt: item.alt })}
                aria-label={`Ampliar imagen: ${item.alt}`}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <GalleryImage src={item.src} alt={item.alt} ratio={item.ratio} />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-xs font-medium tracking-wide text-white">
                    {item.category}
                  </span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Cerrar imagen"
              className="absolute top-5 right-5 inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-float"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
