import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2, "Escribe tu nombre completo."),
  email: z.string().email("Ingresa un correo válido."),
  phone: z.string().min(10, "Ingresa un teléfono de 10 dígitos.").max(15),
  message: z.string().min(10, "Cuéntanos un poco más sobre tu idea."),
});

type FormValues = z.infer<typeof schema>;

const socials = [
  { icon: Facebook, label: "Facebook", href: SITE.facebook },
  { icon: MessageCircle, label: "WhatsApp", href: SITE.whatsappUrl },
  { icon: Instagram, label: "Instagram", href: SITE.instagram },
  { icon: Music2, label: "TikTok", href: SITE.tiktok },
];

export function Contact() {
  const [sending, setSending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  // Preparado para conectarse a un endpoint del backend (Express + PostgreSQL).
  const onSubmit = async (values: FormValues) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success("Solicitud enviada", {
      description: `Gracias ${values.name}, te contactaremos muy pronto.`,
    });
    form.reset();
  };

  return (
    <section id="contacto" className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contacto"
          title="Cotiza tu proyecto"
          description="Cuéntanos qué quieres personalizar y te enviamos una propuesta con precio y tiempo de entrega."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal direction="right">
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft">
              <div>
                <h3 className="font-display text-xl font-semibold">Habla con nosotros</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Atención directa, sin intermediarios.
                </p>
              </div>

              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-wine/40"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <MessageCircle className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">WhatsApp</span>
                  <span className="block font-medium">{SITE.whatsapp}</span>
                </span>
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-wine/40"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <Mail className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">Correo</span>
                  <span className="block font-medium">{SITE.email}</span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">Ubicación</span>
                  <span className="block font-medium">{SITE.city}</span>
                </span>
              </div>

              <div className="flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-all duration-300 hover:-translate-y-1 hover:border-wine/40 hover:text-wine"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>

              {/* Espacio reservado para Google Maps */}
              <div className="mt-auto flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/60 text-center text-xs text-muted-foreground">
                Mapa de Google Maps disponible próximamente
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" className="h-11 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="tel"
                              placeholder="618 000 0000"
                              className="h-11 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tucorreo@ejemplo.com"
                            className="h-11 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Qué quieres personalizar?</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Ej. 30 vasos con logotipo grabado para un evento en octubre."
                            className="resize-none rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="wine"
                    size="xl"
                    disabled={sending}
                    className="w-full"
                  >
                    <Send />
                    {sending ? "Enviando…" : "Solicitar Cotización"}
                  </Button>
                </form>
              </Form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
