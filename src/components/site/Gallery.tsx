import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import vasos from "@/assets/vasos.jpg?url";
import laser from "@/assets/grabado.jpg?url";
import tridi from "@/assets/figuras.jpg?url";
import llaveros from "@/assets/llaveros.jpg?url";
import termos from "@/assets/termo.jpg?url";
import lamparas from "@/assets/lampara.jpg?url";
import tazas from "@/assets/vaso.jpg?url";
import decorativa2 from "@/assets/decorativa2.jpg?url";
import decorativa3 from "@/assets/decorativa3.jpg?url";
import grabado2 from "@/assets/grabado2.jpg?url";
import termo2 from "@/assets/termo2.jpg?url";
import termo3 from "@/assets/termo3.jpg?url";
import llaveros2 from "@/assets/llaveros2.jpg?url";
import varios from "@/assets/varios.jpg?url";

type Category =
  "Todos" | "Vasos" | "Grabado Láser" | "Impresión 3D" | "Llaveros" | "Termos" | "Lámparas";

const categories: Category[] = [
  "Todos",
  "Vasos",
  "Grabado Láser",
  "Impresión 3D",
  "Llaveros",
  "Termos",
  "Lámparas",
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
    src: lamparas,
    alt: "Lámpara personalizada con diseño grabado",
    category: "Lámparas",
    ratio: "4/5",
  },
  { src: tazas, alt: "Tazas de cerámica personalizadas", category: "Vasos", ratio: "1/1" },
  { src: decorativa2, alt: "Detalle decorativo personalizado", category: "Lámparas", ratio: "8/9" },
  {
    src: decorativa3,
    alt: "Pieza decorativa con acabado premium",
    category: "Lámparas",
    ratio: "4/5",
  },
  {
    src: grabado2,
    alt: "Detalle de grabado láser en pieza personalizada",
    category: "Grabado Láser",
    ratio: "1/1",
  },
  { src: termo2, alt: "Termo elegante con diseño personalizado", category: "Termos", ratio: "4/5" },
  { src: termo3, alt: "Termo con personalización premium", category: "Termos", ratio: "4/5" },
  {
    src: llaveros2,
    alt: "Llaveros personalizados con acabado fino",
    category: "Llaveros",
    ratio: "1/1",
  },
  {
    src: varios,
    alt: "Varias piezas personalizadas en composición",
    category: "Vasos",
    ratio: "3/4",
  },
];

function GalleryImage({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[1.4rem]" style={{ aspectRatio: ratio }}>
      {!loaded && !failed ? (
        <Skeleton className="absolute inset-0 h-full w-full rounded-[1.4rem]" />
      ) : null}
      {failed ? (
          <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-linear-to-br from-wine-soft to-muted px-4 text-center text-sm font-medium text-muted-foreground">
          {alt}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full rounded-[1.4rem] object-cover object-center transition-all duration-700 group-hover:scale-[1.03] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export function Gallery() {
  const [active, setActive] = useState<Category>("Todos");

  const filtered = active === "Todos" ? items : items.filter((i) => i.category === active);
  const viewerImages = filtered.map(({ src, alt }) => ({ src, alt }));

  return (
    <section
      id="galeria"
      className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32 lg:py-36"
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
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 ${
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

        <div className="mt-12">
          <ImageGallery images={viewerImages}>
            {({ open }) => (
              <>
                <div className="hidden lg:block">
                  <motion.div
                    layout
                    className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 *:mb-5"
                  >
                    <AnimatePresence mode="popLayout">
                      {filtered.map((item, index) => (
                        <motion.button
                          key={item.src}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          onClick={() => open(index)}
                          aria-label={`Ampliar imagen: ${item.alt}`}
                          className="group relative block w-full break-inside-avoid overflow-hidden rounded-[1.9rem] border border-border bg-card p-1.5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-float"
                        >
                          <GalleryImage src={item.src} alt={item.alt} ratio={item.ratio} />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <div className="lg:hidden">
                  <Carousel className="relative">
                    <CarouselContent className="flex touch-pan-x pb-4">
                      {filtered.map((item, index) => (
                        <CarouselItem key={item.src} className="px-4">
                          <motion.button
                            layout
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            onClick={() => open(index)}
                            aria-label={`Ampliar imagen: ${item.alt}`}
                            className="group relative w-[min(92vw,320px)] overflow-hidden rounded-[1.9rem] border border-border bg-card p-1.5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-float"
                          >
                            <GalleryImage src={item.src} alt={item.alt} ratio={item.ratio} />
                          </motion.button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {filtered.length > 1 ? (
                      <>
                        <CarouselPrevious className="-left-2 top-1/2 hidden h-10 w-10 rounded-full border border-border bg-background/95 text-foreground shadow-soft md:flex" />
                        <CarouselNext className="-right-2 top-1/2 hidden h-10 w-10 rounded-full border border-border bg-background/95 text-foreground shadow-soft md:flex" />
                      </>
                    ) : null}
                  </Carousel>
                </div>
              </>
            )}
          </ImageGallery>
        </div>
      </div>
    </section>
  );
}
