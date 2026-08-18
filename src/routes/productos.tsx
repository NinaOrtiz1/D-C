import { createFileRoute } from "@tanstack/react-router";

import { ProductsPage } from "@/pages/site-pages";

export const Route = createFileRoute("/productos")({
  component: ProductsPage,
});
