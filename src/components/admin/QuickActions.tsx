import { Button } from "../ui/button";
import { Package, FolderPlus, Users, BarChart3, Settings, RefreshCw } from "lucide-react";

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
    { icon: Package, label: "Agregar producto", action: onAddProduct },
    { icon: FolderPlus, label: "Nueva categoría", action: onAddCategory },
    { icon: Users, label: "Administrar usuarios", action: onManageUsers },
    { icon: BarChart3, label: "Ver inventario", action: onViewInventory },
    { icon: Settings, label: "Configuración", action: onSettings },
  ];

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-soft backdrop-blur-sm sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-12 size-36 rounded-full bg-purple/10 blur-2xl" />
      <div className="relative mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-aether">Productividad</p>
          <h3 className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <Settings className="size-5 text-aether" />
            Acciones rápidas
          </h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2 rounded-xl border border-border/70 bg-background/70"
        >
          <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="admin-shine group flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 text-sm shadow-soft transition-all hover:-translate-y-1 hover:border-aether/50 hover:bg-background hover:shadow-float"
            >
              <div className="rounded-xl bg-aether/10 p-3 shadow-soft transition-colors group-hover:bg-aether/20">
                <Icon className="size-6 text-aether" />
              </div>
              <span className="text-sm font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
