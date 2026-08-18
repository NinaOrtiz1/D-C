import { createFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/pages/site-pages";

export const Route = createFileRoute("/galeria")({
  component: GalleryPage,
});
