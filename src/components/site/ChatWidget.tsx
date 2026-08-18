import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquare, Send, X } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiUrl, fetchWithTimeout } from "@/lib/api";

type Message = { id: string; role: "bot" | "user"; text: string };

const WELCOME = `¡Hola! 👋 Soy el asistente virtual de DYC.

Puedo ayudarte con:
• Cotizaciones y precios
• Grabado láser y personalización
• Productos y diseños a medida
• Tiempo de entrega
• Información general del negocio`;

const QUICK = [
  "¿Qué servicios ofrecen?",
  "¿Puedo cotizar un producto personalizado?",
  "¿Cuánto tardan en entregar?",
];


function getReply(input: string): string {
  const t = input.toLowerCase();

  if (t.includes("precio") || t.includes("cuesta") || t.includes("cotiz") || t.includes("vaso") || t.includes("personaliz")) {
    return `¡Claro! En DYC cotizamos según el tipo de producto, la cantidad y el nivel de detalle del diseño.

Te recomiendo enviarnos una referencia o una idea general para darte una propuesta más precisa. También puedes escribirnos por WhatsApp al 618 444 4686.`;
  }
  if (t.includes("tarda") || t.includes("entrega") || t.includes("tiempo") || t.includes("envio") || t.includes("envío")) {
    return `Los tiempos de entrega dependen del tipo de producto y la cantidad solicitada. En pedidos personales suele estar entre 2 y 5 días hábiles, y en proyectos mayores se confirma según el volumen.`;
  }
  if (t.includes("pago") || t.includes("tarjeta") || t.includes("transferencia") || t.includes("anticipo")) {
    return `Podemos revisar la opción de pago que mejor te convenga según tu pedido. En compras más grandes, normalmente se solicita un anticipo para confirmar la producción.`;
  }
  if (t.includes("láser") || t.includes("laser") || t.includes("grabado")) {
    return `Sí, en DYC trabajamos con grabado láser y personalización en distintos materiales. Podemos ayudarte a definir la mejor opción según tu producto y estilo.`;
  }
  if (t.includes("3d") || t.includes("impresión") || t.includes("impresion")) {
    return `Sí, también trabajamos con impresión 3D a medida para piezas, prototipos y proyectos personalizados. Si compartes la idea o una referencia, te ayudamos a evaluarla.`;
  }
  if (t.includes("envío") || t.includes("envio")) {
    return `Entregamos en Durango y enviamos a todo México por paquetería.
El costo del envío se calcula al momento de la cotización.`;
  }
  if (t.includes("hola") || t.includes("buenos") || t.includes("buenas") || t.includes("saludos") || t.includes("qué tal") || t.includes("como estas") || t.includes("quien eres") || t.includes("quién eres") || t.includes("que haces") || t.includes("ayuda")) {
    return `¡Hola! 👋 Soy el asistente virtual de DYC y puedo ayudarte con cotizaciones, diseños, tiempos de entrega y más. ¿Qué necesitas hoy?`;
  }

  if (t.includes("gracias") || t.includes("thank you")) {
    return `¡Con gusto! Estoy aquí para ayudarte con lo que necesites en DYC.`;
  }

  if (t.includes("adios") || t.includes("hasta luego") || t.includes("bye")) {
    return `¡Hasta luego! Si necesitas más ayuda con tus proyectos personalizados, aquí estoy.`;
  }

  return `Gracias por escribir. Con gusto te ayudamos a definir el mejor proyecto para ti. Cuéntanos un poco más sobre lo que buscas y te orientamos mejor.`;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: WELCOME },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || typing) return;

    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: value }]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetchWithTimeout(apiUrl('/chat'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: value }),
      });

      const data = await response.json().catch(() => null);
      const responseText = data?.data?.response ?? data?.response ?? getReply(value);

      setMessages((m) => [...m, { id: `b-${Date.now()}`, role: "bot", text: responseText }]);
    } catch {
      setMessages((m) => [...m, { id: `b-${Date.now()}`, role: "bot", text: getReply(value) }]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat con el asistente virtual"}
        aria-expanded={open}
        className="fixed right-5 bottom-5 z-60 inline-flex size-14 items-center justify-center rounded-full bg-wine text-wine-foreground shadow-float"
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Asistente virtual de DYC"
            className="fixed right-4 bottom-24 z-60 flex h-[min(560px,72vh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card/95 shadow-float backdrop-blur"
          >
            <header className="flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3.5">
              <Logo className="h-8 w-8" withName={false} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">DYC</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                  En línea
                </p>
              </div>
            </header>

            <div
              className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(148,40,67,0.08),transparent_45%),rgba(255,255,255,0.45)] px-4 py-4"
              role="log"
              aria-live="polite"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-wine text-wine-foreground"
                        : "border border-border bg-background text-foreground"
                    }`}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}

              {typing ? (
                <div className="flex justify-start">
                  <span className="flex gap-1 rounded-2xl border border-border bg-background px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="size-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </span>
                </div>
              ) : null}

              {messages.length === 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-wine/40 hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}

              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-background/70 p-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje…"
                aria-label="Mensaje para el asistente"
                className="h-11 rounded-full"
              />
              <Button
                type="submit"
                variant="wine"
                size="icon"
                aria-label="Enviar mensaje"
                disabled={typing || !input.trim()}
                className="size-11 shrink-0 rounded-full"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
