import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollToTop } from "@/components/site/ScrollToTop";

function NotFoundComponent() {
  return (
    <div className="app-frame flex min-h-screen items-center justify-center bg-background px-4">
      <div className="admin-panel premium-card max-w-md rounded-[2rem] p-8 text-center shadow-premium sm:p-10">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Parece que esta idea todavía no existe.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o cambió de lugar.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-float"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="app-frame flex min-h-screen items-center justify-center bg-background px-4">
      <div className="admin-panel premium-card max-w-md rounded-[2rem] p-8 text-center shadow-premium sm:p-10">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página no pudo cargar
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocurrió un problema inesperado. Puedes intentarlo de nuevo o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-float"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent hover:shadow-soft"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DYC Innovación | Personalización, Grabado Láser e Impresión 3D" },
      {
        name: "description",
        content:
          "Transformamos tus ideas en productos personalizados mediante diseño, grabado láser e impresión 3D.",
      },
      { name: "author", content: "DYC Innovación" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "DYC Innovación | Personalización y fabricación a medida" },
      { name: "twitter:title", content: "DYC Innovación | Personalización y fabricación a medida" },
      {
        property: "og:description",
        content:
          "Transformamos tus ideas en productos personalizados mediante diseño, grabado láser e impresión 3D.",
      },
      {
        name: "twitter:description",
        content:
          "Transformamos tus ideas en productos personalizados mediante diseño, grabado láser e impresión 3D.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/77d4748649dc754c9f361a8b583e1cae/id-preview-3680ca1d--736c37ed-cffc-4c7d-ad28-b39915d1a8de.lovable.app-1786089379712.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/77d4748649dc754c9f361a8b583e1cae/id-preview-3680ca1d--736c37ed-cffc-4c7d-ad28-b39915d1a8de.lovable.app-1786089379712.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        // Prevent browser from restoring scroll position on reload
        window.history.scrollRestoration = "manual";
      }
    } catch {
      /* ignore */
    }

    // Ensure we start at the top on initial mount (fixes reload landing mid-page)
    try {
      if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0 });
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-frame min-h-screen bg-background text-foreground">
        {!isAdminRoute ? <Navbar /> : null}
        <main className={isAdminRoute ? "app-main" : "app-main pt-20"}>
          <Outlet />
        </main>
        {!isAdminRoute ? <Footer /> : null}
        {!isAdminRoute ? <ScrollToTop /> : null}
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
