import { motion } from "motion/react";

import { Reveal, SectionHeading } from "@/components/motion/Reveal";

const steps = [
  { title: "Nos contactas", text: "Por WhatsApp, redes sociales o el formulario de cotización." },
  { title: "Nos envías tu idea", text: "Una foto, un boceto, un logotipo o simplemente una descripción." },
  { title: "Diseñamos una propuesta", text: "Preparamos el arte y te mostramos cómo se verá en el producto." },
  { title: "Apruebas el diseño", text: "Ajustamos los detalles hasta que quede exactamente como lo imaginas." },
  { title: "Fabricamos", text: "Grabado láser, impresión 3D o sublimación con control de calidad." },
  { title: "Entregamos", text: "Entrega local o envío a todo México, empacado y protegido." },
];

export function Process() {
  return (
    <section id="nosotros" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Un proceso claro, de la idea a tus manos"
          description="Somos un taller de personalización que combina tecnología y trato cercano. Así acompañamos cada pedido."
        />

        <div className="relative mt-16 md:mt-20">
          <span
            aria-hidden
            className="absolute top-0 left-[15px] hidden h-full w-px bg-border md:left-1/2 md:block"
          />
          <ol className="space-y-8 md:space-y-0">
            {steps.map((step, i) => (
              <li key={step.title} className="md:grid md:grid-cols-2 md:items-center md:gap-12">
                <Reveal
                  direction={i % 2 === 0 ? "right" : "left"}
                  delay={0.05 * i}
                  className={i % 2 === 0 ? "md:pr-4 md:text-right" : "md:order-2 md:pl-4"}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-3xl border border-border bg-card p-6 shadow-soft"
                  >
                    <span className="font-display text-sm font-semibold text-wine">
                      0{i + 1}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </motion.div>
                </Reveal>
                <div
                  aria-hidden
                  className={`hidden md:flex ${i % 2 === 0 ? "md:justify-start" : "md:order-1 md:justify-end"}`}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="-mx-[6px] size-3 rounded-full bg-wine ring-4 ring-background"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
