import { Clock, User, Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface Activity {
  id: string;
  action: string;
  type: 'add' | 'edit' | 'delete' | 'login';
  user?: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  isLoading: boolean;
}

const actionIcons = {
  add: Plus,
  edit: Edit2,
  delete: Trash2,
  login: User,
};

const actionColors = {
  add: 'bg-success/10 text-success',
  edit: 'bg-warning/10 text-warning',
  delete: 'bg-destructive/10 text-destructive',
  login: 'bg-aether/10 text-aether',
};

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Actividad reciente</h3>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="size-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = actionIcons[activity.type];
            const colorClass = actionColors[activity.type];

            return (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-8 top-full h-8 w-0.5 bg-gradient-to-b from-border to-transparent" />
                )}

                {/* Icon */}
                <div className={`relative flex-shrink-0 flex items-center justify-center size-10 rounded-full ${colorClass}`}>
                  <Icon className="size-4" />
                </div>

                {/* Content */}
                <div className="flex-1 py-0.5">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
