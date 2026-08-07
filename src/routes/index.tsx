import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { Footer } from "@/components/site/Footer";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { CustomCursor } from "@/components/site/CustomCursor";

const AIDesigner = lazy(() =>
  import("@/components/site/AIDesigner").then((m) => ({ default: m.AIDesigner })),
);
const Process = lazy(() =>
  import("@/components/site/Process").then((m) => ({ default: m.Process })),
);
const Testimonials = lazy(() =>
  import("@/components/site/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const FAQ = lazy(() => import("@/components/site/FAQ").then((m) => ({ default: m.FAQ })));
const Contact = lazy(() =>
  import("@/components/site/Contact").then((m) => ({ default: m.Contact })),
);
const ChatWidget = lazy(() =>
  import("@/components/site/ChatWidget").then((m) => ({ default: m.ChatWidget })),
);

const title = "D&C Innovación | Grabado láser, impresión 3D y vasos personalizados";
const description =
  "Personalizamos vasos, termos, tazas, llaveros y regalos empresariales con grabado láser e impresión 3D. Diseño a medida y entrega rápida en Durango y todo México.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "D&C Innovación",
          description,
          telephone: "+52 618 444 4686",
          areaServed: "México",
          address: { "@type": "PostalAddress", addressLocality: "Durango", addressCountry: "MX" },
          sameAs: ["https://www.facebook.com/profile.php?id=61567450161287"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Suspense fallback={<div className="h-40" />}>
          <AIDesigner />
          <Process />
          <Testimonials />
          <FAQ />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}
