import { motion } from "motion/react";
import { Boxes, Flame, GlassWater, Gift, PenTool } from "lucide-react";

import { Reveal, SectionHeading } from "@/components/motion/Reveal";

const services = [
  {
    icon: Flame,
    title: "Grabado Láser",
    description:
      "Grabado permanente de alta precisión en metal, madera, acrílico y vidrio. Detalle fino y acabado profesional.",
  },
  {
    icon: Boxes,
    title: "Impresión 3D",
    description:
      "Prototipos, piezas funcionales y figuras a medida impresas con tolerancias precisas y múltiples materiales.",
  },
  {
    icon: GlassWater,
    title: "Vasos Personalizados",
    description:
      "Vasos, termos y tazas con tu nombre, logotipo o ilustración. Acabados duraderos resistentes al uso diario.",
  },
  {
    icon: PenTool,
    title: "Diseños Personalizados",
    description:
      "Creamos el arte desde cero: tipografías, ilustraciones y composiciones pensadas para tu producto.",
  },
  {
    icon: Gift,
    title: "Regalos Empresariales",
    description:
      "Kits corporativos y reconocimientos con la identidad de tu marca, listos para eventos y clientes.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Servicios"
          title="Tecnología y detalle en cada pieza"
          description="Combinamos maquinaria de precisión con diseño cuidado para convertir tus ideas en productos que se sienten premium."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group h-full rounded-3xl border border-border bg-card p-8 shadow-soft transition-shadow duration-300 hover:shadow-float"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-wine-soft text-wine transition-colors duration-300 group-hover:bg-wine group-hover:text-wine-foreground">
                  <service.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-6 block h-px w-10 bg-wine transition-all duration-300 group-hover:w-20" />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
