import { TrendingUp, Package, BarChart3, AlertCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface Stat {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  color: string;
  trend?: number;
}

interface DashboardStatsProps {
  stats: Stat[];
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group relative rounded-xl border border-border/40 bg-gradient-to-br from-card via-card/50 to-background p-6 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden"
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.color}`} />

          {isLoading ? (
            <>
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-28" />
            </>
          ) : (
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className="p-2 rounded-lg bg-background/50 group-hover:bg-background transition-colors">
                  {stat.icon}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                {stat.trend !== undefined && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="size-3" />
                    {stat.trend}%
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-muted-foreground">{stat.description}</div>

              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-aether to-purple w-0 group-hover:w-full transition-all duration-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
