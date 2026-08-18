import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";

const faqs = [
  {
    q: "¿Cuánto tarda un pedido?",
    a: "Los pedidos individuales se entregan normalmente entre 2 y 5 días hábiles. Los pedidos empresariales por volumen se cotizan con un plazo específico según la cantidad y el tipo de personalización.",
  },
  {
    q: "¿Hacen envíos?",
    a: "Sí. Realizamos entregas locales en Durango y enviamos a todo México mediante paquetería. El costo de envío se calcula al momento de la cotización.",
  },
  {
    q: "¿Puedo llevar mi propio vaso?",
    a: "Claro. Puedes traer tu propio vaso, termo o taza y nosotros nos encargamos únicamente del diseño y la personalización. Revisamos previamente el material para asegurar un buen acabado.",
  },
  {
    q: "¿Realizan pedidos empresariales?",
    a: "Sí. Trabajamos con empresas en kits corporativos, reconocimientos y artículos promocionales con precios preferenciales por volumen.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos efectivo, transferencia bancaria y pagos con tarjeta. Para pedidos grandes solicitamos un anticipo del 50%.",
  },
];

export function FAQ() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />

        <Reveal delay={0.1} className="mt-16">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card/70 px-2 shadow-soft"
              >
                <AccordionTrigger className="py-4 text-left font-display text-base font-semibold hover:no-underline sm:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
