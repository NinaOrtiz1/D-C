import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Skeleton } from '../ui/skeleton';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ProductChartProps {
  data: ChartData[];
  isLoading: boolean;
  title: string;
  type?: 'pie' | 'bar';
}

const COLORS = [
  'oklch(0.6 0.25 240)',    // aether
  'oklch(0.62 0.18 299)',   // purple
  'oklch(0.68 0.16 150)',   // success
  'oklch(0.76 0.17 77)',    // warning
  'oklch(0.62 0.22 25)',    // destructive
  'oklch(0.7 0.15 200)',    // blue
  'oklch(0.65 0.2 180)',    // cyan
  'oklch(0.6 0.18 320)',    // pink
];

export function ChartComponent({ data, isLoading, title, type = 'pie' }: ProductChartProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">{title}</h3>

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
            {type === 'pie' ? (
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
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value}`, 'Cantidad']}
                />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value}`, 'Cantidad']}
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
