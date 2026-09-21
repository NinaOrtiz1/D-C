import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { useState, useMemo } from "react";

interface SearchableItem {
  _id?: string;
  id?: string;
  nombre?: string;
  name?: string;
  titulo?: string;
  title?: string;
}

interface GlobalSearchProps {
  products: SearchableItem[];
  categories: SearchableItem[];
  users: SearchableItem[];
  onSelect?: (item: SearchableItem, type: string) => void;
}

export function GlobalSearch({ products, categories, users, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return null;

    const q = query.toLowerCase();
    const foundProducts = products.filter((p) =>
      (p.nombre || p.name || "").toLowerCase().includes(q),
    );
    const foundCategories = categories.filter((c) =>
      (c.nombre || c.name || "").toLowerCase().includes(q),
    );
    const foundUsers = users.filter((u) => (u.nombre || u.name || "").toLowerCase().includes(q));

    return { foundProducts, foundCategories, foundUsers };
  }, [query, products, categories, users]);

  const hasResults =
    results &&
    (results.foundProducts.length > 0 ||
      results.foundCategories.length > 0 ||
      results.foundUsers.length > 0);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar productos, categorías, usuarios..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-11 rounded-xl border-border/70 bg-background/70 pl-9 pr-9 shadow-soft"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border/80 bg-card/95 shadow-premium backdrop-blur-xl">
          {hasResults ? (
            <div className="p-2">
              {results!.foundProducts.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-aether">
                    Productos
                  </div>
                  {results!.foundProducts.map((item) => (
                    <button
                      key={item._id || item.id}
                      onClick={() => {
                        onSelect?.(item, "product");
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-aether/5"
                    >
                      <div className="font-medium text-foreground">{item.nombre || item.name}</div>
                      <div className="text-xs text-muted-foreground">Producto</div>
                    </button>
                  ))}
                </div>
              )}

              {results!.foundCategories.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-purple">
                    Categorías
                  </div>
                  {results!.foundCategories.map((item) => (
                    <button
                      key={item._id || item.id}
                      onClick={() => {
                        onSelect?.(item, "category");
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-purple/5"
                    >
                      <div className="font-medium text-foreground">{item.nombre || item.name}</div>
                      <div className="text-xs text-muted-foreground">Categoría</div>
                    </button>
                  ))}
                </div>
              )}

              {results!.foundUsers.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-success">
                    Usuarios
                  </div>
                  {results!.foundUsers.map((item) => (
                    <button
                      key={item._id || item.id}
                      onClick={() => {
                        onSelect?.(item, "user");
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-success/5"
                    >
                      <div className="font-medium text-foreground">{item.nombre || item.name}</div>
                      <div className="text-xs text-muted-foreground">Usuario</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}

      {isOpen && !query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-border/80 bg-card/95 p-4 text-center text-sm text-muted-foreground shadow-premium backdrop-blur-xl">
          Escribe para buscar...
        </div>
      )}
    </div>
  );
}
