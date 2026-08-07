import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquare, Send, X } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = { id: string; role: "bot" | "user"; text: string };

const WELCOME = `Hola. Soy el asistente virtual de D&C Innovación.

Puedo ayudarte con:
• Cotizaciones
• Grabado láser
• Vasos personalizados
• Impresión 3D
• Diseños
• Tiempo de entrega
• Métodos de pago`;

const QUICK = [
  "¿Cuánto cuesta un vaso personalizado?",
  "¿Cuánto tardan en entregar?",
  "¿Qué métodos de pago aceptan?",
];

/**
 * Respuestas simuladas. El componente está preparado para sustituir esta
 * función por una llamada al backend conectado a OpenAI.
 */
function getReply(input: string): string {
  const t = input.toLowerCase();

  if (t.includes("precio") || t.includes("cuesta") || t.includes("cotiz") || t.includes("vaso")) {
    return `Buenos días.
Somos D&C Innovación.

Un precio aproximado sería:
Vaso: $200 MXN
Diseño personalizado: $70 MXN

Precio estimado: $270 MXN

Este precio puede variar dependiendo del diseño solicitado.`;
  }
  if (t.includes("tarda") || t.includes("entrega") || t.includes("tiempo")) {
    return `Los pedidos individuales se entregan entre 2 y 5 días hábiles.
Para pedidos empresariales por volumen definimos una fecha al confirmar la cantidad.`;
  }
  if (t.includes("pago") || t.includes("tarjeta") || t.includes("transferencia")) {
    return `Aceptamos efectivo, transferencia bancaria y pago con tarjeta.
En pedidos grandes solicitamos un anticipo del 50%.`;
  }
  if (t.includes("láser") || t.includes("laser") || t.includes("grabado")) {
    return `Realizamos grabado láser en metal, madera, acrílico y vidrio.
El grabado es permanente y alcanza un detalle de hasta 0.1 mm.`;
  }
  if (t.includes("3d") || t.includes("impresión") || t.includes("impresion")) {
    return `Imprimimos piezas 3D a medida: prototipos, figuras y refacciones.
Envíanos tu archivo STL o descríbenos la pieza y te cotizamos.`;
  }
  if (t.includes("envío") || t.includes("envio")) {
    return `Entregamos en Durango y enviamos a todo México por paquetería.
El costo del envío se calcula al momento de la cotización.`;
  }
  return `Gracias por escribir. Con gusto te ayudamos.
¿Podrías darme más detalles del producto que quieres personalizar (tipo, cantidad y diseño)?
También puedes escribirnos por WhatsApp al 618 444 4686.`;
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

  const send = (text: string) => {
    const value = text.trim();
    if (!value || typing) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: `b-${Date.now()}`, role: "bot", text: getReply(value) }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 900);
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
        className="fixed right-5 bottom-5 z-[60] inline-flex size-14 items-center justify-center rounded-full bg-wine text-wine-foreground shadow-float"
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
            aria-label="Asistente virtual de D&C Innovación"
            className="fixed right-4 bottom-24 z-[60] flex h-[min(560px,72vh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-float"
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Logo className="h-8 w-8" withName={false} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">D&C Innovación</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                  En línea
                </p>
              </div>
            </header>

            <div
              className="flex-1 space-y-3 overflow-y-auto bg-muted/40 px-4 py-4"
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
              className="flex items-center gap-2 border-t border-border p-3"
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
