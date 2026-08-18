import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Star, TrendingUp } from 'lucide-react';

interface Product {
  _id: string;
  nombre?: string;
  name?: string;
  precio?: number;
  price?: number;
  stock: number;
  categoria?: any;
}

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  const topProducts = products.slice(0, 4);

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">Productos destacados</h3>
        <Star className="size-4 text-warning" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : topProducts.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <TrendingUp className="size-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Sin productos destacados</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {topProducts.map((product) => (
            <div
              key={product._id}
              className="group relative rounded-lg border border-border/40 bg-background/50 p-4 hover:shadow-soft transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{product.nombre || product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.categoria?.nombre || product.categoria?.name || 'Sin categoría'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">${product.precio || product.price}</span>
                <Badge
                  className={
                    product.stock > 10
                      ? 'bg-success/10 text-success'
                      : product.stock > 0
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                  }
                >
                  Stock: {product.stock}
                </Badge>
              </div>

              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-aether/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
