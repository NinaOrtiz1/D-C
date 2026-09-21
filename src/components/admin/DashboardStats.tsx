import { TrendingUp, Package, BarChart3, AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="admin-shine group relative overflow-hidden rounded-[1.35rem] border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-aether/30 hover:shadow-premium sm:p-6"
        >
          {/* Gradient background on hover */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.color}`}
          />

          {isLoading ? (
            <>
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-28" />
            </>
          ) : (
            <div className="relative flex flex-col">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="text-4xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    {stat.trend !== undefined && (
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold ${stat.trend >= 0 ? "text-success" : "text-destructive"}`}
                      >
                        <TrendingUp className="size-3" />
                        {stat.trend}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl bg-aether/10 p-3.5 shadow-soft transition-all group-hover:scale-105 group-hover:bg-aether/15">
                  {stat.icon}
                </div>
              </div>

              <div className="border-t border-border/70 pt-3 text-sm text-muted-foreground">
                {stat.description}
              </div>

              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-aether to-purple w-0 group-hover:w-full transition-all duration-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
