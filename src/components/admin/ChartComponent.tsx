import { BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "../ui/skeleton";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ProductChartProps {
  data: ChartData[];
  isLoading: boolean;
  title: string;
  type?: "pie" | "bar";
}

const COLORS = [
  "oklch(0.6 0.25 240)", // aether
  "oklch(0.62 0.18 299)", // purple
  "oklch(0.68 0.16 150)", // success
  "oklch(0.76 0.17 77)", // warning
  "oklch(0.62 0.22 25)", // destructive
  "oklch(0.7 0.15 200)", // blue
  "oklch(0.65 0.2 180)", // cyan
  "oklch(0.6 0.18 320)", // pink
];

export function ChartComponent({ data, isLoading, title, type = "pie" }: ProductChartProps) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-soft backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Analítica
          </p>
          <h3 className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <BarChart3 className="size-5 text-aether" />
            {title}
          </h3>
        </div>
        <div className="rounded-xl bg-aether/10 p-2 text-aether">
          <BarChart3 className="size-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ) : data.length === 0 ? (
        <div className="w-full h-64 flex items-center justify-center text-center">
          <div>
            <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}`, "Cantidad"]}
                />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}`, "Cantidad"]}
                />
                <Bar dataKey="value" fill="oklch(0.6 0.25 240)" animationDuration={800} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
