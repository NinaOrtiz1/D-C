import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/pages/site-pages";

export const Route = createFileRoute("/nosotros")({
  component: AboutPage,
});
