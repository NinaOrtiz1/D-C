import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';

interface SearchableItem {
  _id?: string;
  id?: string;
  nombre?: string;
  name?: string;
  titulo?: string;
  title?: string;
  [key: string]: any;
}

interface GlobalSearchProps {
  products: SearchableItem[];
  categories: SearchableItem[];
  users: SearchableItem[];
  onSelect?: (item: SearchableItem, type: string) => void;
}

export function GlobalSearch({ products, categories, users, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return null;

    const q = query.toLowerCase();
    const foundProducts = products.filter((p) =>
      (p.nombre || p.name || '').toLowerCase().includes(q)
    );
    const foundCategories = categories.filter((c) =>
      (c.nombre || c.name || '').toLowerCase().includes(q)
    );
    const foundUsers = users.filter((u) =>
      (u.nombre || u.name || '').toLowerCase().includes(q)
    );

    return { foundProducts, foundCategories, foundUsers };
  }, [query, products, categories, users]);

  const hasResults = results && (results.foundProducts.length > 0 || results.foundCategories.length > 0 || results.foundUsers.length > 0);

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
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
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
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-premium z-50 max-h-96 overflow-y-auto">
          {hasResults ? (
            <div className="p-2">
              {results!.foundProducts.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Productos
                  </div>
                  {results!.foundProducts.map((item) => (
                    <button
                      key={item._id || item.id}
                      onClick={() => {
                        onSelect?.(item, 'product');
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-background transition-colors text-sm"
                    >
                      <div className="font-medium text-foreground">{item.nombre || item.name}</div>
                      <div className="text-xs text-muted-foreground">Producto</div>
                    </button>
                  ))}
                </div>
              )}

              {results!.foundCategories.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Categorías
                  </div>
                  {results!.foundCategories.map((item) => (
                    <button
                      key={item._id || item.id}
                      onClick={() => {
                        onSelect?.(item, 'category');
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-background transition-colors text-sm"
                    >
                      <div className="font-medium text-foreground">{item.nombre || item.name}</div>
                      <div className="text-xs text-muted-foreground">Categoría</div>
                    </button>
                  ))}
                </div>
              )}

              {results!.foundUsers.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Usuarios
                  </div>
                  {results!.foundUsers.map((item) => (
                    <button
                      key={item._id || item.id}
                      onClick={() => {
                        onSelect?.(item, 'user');
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-background transition-colors text-sm"
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
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-premium z-50">
          Escribe para buscar...
        </div>
      )}
    </div>
  );
}
