import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Facebook, Instagram, MapPin, MessageCircle, Send } from "lucide-react";
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
import { apiUrl, fetchWithTimeout } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Escribe tu nombre completo."),
  phone: z.string().min(10, "Ingresa un teléfono de 10 dígitos.").max(15),
  message: z.string().min(10, "Cuéntanos un poco más sobre tu idea."),
});

type FormValues = z.infer<typeof schema>;

const socials = [
  { icon: Facebook, label: "Facebook", href: SITE.facebook },
  { icon: MessageCircle, label: "WhatsApp", href: SITE.whatsappUrl },
  { icon: Instagram, label: "Instagram", href: SITE.instagram },
];

export function Contact() {
  const [sending, setSending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSending(true);

    try {
      const response = await fetchWithTimeout(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: values.name,
          telefono: values.phone,
          mensaje: values.message,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "No se pudo enviar la solicitud.");
      }

      toast.success("Solicitud enviada", {
        description: `Gracias ${values.name}, te contactaremos muy pronto.`,
      });
      form.reset();
    } catch (submitError) {
      toast.error(
        submitError instanceof DOMException && submitError.name === "AbortError"
          ? "El servidor tardó demasiado en responder. Inténtalo de nuevo."
          : submitError instanceof Error
            ? submitError.message
            : "No se pudo enviar la solicitud. Inténtalo de nuevo.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contacto"
      className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contacto"
          title="Cotiza tu proyecto"
          description="Cuéntanos qué quieres personalizar y te enviamos una propuesta con precio y tiempo de entrega."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal direction="right">
            <div className="flex h-full flex-col gap-10 rounded-[2rem] border border-border bg-card p-10 shadow-soft">
              <div>
                <h3 className="font-display text-2xl font-semibold">Habla con nosotros</h3>
                <p className="mt-2 text-[0.95rem] text-muted-foreground sm:text-base">
                  Atención directa, sin intermediarios.
                </p>
              </div>

              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.35rem] border border-border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-wine/40 hover:bg-wine-soft/40"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <MessageCircle className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">WhatsApp</span>
                  <span className="block font-medium">{SITE.whatsapp}</span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-[1.35rem] border border-border p-4">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">Ubicación</span>
                  <span className="block font-medium">{SITE.city}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
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
              <div className="mt-auto flex min-h-40 items-center justify-center rounded-[1.35rem] border border-dashed border-border bg-muted/60 px-4 text-center text-sm text-muted-foreground">
                Mapa de Google Maps disponible próximamente
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-soft">
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
                            <Input
                              placeholder="Tu nombre"
                              className="h-12 rounded-xl text-base"
                              {...field}
                            />
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
                              className="h-12 rounded-xl text-base"
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Qué quieres personalizar?</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Ej. 30 vasos con logotipo grabado para un evento en octubre."
                            className="resize-none rounded-xl text-base"
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
