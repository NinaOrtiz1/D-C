import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/site/Logo";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-[2.2rem] border border-border bg-card/70 p-10 shadow-soft sm:p-12">
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
                      className="text-sm text-muted-foreground transition-colors hover:text-wine"
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
            <p>
              © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
            </p>
            <p>Hecho con precisión en {SITE.city}.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
