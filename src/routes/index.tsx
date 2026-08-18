import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/pages/site-pages";

const title = "DYC | Personalización premium";
const description =
  "Personalizamos productos, regalos y piezas de diseño con grabado láser e impresión 3D. Soluciones a medida con atención y creatividad.";

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
          name: "DYC",
          description,
          telephone: "+52 618 444 4686",
          areaServed: "México",
          address: { "@type": "PostalAddress", addressLocality: "Durango", addressCountry: "MX" },
          sameAs: ["https://www.facebook.com/profile.php?id=61567450161287"],
        }),
      },
    ],
  }),
  component: HomePage,
});
