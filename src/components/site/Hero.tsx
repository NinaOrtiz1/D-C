import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkle } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/ui/image-gallery";
import heroImage from "@/assets/vasos.jpg?url";
import { SITE } from "@/lib/site";

const words = "DYC".split(" ");

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    let link: HTMLLinkElement | null = null;
    try {
      link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = heroImage;
      document.head.appendChild(link);
    } catch {
      link = null;
    }

    return () => {
      try {
        if (link && document.head.contains(link)) document.head.removeChild(link);
      } catch {
        /* ignore */
      }
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden px-2 pt-24 pb-20 sm:pt-28 sm:pb-24 md:pt-32 md:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_20%_-10%,var(--wine-soft),transparent_60%),radial-gradient(50rem_35rem_at_100%_10%,var(--muted),transparent_70%)]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div style={{ opacity }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase"
          >
            <Sparkle className="size-3.5 text-wine" />
            Grabado láser · Impresión 3D · Personalización
          </motion.span>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] font-semibold text-balance-tight sm:text-6xl lg:text-7xl xl:text-[5rem]">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={i === 1 ? "inline-block text-wine" : "inline-block"}
              >
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild variant="wine" size="xl" className="group">
              <a href="#contacto">
                Solicitar Cotización
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-full">
              <a href="#galeria">Ver Trabajos</a>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 grid max-w-lg grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3 sm:gap-6"
          >
            {[
              { k: "+500", v: "Piezas entregadas" },
              { k: "48 h", v: "Entrega express" },
              { k: "100%", v: "Diseño a medida" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-2xl font-semibold text-wine sm:text-[1.6rem]">
                  {s.k}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div style={{ y }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2.35rem] border border-border bg-muted/40 shadow-float"
          >
            <ImageGallery images={[{ src: heroImage, alt: "Composición de productos personalizados" }]}>
              {({ open }) =>
                imageError ? (
                  <div className="flex h-104 w-full items-center justify-center bg-linear-to-br from-wine-soft via-background to-muted px-6 text-center text-lg font-medium text-muted-foreground sm:h-128 lg:h-152">
                    Imagen no disponible en este momento. Pronto tendremos nuevas fotos del catálogo.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => open(0)}
                    aria-label="Ampliar imagen de productos personalizados"
                    className="block w-full cursor-zoom-in"
                  >
                    <img
                      src={heroImage}
                      alt="Composición de productos personalizados: vaso térmico grabado, termo, taza, piezas de impresión 3D y llaveros"
                      width={1200}
                      height={1408}
                      loading="eager"
                      decoding="async"
                      onError={() => setImageError(true)}
                      className="h-104 w-full object-cover object-center sm:h-128 lg:h-152"
                    />
                  </button>
                )
              }
            </ImageGallery>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-4 hidden rounded-[1.4rem] border border-border glass px-5 py-4 shadow-soft lg:block"
          >
            <p className="text-xs text-muted-foreground">Grabado láser de precisión</p>
            <p className="mt-1 font-display text-lg font-semibold">0.1 mm de detalle</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -top-5 -right-3 hidden rounded-[1.4rem] border border-border glass px-5 py-4 shadow-soft lg:block"
          >
            <p className="text-xs text-muted-foreground">Impresión 3D</p>
            <p className="mt-1 font-display text-lg font-semibold">Prototipos en 24 h</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
