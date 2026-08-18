import { Button } from '../ui/button';
import { Package, FolderPlus, Users, BarChart3, Settings, RefreshCw } from 'lucide-react';

interface QuickActionsProps {
  onAddProduct?: () => void;
  onAddCategory?: () => void;
  onManageUsers?: () => void;
  onViewInventory?: () => void;
  onSettings?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function QuickActions({
  onAddProduct,
  onAddCategory,
  onManageUsers,
  onViewInventory,
  onSettings,
  onRefresh,
  isRefreshing = false,
}: QuickActionsProps) {
  const actions = [
    { icon: Package, label: 'Agregar producto', action: onAddProduct },
    { icon: FolderPlus, label: 'Nueva categoría', action: onAddCategory },
    { icon: Users, label: 'Administrar usuarios', action: onManageUsers },
    { icon: BarChart3, label: 'Ver inventario', action: onViewInventory },
    { icon: Settings, label: 'Configuración', action: onSettings },
  ];

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">Acciones rápidas</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-border/40 bg-background/50 p-4 hover:bg-background hover:border-aether/50 transition-all hover:shadow-soft"
            >
              <div className="p-2 rounded-lg bg-aether/10 group-hover:bg-aether/20 transition-colors">
                <Icon className="size-5 text-aether" />
              </div>
              <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
