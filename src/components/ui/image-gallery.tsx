import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  X,
} from "lucide-react";

export type ViewerImage = {
  src: string;
  alt: string;
  thumbnail?: string;
  downloadName?: string;
};

type ImageGalleryProps = {
  images: ViewerImage[];
  children: (controls: { open: (index: number) => void }) => ReactNode;
};

type InteractiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
};

type Point = { x: number; y: number };

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const SWIPE_DISTANCE = 56;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDownloadName(image: ViewerImage) {
  if (image.downloadName) return image.downloadName;

  try {
    const pathname = new URL(image.src, window.location.href).pathname;
    const name = pathname.split("/").pop()?.split("?")[0];
    if (name) return name;
  } catch {
    return "imagen-dyc";
  }

  return "imagen-dyc";
}

function Lightbox({ images, index, onClose, onChange }: {
  images: ViewerImage[];
  index: number;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
}) {
  const image = images[index] ?? images[0]!;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const pointerMap = useRef(new Map<number, Point>());
  const dragStartRef = useRef<Point | null>(null);
  const lastPointerRef = useRef<Point | null>(null);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef(1);
  const shareTimeoutRef = useRef<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [failed, setFailed] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  const limitOffset = (nextZoom: number, point: Point): Point => {
    const horizontalLimit = window.innerWidth * 0.38 * (nextZoom - 1);
    const verticalLimit = window.innerHeight * 0.32 * (nextZoom - 1);
    return {
      x: clamp(point.x, -horizontalLimit, horizontalLimit),
      y: clamp(point.y, -verticalLimit, verticalLimit),
    };
  };

  const setZoomLevel = (nextZoom: number) => {
    const boundedZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    setZoom(boundedZoom);
    setOffset((current) => limitOffset(boundedZoom, current));
  };

  const resetView = () => {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
      if (shareTimeoutRef.current !== null) {
        window.clearTimeout(shareTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setFailed(false);
    setShareMessage("");
    resetView();

    const adjacentImages = [images[index - 1], images[index + 1]].filter(Boolean);
    const preloaded = adjacentImages.map((adjacent) => {
      const preloadedImage = new Image();
      preloadedImage.src = adjacent.src;
      return preloadedImage;
    });

    return () => {
      preloaded.forEach((preloadedImage) => {
        preloadedImage.onload = null;
        preloadedImage.onerror = null;
      });
    };
  }, [images, index]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault();
        onChange((index - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault();
        onChange((index + 1) % images.length);
      } else if (event.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-image-viewer] button:not([disabled]), [data-image-viewer] a[href]',
          ),
        );
        if (!focusable.length) return;
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + focusable.length) % focusable.length
          : (currentIndex + 1) % focusable.length;
        event.preventDefault();
        focusable[nextIndex]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [images.length, index, onChange, onClose]);

  const changeImage = (direction: -1 | 1) => {
    if (images.length < 2) return;
    onChange((index + direction + images.length) % images.length);
  };

  const getDistance = (first: Point, second: Point) =>
    Math.hypot(first.x - second.x, first.y - second.y);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = { x: event.clientX, y: event.clientY };
    pointerMap.current.set(event.pointerId, point);

    if (pointerMap.current.size === 2) {
      const points = Array.from(pointerMap.current.values());
      pinchStartDistanceRef.current = getDistance(points[0], points[1]);
      pinchStartZoomRef.current = zoom;
      dragStartRef.current = null;
      return;
    }

    dragStartRef.current = point;
    lastPointerRef.current = point;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerMap.current.has(event.pointerId)) return;
    const point = { x: event.clientX, y: event.clientY };
    pointerMap.current.set(event.pointerId, point);

    if (pointerMap.current.size === 2 && pinchStartDistanceRef.current) {
      const points = Array.from(pointerMap.current.values());
      const distance = getDistance(points[0], points[1]);
      setZoomLevel(pinchStartZoomRef.current * (distance / pinchStartDistanceRef.current));
      return;
    }

    if (zoom <= MIN_ZOOM || !lastPointerRef.current) return;
    const movement = {
      x: offset.x + point.x - lastPointerRef.current.x,
      y: offset.y + point.y - lastPointerRef.current.y,
    };
    lastPointerRef.current = point;
    setOffset(limitOffset(zoom, movement));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    const end = { x: event.clientX, y: event.clientY };
    pointerMap.current.delete(event.pointerId);
    pinchStartDistanceRef.current = null;

    if (zoom === MIN_ZOOM && start && Math.abs(end.x - start.x) > SWIPE_DISTANCE) {
      changeImage(end.x < start.x ? 1 : -1);
    }

    dragStartRef.current = null;
    lastPointerRef.current = null;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoomLevel(zoom + (event.deltaY < 0 ? 0.2 : -0.2));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.src);
      if (!response.ok) throw new Error("No se pudo descargar la imagen");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = getDownloadName(image);
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(image.src, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: image.alt, text: image.alt, url: image.src });
        setShareMessage("Imagen compartida.");
      } else {
        await navigator.clipboard.writeText(image.src);
        setShareMessage("Enlace copiado.");
      }
    } catch {
      setShareMessage("No se pudo compartir la imagen.");
    }
    if (shareTimeoutRef.current !== null) {
      window.clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = window.setTimeout(() => setShareMessage(""), 2500);
  };

  return (
    <motion.div
      data-image-viewer
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de imagen: ${image.alt}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={onClose}
      className="fixed inset-0 z-80 flex min-h-0 flex-col bg-black/85 p-3 backdrop-blur-sm sm:p-5"
    >
      <div
        className="flex shrink-0 items-center justify-between gap-3 text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="rounded-full bg-black/40 px-3 py-1.5 text-sm font-medium">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handleDownload} aria-label="Descargar imagen" title="Descargar imagen" className="viewer-button">
            <Download className="size-5" />
          </button>
          <button type="button" onClick={handleShare} aria-label="Compartir imagen" title="Compartir imagen" className="viewer-button">
            <Share2 className="size-5" />
          </button>
          <button type="button" onClick={onClose} aria-label="Cerrar visor" title="Cerrar visor" className="viewer-button" ref={closeButtonRef}>
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-none items-center justify-center py-3"
        onClick={(event) => event.stopPropagation()}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => setZoomLevel(zoom > MIN_ZOOM ? MIN_ZOOM : 2)}
      >
        {images.length > 1 ? (
          <>
            <button type="button" onClick={() => changeImage(-1)} aria-label="Imagen anterior" title="Imagen anterior" className="viewer-nav-button left-1 sm:left-4">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => changeImage(1)} aria-label="Imagen siguiente" title="Imagen siguiente" className="viewer-nav-button right-1 sm:right-4">
              <ChevronRight className="size-6" />
            </button>
          </>
        ) : null}

        {failed ? (
          <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white">
            <Maximize2 className="size-8" />
            <p>No se pudo cargar esta imagen.</p>
            <button type="button" onClick={() => setFailed(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              Reintentar
            </button>
          </div>
        ) : (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            onError={() => setFailed(true)}
            draggable={false}
            className="max-h-full max-w-[calc(100vw-1.5rem)] select-none object-contain shadow-2xl sm:max-w-[calc(100vw-8rem)]"
            style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`, transition: pointerMap.current.size ? "none" : "transform 180ms ease-out" }}
          />
        )}
      </div>

      <div
        className="flex shrink-0 flex-col items-center gap-3 text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setZoomLevel(zoom - 0.25)} aria-label="Alejar imagen" title="Alejar imagen" className="viewer-button">
            <Minus className="size-5" />
          </button>
          <button type="button" onClick={resetView} aria-label="Restablecer zoom" title="Restablecer zoom" className="viewer-button min-w-16 text-xs font-semibold">
            {Math.round(zoom * 100)}%
          </button>
          <button type="button" onClick={() => setZoomLevel(zoom + 0.25)} aria-label="Acercar imagen" title="Acercar imagen" className="viewer-button">
            <Plus className="size-5" />
          </button>
          {zoom > MIN_ZOOM ? (
            <button type="button" onClick={resetView} aria-label="Ver tamaño original" title="Ver tamaño original" className="viewer-button">
              <RotateCcw className="size-5" />
            </button>
          ) : null}
        </div>

        {shareMessage ? <p role="status" className="text-xs text-white/80">{shareMessage}</p> : null}

        {images.length > 1 ? (
          <div className="flex max-w-[calc(100vw-1.5rem)] gap-2 overflow-x-auto pb-1" aria-label="Miniaturas de imágenes">
            {images.map((thumbnail, thumbnailIndex) => (
              <button
                key={`${thumbnail.src}-${thumbnailIndex}`}
                type="button"
                onClick={() => onChange(thumbnailIndex)}
                aria-label={`Ver imagen ${thumbnailIndex + 1}: ${thumbnail.alt}`}
                aria-current={thumbnailIndex === index}
                className={`size-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white/10 transition ${thumbnailIndex === index ? "border-white" : "border-white/20 opacity-70 hover:opacity-100"}`}
              >
                <img src={thumbnail.thumbnail ?? thumbnail.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function ImageGallery({ images, children }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const validImages = images.filter((image) => image.src.trim());

  const open = useCallback((index: number) => {
    if (validImages[index]) setActiveIndex(index);
  }, [validImages]);

  const close = useCallback(() => setActiveIndex(null), []);

  return (
    <>
      {children({ open })}
      <AnimatePresence>
        {activeIndex !== null && validImages.length > 0 ? (
          <Lightbox
            images={validImages}
            index={Math.min(activeIndex, validImages.length - 1)}
            onClose={close}
            onChange={setActiveIndex}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function InteractiveImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  loading = "lazy",
}: InteractiveImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <ImageGallery images={[{ src, alt }]}>
      {({ open }) => (
        <button
          type="button"
          onClick={() => open(0)}
          aria-label={`Ampliar imagen: ${alt}`}
          className={`group block w-full cursor-zoom-in text-left ${className}`}
        >
          {failed ? (
            <span className="flex h-full min-h-32 w-full items-center justify-center bg-linear-to-br from-wine-soft to-muted px-4 text-center text-sm font-medium text-muted-foreground">
              Imagen no disponible
            </span>
          ) : (
            <img
              src={src}
              alt={alt}
              loading={loading}
              decoding="async"
              onError={() => setFailed(true)}
              className={`transition-transform duration-500 group-hover:scale-[1.03] ${imageClassName}`}
            />
          )}
        </button>
      )}
    </ImageGallery>
  );
}