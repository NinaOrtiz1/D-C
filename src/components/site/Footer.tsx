import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/site/Logo";
import { AdminPinModal } from "@/components/site/AdminPinModal";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="dyc-footer relative overflow-hidden border-t border-border bg-[radial-gradient(circle_at_15%_20%,color-mix(in_srgb,var(--color-gold)_10%,transparent),transparent_28%),radial-gradient(circle_at_90%_80%,color-mix(in_srgb,var(--color-aether)_10%,transparent),transparent_30%),var(--color-foreground)] py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="admin-panel premium-card rounded-[2.2rem] p-8 shadow-premium sm:p-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo className="h-10 w-10 sm:h-11 sm:w-11" />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Taller de personalización especializado en grabado láser, impresión 3D y productos
                únicos para personas y empresas.
              </p>
              <div className="mt-6 flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className={`inline-flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 ${s.colorClass}`}
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Enlaces del sitio">
              <h2 className="text-sm font-semibold">Navegación</h2>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-flex rounded-md py-0.5 text-sm text-muted-foreground transition-all hover:translate-x-1 hover:text-wine"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-semibold">Contacto</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a href={SITE.whatsappUrl} className="transition-colors hover:text-wine">
                    WhatsApp {SITE.whatsapp}
                  </a>
                </li>
                <li>{SITE.city}</li>
                <li>{SITE.email}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2026 DYC. Todos los derechos reservados.</p>
            <p className="cursor-pointer select-none rounded-md px-2 py-1 transition-colors hover:text-wine">
              Hecho con precisión en {SITE.city}.
            </p>
            <AdminPinModal />
          </div>
        </div>
      </div>
    </footer>
  );
}
