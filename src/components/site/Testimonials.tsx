import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";

import { SectionHeading } from "@/components/motion/Reveal";

const testimonials = [
  {
    name: "Mariana Ríos",
    role: "Cliente particular",
    text: "Pedí unos vasos grabados para el cumpleaños de mi papá y quedaron impecables. El detalle del grabado es finísimo.",
  },
  {
    name: "Carlos Medina",
    role: "Gerente, Grupo Sierra",
    text: "Nos entregaron 120 termos con nuestro logotipo en tiempo récord. Excelente comunicación durante todo el proceso.",
  },
  {
    name: "Ana Lucía Torres",
    role: "Organizadora de eventos",
    text: "Los llaveros personalizados fueron el detalle favorito de los invitados. Ya son mi proveedor de confianza.",
  },
  {
    name: "Jorge Peña",
    role: "Fundador, Café Norte",
    text: "La impresión 3D de nuestros display nos ahorró muchísimo. Diseño y acabado de primer nivel.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const item = testimonials[index] ?? testimonials[0]!;

  return (
    <section className="border-t border-border bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Testimonios" title="Lo que dicen nuestros clientes" />

        <div className="relative mt-14 min-h-64">
          <AnimatePresence mode="wait">
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12"
            >
              <div className="flex justify-center gap-1" aria-label="Calificación 5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-wine text-wine" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-6 font-display text-xl leading-relaxed text-balance-tight sm:text-2xl">
                “{item.text}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="block text-muted-foreground">{item.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setIndex(i)}
              aria-label={`Ver testimonio de ${t.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-wine" : "w-3 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
