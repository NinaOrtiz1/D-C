import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  count?: number;
}

interface AlertsProps {
  alerts: Alert[];
  isLoading: boolean;
}

export function SystemAlerts({ alerts, isLoading }: AlertsProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Alertas del sistema</h3>

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
              className={`flex items-start gap-3 rounded-lg p-4 border transition-all ${
                alert.type === 'success'
                  ? 'bg-success/5 border-success/20 text-success'
                  : alert.type === 'warning'
                    ? 'bg-warning/5 border-warning/20 text-warning'
                    : 'bg-destructive/5 border-destructive/20 text-destructive'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === 'success' ? (
                  <CheckCircle2 className="size-5" />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <AlertCircle className="size-5" />
                )}
              </div>
              <div className="flex-1 text-sm font-medium">
                {alert.message}
                {alert.count !== undefined && <span className="font-bold ml-1">({alert.count})</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
