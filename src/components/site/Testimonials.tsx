import { motion } from "motion/react";
import { Star } from "lucide-react";

import { SectionHeading } from "@/components/motion/Reveal";

const testimonials = [
  {
    name: "Julia Margarita Jimenez Irungaray",
    date: "7 de junio de 2025",
    text: "Excelente calidad de trabajo",
  },
  {
    name: "Alma Ponce",
    date: "29 de noviembre de 2025",
    text: "Excelente trabajo! hicieron mi vaso con el logo de mi negocio y quedó padrísimo y también uno personalizado para el cumpleaños de mi esposo, los recomiendo ampliamente 😍😍🤞",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border bg-muted/40 py-24 md:py-32 lg:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Testimonios" title="Lo que dicen nuestros clientes" />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {testimonials.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-[1.8rem] border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-wine/30 hover:shadow-float sm:p-8"
            >
              <div className="flex gap-1 text-wine">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className="size-4 fill-wine text-wine" aria-hidden />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p className="font-semibold text-foreground">{item.name}</p>
                <span className="text-lg">⭐</span>
              </div>
              <p className="text-sm text-muted-foreground">recomienda D&C. · {item.date} · 🌐</p>
              <p className="mt-5 text-base leading-7 text-foreground sm:text-lg">"{item.text}"</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
