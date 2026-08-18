import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wand2, ImageIcon, RefreshCcw, AlertCircle, Download, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageGallery } from "@/components/ui/image-gallery";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { apiUrl, fetchWithTimeout } from "@/lib/api";

const suggestions = [
  "Quiero un vaso negro con un dragón rojo estilo japonés.",
  "Termo plateado con grabado minimalista de montañas.",
  "Taza blanca con caligrafía elegante y el nombre Sofía.",
];

type Proposal = { id: number; title: string; prompt: string; imageUrl: string; failed?: boolean };

type Result = { prompt: string; title: string; details: string[]; proposals: Proposal[] };

export function AIDesigner() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");

  const handleGenerate = async (fromLastPrompt = false) => {
    const value = fromLastPrompt ? lastPrompt : prompt.trim();
    if (!value || loading) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setLastPrompt(value);

    try {
      const response = await fetchWithTimeout(apiUrl('/generar-diseno'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error((data?.error as string) || "No se pudo generar la imagen.");
      }

      setResult({
        prompt: value,
        title: "Diseño generado",
        details: [
          "Estilo: ilustración vectorial de alto contraste",
          "Técnica sugerida: grabado láser + impresión UV",
          "Material recomendado: acero inoxidable mate",
          "Tiempo estimado de producción: 3 a 5 días hábiles",
        ],
        proposals: (data?.images as Proposal[] | undefined) ?? [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetchWithTimeout(imageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${fileName}.png`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      setError(
        downloadError instanceof DOMException && downloadError.name === "AbortError"
          ? "La descarga tardó demasiado. Intenta de nuevo."
          : "No se pudo descargar la imagen. Intenta de nuevo.",
      );
    }
  };

  const markProposalAsFailed = (proposalId: number) => {
    setResult((current) => {
      if (!current) return current;
      return {
        ...current,
        proposals: current.proposals.map((proposal) =>
          proposal.id === proposalId ? { ...proposal, failed: true } : proposal,
        ),
      };
    });
  };

  return (
    <section id="ia" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Diseña con IA"
          title="Crea tu vaso con Pollinations"
          description="Escribe tu idea y deja que Pollinations genere propuestas visuales para vasos, termos y regalos personalizados."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-soft sm:p-10">
              <div className="space-y-3">
                <label htmlFor="ai-prompt" className="text-sm font-medium">
                  Describe tu diseño
                </label>
                <p className="text-sm leading-7 text-muted-foreground">
                  Usa palabras clave, colores y estilo para generar una propuesta visual en
                  Pollinations.
                </p>
              </div>
              <Textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder="Quiero un vaso negro con un dragón rojo estilo japonés."
                className="mt-4 resize-none rounded-2xl text-base"
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

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  variant="wine"
                  size="xl"
                  onClick={() => handleGenerate(false)}
                  disabled={loading}
                >
                  {loading ? <RefreshCcw className="animate-spin" /> : <Wand2 />}
                  {loading ? "Generando propuesta..." : "Generar Diseño"}
                </Button>
                {lastPrompt ? (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleGenerate(true)}
                    disabled={loading}
                  >
                    <RotateCcw />
                    Generar otra propuesta
                  </Button>
                ) : null}
                <p className="text-xs text-muted-foreground">Vista previa conceptual</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="min-h-130 h-full rounded-[2rem] border border-border bg-muted/50 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                      <RefreshCcw className="size-4 animate-spin text-wine" />
                      Generando propuesta...
                    </div>
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
                    <ImageGallery
                      images={result.proposals.map((proposal) => ({
                        src: proposal.imageUrl,
                        alt: proposal.title,
                        downloadName: proposal.title,
                      }))}
                    >
                      {({ open }) => (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          {result.proposals.map((proposal, index) => (
                            <div
                              key={proposal.id}
                              className="rounded-2xl border border-border bg-muted/40 p-3"
                            >
                              <div className="overflow-hidden rounded-xl border border-border bg-background">
                                {proposal.failed ? (
                                  <div className="flex h-48 items-center justify-center px-4 text-center text-sm text-muted-foreground">
                                    No se pudo cargar esta propuesta.
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => open(index)}
                                    aria-label={`Ampliar propuesta: ${proposal.title}`}
                                    className="group block w-full cursor-zoom-in"
                                  >
                                    <img
                                      src={proposal.imageUrl}
                                      alt={proposal.title}
                                      loading="lazy"
                                      decoding="async"
                                      onError={() => markProposalAsFailed(proposal.id)}
                                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                  </button>
                                )}
                              </div>
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{proposal.title}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(proposal.imageUrl, proposal.title)}
                                  className="h-8 rounded-full"
                                >
                                  <Download className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ImageGallery>
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
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-background/70 p-6 text-center"
                  >
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                      <AlertCircle className="size-6" />
                    </span>
                    <p className="mt-4 text-sm text-muted-foreground">{error}</p>
                  </motion.div>
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
