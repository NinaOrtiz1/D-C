import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiUrl, fetchWithTimeout } from "@/lib/api";
import {
  clearStoredAdminAuth,
  getAdminSessionState,
  readStoredAdminAuth,
  saveStoredAdminAuth,
} from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionState, setSessionState] = useState(() => getAdminSessionState());

  useEffect(() => {
    const saved = readStoredAdminAuth();
    if (saved?.token && saved?.role) {
      setRememberMe(Boolean(saved.rememberMe ?? true));
      setSessionState(getAdminSessionState());
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Introduce tu correo y contraseña para continuar.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetchWithTimeout(apiUrl("/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const payload = await response.json();
      const user = payload?.data?.user;
      const role = user?.rol ?? user?.role;

      if (!response.ok || !payload?.data?.user) {
        setError(payload?.message || "Las credenciales no son válidas.");
        return;
      }

      if (role !== "admin") {
        setError("Tu usuario no tiene permisos de administrador.");
        return;
      }

      saveStoredAdminAuth("", role, rememberMe);
      await navigate({ to: "/admin" });
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoutCurrentSession = () => {
    clearStoredAdminAuth();
    void fetchWithTimeout(apiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
    setError("Sesión actual cerrada. Puedes iniciar sesión de nuevo.");
  };

  return (
    <div className="admin-screen relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-aether)_16%,transparent),transparent_28%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-gold)_12%,transparent),transparent_30%),var(--color-background)] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full border border-aether/10 bg-aether/5 blur-sm" />
      <div className="pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full border border-gold/10 bg-gold/5 blur-sm" />
      <div className="admin-panel admin-shine relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="absolute inset-x-10 top-0 h-1 rounded-full bg-gradient-to-r from-aether via-gold to-transparent" />
        <div className="relative hidden overflow-hidden border-r border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-aether)_9%,transparent),color-mix(in_srgb,var(--color-gold)_9%,transparent),transparent)] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-aether)_18%,transparent),transparent_35%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-gold)_12%,transparent),transparent_28%)]" />
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-aether to-purple text-aether-foreground shadow-float">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  D&C
                </p>
                <h1 className="font-display text-3xl font-bold text-foreground">Operación</h1>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-aether/20 bg-white/60 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-aether">
                <Sparkles className="size-3.5" />
                Acceso seguro
              </div>
              <h2 className="max-w-sm text-4xl font-semibold leading-tight text-foreground">
                Gestiona tu negocio con control total.
              </h2>
              <p className="max-w-md text-base leading-7 text-muted-foreground">
                Centraliza inventario, clientes, pedidos y contenido en un panel pensado para tomar
                decisiones rápidas y mantener una operación impecable.
              </p>
              <div className="grid max-w-md gap-2 pt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success" /> Inventario y productos en una
                  sola vista
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-aether" /> Acceso protegido para tu equipo
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple" /> Información clara para decidir
                  rápido
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-3 shadow-soft">
              <div className="mb-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
                <ShieldCheck className="size-5 text-aether" />
                24/7
              </div>
              <div>Operación</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-3 shadow-soft">
              <div className="mb-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
                <KeyRound className="size-5 text-purple" />
                100%
              </div>
              <div>Seguro</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-3 shadow-soft">
              <div className="mb-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
                <Sparkles className="size-5 text-amber" />1
              </div>
              <div>Panel central</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-background/20 p-5 sm:p-8 lg:p-10">
          <div className="admin-panel w-full max-w-md rounded-[1.5rem] p-5 shadow-soft sm:p-7">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-aether text-aether-foreground shadow-sm">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    D&C
                  </p>
                  <h1 className="font-display text-2xl font-bold text-foreground">Operación</h1>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Panel administrativo</p>
            </div>

            <div className="mb-7">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Bienvenido
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                Inicia sesión
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Accede a tus herramientas de operación y mantén todo bajo control.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <div className="flex items-center justify-center gap-1 rounded-full border border-border bg-background/60 px-2 py-2">
                <Check className="size-3 text-success" /> Sesión protegida
              </div>
              <div className="flex items-center justify-center gap-1 rounded-full border border-border bg-background/60 px-2 py-2">
                <ShieldCheck className="size-3 text-aether" /> Seguro
              </div>
              <div className="flex items-center justify-center gap-1 rounded-full border border-border bg-background/60 px-2 py-2">
                <Lock className="size-3 text-purple" /> 7d
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <label className="block space-y-2 text-sm font-medium text-foreground">
                Correo electrónico
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu-correo@ejemplo.com"
                  className="h-13 w-full rounded-xl border border-input bg-background px-3.5 text-base text-foreground shadow-soft transition-shadow focus:border-aether focus:outline-none focus:ring-2 focus:ring-aether/20 focus:shadow-float"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-foreground">
                Contraseña
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="h-13 w-full rounded-xl border border-input bg-background px-3.5 pr-12 text-base text-foreground shadow-soft transition-shadow focus:border-aether focus:outline-none focus:ring-2 focus:ring-aether/20 focus:shadow-float"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-aether/10 hover:text-aether focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aether/20"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm text-muted-foreground">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-border text-aether focus:ring-aether/20"
                  />
                  Recordarme en este dispositivo
                </label>
                <button
                  type="button"
                  onClick={logoutCurrentSession}
                  className="text-xs font-medium text-aether transition-colors hover:text-aether/80"
                >
                  Cerrar sesión actual
                </button>
              </div>
              {error ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
              {sessionState ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">Sesión activa</span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                      {sessionState.expiresSoon ? "expira pronto" : "segura"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs opacity-90">
                    {sessionState.role ? `Rol: ${sessionState.role}` : "Acceso administrativo"} ·
                    {sessionState.remainingMinutes > 0
                      ? ` ${sessionState.remainingMinutes} min restantes`
                      : " sesión por expirar"}
                  </p>
                </div>
              ) : null}

              <Button
                type="submit"
                variant="wine"
                size="lg"
                disabled={isSubmitting}
                className="h-13 w-full rounded-xl shadow-float"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? "Accediendo..." : "Acceder"}
                  {!isSubmitting && <ArrowRight className="size-4" />}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
