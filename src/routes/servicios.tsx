import { createFileRoute } from "@tanstack/react-router";

import { ServicesPage } from "@/pages/site-pages";

export const Route = createFileRoute("/servicios")({
  component: ServicesPage,
});
