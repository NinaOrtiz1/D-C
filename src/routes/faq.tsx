import { createFileRoute } from "@tanstack/react-router";

import { FAQPage } from "@/pages/site-pages";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
});
