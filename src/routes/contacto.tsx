import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/pages/site-pages";

export const Route = createFileRoute("/contacto")({
  component: ContactPage,
});
