import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Alert {
  id: string;
  type: "success" | "warning" | "error";
  message: string;
  count?: number;
}

interface AlertsProps {
  alerts: Alert[];
  isLoading: boolean;
}

export function SystemAlerts({ alerts, isLoading }: AlertsProps) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-soft backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-warning">Supervisión</p>
          <h3 className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <AlertTriangle className="size-5 text-warning" />
            Alertas del sistema
          </h3>
        </div>
        <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
          {alerts.length} {alerts.length === 1 ? "aviso" : "avisos"}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="size-8 text-success mb-2" />
          <p className="text-sm text-muted-foreground">El inventario está en buen estado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-2xl p-4 border shadow-soft transition-all ${
                alert.type === "success"
                  ? "bg-success/5 border-success/20 text-success"
                  : alert.type === "warning"
                    ? "bg-warning/5 border-warning/20 text-warning"
                    : "bg-destructive/5 border-destructive/20 text-destructive"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === "success" ? (
                  <CheckCircle2 className="size-5" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <AlertCircle className="size-5" />
                )}
              </div>
              <div className="flex-1 text-sm font-medium">
                {alert.message}
                {alert.count !== undefined && (
                  <span className="font-bold ml-1">({alert.count})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
