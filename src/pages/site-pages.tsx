import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Star, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { ImageGallery, InteractiveImage } from "@/components/ui/image-gallery";
import { productCatalog, serviceCatalog, siteStats } from "@/lib/site-data";
import { SITE, SOCIALS } from "@/lib/site";

export function HomePage() {
  return (
    <div className="site-shell">
      <section className="section-panel overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase shadow-soft backdrop-blur-sm">
                <Star className="size-3.5 text-wine" />
                Personalización premium
              </div>
              <h1 className="mt-6 font-display text-5xl leading-none text-balance-tight sm:text-6xl lg:text-[5rem]">
                <span className="text-wine">DYC</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                Diseñamos regalos, productos corporativos y piezas personalizadas con precisión,
                calidad visual y atención a cada detalle.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="wine" size="xl" className="group rounded-full">
                  <Link to="/contacto">
                    Solicitar cotización
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="rounded-full">
                  <Link to="/productos">Ver catálogo</Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {siteStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/80 bg-card/85 p-4 shadow-premium ring-1 ring-white/40"
                  >
                    <div className="font-display text-2xl font-semibold text-wine">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card p-3 shadow-premium">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />
                <InteractiveImage
                  src={productCatalog[0]?.image ?? ""}
                  alt="Productos personalizados"
                  loading="eager"
                  className="relative z-10 overflow-hidden rounded-[1.5rem]"
                  imageClassName="relative h-[440px] w-full object-cover sm:h-[520px]"
                />
              </div>
              <div className="absolute -left-3 bottom-6 rounded-2xl border border-border bg-background/90 p-4 shadow-premium backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Especialidad
                </div>
                <div className="mt-2 font-display text-xl font-semibold">Grabado láser</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Servicios"
            title="Soluciones pensadas para personalizar cada detalle"
            description="Combinamos creatividad, tecnología y precisión para entregar productos únicos y premium."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {serviceCatalog.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <article className="group overflow-hidden rounded-[1.8rem] border border-border/80 bg-card shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-float">
                  <div className="overflow-hidden">
                    <InteractiveImage
                      src={item.image}
                      alt={item.title}
                      className="overflow-hidden"
                      imageClassName="h-64 w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex rounded-full bg-wine-soft px-3 py-1 text-xs font-medium text-wine">
                      {item.accent}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Por qué elegirnos"
            title="Calidad, confianza y una experiencia profesional"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Layers3,
                title: "Diseño a medida",
                text: "Trabajamos contigo desde la idea hasta la pieza final.",
              },
              {
                icon: ShieldCheck,
                title: "Materiales premium",
                text: "Usamos acabados resistentes y de alta calidad.",
              },
              {
                icon: TrendingUp,
                title: "Proceso claro",
                text: "Te acompañamos con tiempos, cotización y seguimiento.",
              },
              {
                icon: CheckCircle2,
                title: "Entrega segura",
                text: "Empaque profesional y envío confiable a todo México.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <article className="rounded-[1.6rem] border border-border/80 bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-wine/25 hover:shadow-float">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-wine-soft text-wine">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Productos"
        title="Catálogo de piezas personalizadas"
        description="Descubre productos funcionales y visualmente premium para regalos, negocios y proyectos únicos."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {productCatalog.map((product, index) => (
          <Reveal key={product.id} delay={index * 0.05}>
            <div className="overflow-hidden rounded-[1.8rem] border border-border/80 bg-card shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-float">
              <InteractiveImage
                src={product.image}
                alt={product.name}
                className="overflow-hidden"
                imageClassName="h-60 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-wine-soft px-2.5 py-1 text-xs font-medium text-wine">
                    {product.badge}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">{product.name}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Precio
                    </div>
                    <div className="mt-1 text-xl font-semibold">${product.price} MXN</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Stock</div>
                    <div className="font-medium text-foreground">{product.stock}</div>
                  </div>
                </div>
                <Button asChild variant="wine" className="mt-6 w-full rounded-full">
                  <Link to="/contacto">Solicitar información</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Servicios"
        title="Especialistas en personalización y diseño"
        description="Cada proyecto se desarrolla con estrategia, creatividad y acabados profesionales de alto nivel."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {serviceCatalog.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08}>
            <article className="overflow-hidden rounded-[1.8rem] border border-border/80 bg-card shadow-premium">
              <InteractiveImage
                src={item.image}
                alt={item.title}
                className="overflow-hidden"
                imageClassName="h-64 w-full object-cover"
              />
              <div className="p-6">
                <span className="inline-flex rounded-full bg-wine-soft px-3 py-1 text-xs font-semibold text-wine">
                  {item.accent}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {[
          "Cotizaciones rápidas y claras.",
          "Diseño personalizado para marcas y proyectos exigentes.",
          "Gestión de pedidos por volumen y eventos.",
          "Proceso ágil con entregas puntuales.",
        ].map((point, index) => (
          <Reveal key={point} delay={index * 0.06}>
            <div className="flex items-start gap-4 rounded-[1.6rem] border border-border/80 bg-card p-5 shadow-premium">
              <span className="mt-1 inline-flex size-9 items-center justify-center rounded-full bg-wine text-wine-foreground">
                <CheckCircle2 className="size-4" />
              </span>
              <p className="text-base leading-7 text-muted-foreground">{point}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-float">
          <InteractiveImage
            src={productCatalog[0]?.image ?? ""}
            alt="Sobre DYC"
            className="overflow-hidden rounded-[1.5rem]"
            imageClassName="h-[520px] w-full object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="Nosotros"
            title="Una marca con visión creativa y ejecución precisa"
            align="left"
          />
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            DYC nace para transformar ideas en piezas únicas, funcionales y visualmente memorables.
            Diseñamos para personas, marcas y negocios que buscan dejar una huella distinta.
          </p>
          <div className="mt-6 space-y-4">
            {[
              "Enfoque en calidad, detalle y sostenibilidad.",
              "Métodos de trabajo claros y personalizados.",
              "Atención cercana y acompañamiento técnico.",
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-premium"
              >
                <CheckCircle2 className="mt-0.5 size-5 text-wine" />
                <span className="text-base text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GalleryPage() {
  const galleryItems = productCatalog.concat(productCatalog);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Galería"
        title="Trabajos que muestran nuestra identidad"
        description="Explora proyectos reales, piezas grabadas, regalos y prototipos con acabados premium."
      />
      <ImageGallery images={galleryItems.map((item) => ({ src: item.image, alt: item.name }))}>
        {({ open }) => (
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="overflow-hidden rounded-[1.7rem] border border-border/80 bg-card shadow-premium"
              >
                <button
                  type="button"
                  onClick={() => open(index)}
                  aria-label={`Ampliar imagen: ${item.name}`}
                  className="group block w-full cursor-zoom-in overflow-hidden text-left"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">{item.name}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ImageGallery>
    </section>
  );
}

export function FAQPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Preguntas frecuentes"
        title="Todo lo que necesitas saber antes de pedir tu proyecto"
      />
      <div className="mt-12 space-y-4">
        {[
          {
            q: "¿Cuánto tarda un pedido?",
            a: "Los pedidos estándar suelen entregarse en 2 a 5 días hábiles, dependiendo del material y la cantidad.",
          },
          {
            q: "¿Puedo mandar mi propio diseño?",
            a: "Sí, puedes compartir bocetos, logotipos o referencias para adaptarlos al producto final.",
          },
          {
            q: "¿Hacen entregas a todo México?",
            a: "Sí, realizamos envíos a nivel nacional y también entregas locales en Durango.",
          },
          {
            q: "¿Aceptan pedidos corporativos?",
            a: "Sí, trabajamos con empresas que necesitan productos promocionales, regalos o piezas a marca.",
          },
        ].map((item, index) => (
          <Reveal key={item.q} delay={index * 0.05}>
            <div className="rounded-[1.5rem] border border-border/80 bg-card p-5 shadow-premium">
              <h3 className="font-display text-xl font-semibold">{item.q}</h3>
              <p className="mt-2 text-base leading-7 text-muted-foreground">{item.a}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-soft">
          <SectionHeading eyebrow="Contacto" title="Hablemos de tu proyecto" align="left" />
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">WhatsApp:</strong> {SITE.whatsapp}
            </p>
            <p>
              <strong className="text-foreground">Ubicación:</strong> {SITE.city}
            </p>
            <p>
              <strong className="text-foreground">Correo:</strong> contacto@dcinnovacion.mx
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {SOCIALS.map(({ label, href, icon: Icon, colorClass }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex size-11 items-center justify-center rounded-full border border-border transition-all duration-300 hover:-translate-y-1 ${colorClass}`}
                aria-label={label}
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-soft">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Nombre</label>
              <input
                className="h-12 w-full rounded-xl border border-border bg-background px-4"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Teléfono</label>
              <input
                className="h-12 w-full rounded-xl border border-border bg-background px-4"
                placeholder="618 000 0000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Mensaje</label>
              <textarea
                className="min-h-32 w-full rounded-xl border border-border bg-background px-4 py-3"
                placeholder="Cuéntanos sobre tu producto o proyecto"
              />
            </div>
          </div>
          <Button variant="wine" size="xl" className="mt-6 w-full rounded-full">
            Enviar solicitud
          </Button>
        </div>
      </div>
    </section>
  );
}
