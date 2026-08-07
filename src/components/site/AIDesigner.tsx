import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wand2, ImageIcon, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";

const suggestions = [
  "Quiero un vaso negro con un dragón rojo estilo japonés.",
  "Termo plateado con grabado minimalista de montañas.",
  "Taza blanca con caligrafía elegante y el nombre Sofía.",
];

type Result = { prompt: string; title: string; details: string[] };

/**
 * Generador de conceptos. Hoy simula el resultado localmente;
 * la integración con OpenAI se conectará después a un endpoint del backend.
 */
function simulateDesign(prompt: string): Result {
  return {
    prompt,
    title: "Concepto generado",
    details: [
      "Estilo: ilustración vectorial de alto contraste",
      "Técnica sugerida: grabado láser + impresión UV",
      "Material recomendado: acero inoxidable mate",
      "Tiempo estimado de producción: 3 a 5 días hábiles",
    ],
  };
}

export function AIDesigner() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleGenerate = () => {
    const value = prompt.trim();
    if (!value || loading) return;
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(simulateDesign(value));
      setLoading(false);
    }, 1400);
  };

  return (
    <section id="ia" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Diseña con IA"
          title="Diseña tu vaso utilizando Inteligencia Artificial"
          description="Describe la idea que tienes en mente y genera un concepto inicial. Nuestro equipo lo refina y lo lleva a producción."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <label htmlFor="ai-prompt" className="text-sm font-medium">
                Describe tu diseño
              </label>
              <Textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder="Quiero un vaso negro con un dragón rojo estilo japonés."
                className="mt-3 resize-none rounded-2xl text-base"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-wine/40 hover:text-foreground"
                  >
                    {s.length > 42 ? `${s.slice(0, 42)}…` : s}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button variant="wine" size="xl" onClick={handleGenerate} disabled={loading}>
                  {loading ? <RefreshCcw className="animate-spin" /> : <Wand2 />}
                  {loading ? "Generando…" : "Generar Diseño"}
                </Button>
                <p className="text-xs text-muted-foreground">Vista previa conceptual</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="h-full rounded-3xl border border-border bg-muted/50 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </motion.div>
                ) : result ? (
                  <motion.article
                    key="result"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-wine-soft px-3 py-1 text-xs font-medium text-wine">
                      <ImageIcon className="size-3.5" /> {result.title}
                    </span>
                    <p className="mt-4 font-display text-lg leading-snug font-semibold">
                      “{result.prompt}”
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {result.details.map((d) => (
                        <li key={d} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-wine" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant="wineGhost"
                      size="lg"
                      className="mt-6 w-full rounded-full"
                    >
                      <a href="#contacto">Cotizar este diseño</a>
                    </Button>
                  </motion.article>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-64 flex-col items-center justify-center text-center"
                  >
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-background text-wine">
                      <Wand2 className="size-6" />
                    </span>
                    <p className="mt-5 max-w-xs text-sm text-muted-foreground">
                      Escribe tu idea y presiona “Generar Diseño” para ver una propuesta.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
