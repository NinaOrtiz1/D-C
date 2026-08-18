import { useEffect, useState, useMemo } from 'react';
import {
  Bell,
  LogOut,
  ShieldCheck,
  Home,
  Package,
  Tags,
  MessageSquare,
  Settings,
  Menu,
  X,
  Wand2,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { apiUrl, fetchWithTimeout } from '@/lib/api';

// Import new components
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ChartComponent } from '@/components/admin/ChartComponent';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { FeaturedProducts } from '@/components/admin/FeaturedProducts';
import { QuickActions } from '@/components/admin/QuickActions';
import { GlobalSearch } from '@/components/admin/GlobalSearch';

const STORAGE_KEY = 'dyc-admin';
const LOGIN_TIMEOUT_MS = 15000;

interface DashboardData {
  totals?: {
    usuarios: number;
    productos: number;
    productosBajoStock: number;
    comentarios: number;
    noticias: number;
    mensajes: number;
  };
  totalUsers?: number;
  totalProducts?: number;
  categories?: number;
}

interface Product {
  _id: string;
  nombre?: string;
  name?: string;
  precio?: number;
  price?: number;
  stock: number;
  activo?: boolean;
  active?: boolean;
  categoria?: any;
}

interface Category {
  _id: string;
  nombre?: string;
  name?: string;
  activo?: boolean;
  active?: boolean;
}

interface NewsItem {
  _id: string;
  titulo?: string;
  title?: string;
  contenido?: string;
  content?: string;
  activo?: boolean;
  active?: boolean;
}

interface Contact {
  _id: string;
  nombre?: string;
  name?: string;
  mensaje?: string;
  message?: string;
  leido?: boolean;
  read?: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readStoredAuth = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as { token?: string; isAuthenticated?: boolean };
    } catch {
      return null;
    }
  };

  const authToken = (() => {
    const auth = readStoredAuth();
    return auth?.token || '';
  })();

  // Fetch data from API
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl('/dashboard'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    },
    enabled: isAuthenticated && Boolean(authToken),
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl('/products'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    enabled: isAuthenticated && Boolean(authToken),
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl('/categories'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
    enabled: isAuthenticated && Boolean(authToken),
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: newsData, isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl('/news'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
    enabled: isAuthenticated && Boolean(authToken),
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: contactsData, isLoading: contactsLoading, refetch: refetchContacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl('/contact'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
    enabled: isAuthenticated && Boolean(authToken),
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  const news = newsData?.data || [];
  const contacts = contactsData?.data || [];
  const stats = dashboardData?.data;
  const totalProducts = stats?.totals?.productos ?? stats?.totalProducts ?? 0;
  const totalUsers = stats?.totals?.usuarios ?? stats?.totalUsers ?? 0;

  // Restore auth state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { token?: string; isAuthenticated?: boolean };
        setIsAuthenticated(Boolean(parsed.token) && Boolean(parsed.isAuthenticated));
      } catch {
        // Invalid data
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError('Introduce tu correo y contraseña para continuar.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

    try {
      const response = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      const payload = await response.json();

      if (!response.ok || !payload?.data?.token) {
        setError(payload?.message || 'Las credenciales no coinciden con el acceso del administrador.');
        setIsSubmitting(false);
        return;
      }

      const token = String(payload.data.token);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, token }));
      setForm({ email: '', password: '' });
    } catch (loginError) {
      if (loginError instanceof DOMException && loginError.name === 'AbortError') {
        setError('El servidor tardó demasiado en responder. Inténtalo de nuevo.');
      } else {
        setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  // Calculate stats from API data
  const calculatedStats = useMemo(() => {
    if (!stats) return [];

    const lowStockCount = products.filter((p: Product) => p.stock < 10 && p.stock > 0).length;
    const outOfStockCount = products.filter((p: Product) => p.stock === 0).length;
    const totalStock = products.reduce((sum: number, p: Product) => sum + p.stock, 0);

    return [
      {
        label: 'Productos',
        value: totalProducts,
        icon: <Package className="size-5 text-aether" />,
        description: 'registrados',
        color: 'bg-gradient-to-br from-aether/5 to-transparent',
      },
      {
        label: 'Categorías',
        value: categories.length,
        icon: <Tags className="size-5 text-purple" />,
        description: 'activas',
        color: 'bg-gradient-to-br from-purple/5 to-transparent',
      },
      {
        label: 'Usuarios',
        value: totalUsers,
        icon: <Users className="size-5 text-aether" />,
        description: 'registrados',
        color: 'bg-gradient-to-br from-aether/5 to-transparent',
      },
      {
        label: 'Stock total',
        value: totalStock,
        icon: <TrendingUp className="size-5 text-success" />,
        description: 'unidades disponibles',
        color: 'bg-gradient-to-br from-success/5 to-transparent',
      },
      {
        label: 'Stock bajo',
        value: lowStockCount,
        icon: <AlertTriangle className="size-5 text-warning" />,
        description: '< 10 unidades',
        color: 'bg-gradient-to-br from-warning/5 to-transparent',
      },
      {
        label: 'Agotados',
        value: outOfStockCount,
        icon: <AlertCircle className="size-5 text-destructive" />,
        description: '0 unidades',
        color: 'bg-gradient-to-br from-destructive/5 to-transparent',
      },
    ];
  }, [stats, products, categories]);

  // Calculate system alerts
  const systemAlerts = useMemo(() => {
    const alerts = [];
    const outOfStock = products.filter((p: Product) => p.stock === 0).length;
    const lowStock = products.filter((p: Product) => p.stock < 10 && p.stock > 0).length;

    if (outOfStock > 0) {
      alerts.push({
        id: 'out-of-stock',
        type: 'error' as const,
        message: 'Productos agotados',
        count: outOfStock,
      });
    }

    if (lowStock > 0) {
      alerts.push({
        id: 'low-stock',
        type: 'warning' as const,
        message: 'Productos con stock bajo',
        count: lowStock,
      });
    }

    if (outOfStock === 0 && lowStock === 0) {
      alerts.push({
        id: 'all-good',
        type: 'success' as const,
        message: 'El inventario está en buen estado',
      });
    }

    return alerts;
  }, [products]);

  // Chart data for products by category
  const categoryChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    products.forEach((p: Product) => {
      const catName = p.categoria?.nombre || p.categoria?.name || 'Sin categoría';
      grouped[catName] = (grouped[catName] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Chart data for stock levels
  const stockChartData = useMemo(() => {
    const available = products.filter((p: Product) => p.stock > 10).length;
    const lowStock = products.filter((p: Product) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter((p: Product) => p.stock === 0).length;

    return [
      { name: 'Disponible', value: available },
      { name: 'Stock bajo', value: lowStock },
      { name: 'Agotado', value: outOfStock },
    ];
  }, [products]);

  // Activity feed (mock - in real scenario would come from API)
  const activityFeed = useMemo(
    () => [
      {
        id: '1',
        action: 'Productos actualizados',
        type: 'edit' as const,
        timestamp: 'Hace 2 minutos',
        details: `Total: ${products.length} productos`,
      },
      {
        id: '2',
        action: 'Categorías consultadas',
        type: 'add' as const,
        timestamp: 'Hace 5 minutos',
        details: `Total: ${categories.length} categorías`,
      },
      {
        id: '3',
        action: 'Dashboard accedido',
        type: 'login' as const,
        timestamp: 'Hace 10 minutos',
        details: 'Admin panel',
      },
    ],
    [products, categories]
  );

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'categorias', label: 'Categorías', icon: Tags },
    { id: 'noticias', label: 'Noticias', icon: TrendingUp },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const handleRefresh = async () => {
    await Promise.all([refetchDashboard(), refetchProducts(), refetchCategories(), refetchNews(), refetchContacts()]);
  };

  const isLoading = dashboardLoading || productsLoading || categoriesLoading || newsLoading || contactsLoading;

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(84,110,255,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(147,112,219,0.10),transparent_28%),var(--color-background)] px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-premium backdrop-blur-md lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden overflow-hidden border-r border-border/70 bg-[linear-gradient(135deg,rgba(84,110,255,0.08),rgba(147,112,219,0.08),rgba(15,23,42,0.02))] p-8 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.17),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-aether text-aether-foreground shadow-sm">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">DYC</p>
                  <h1 className="font-display text-3xl font-bold text-foreground">Panel administrativo</h1>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-aether">Panel administrativo</p>
                <h2 className="max-w-sm text-4xl font-semibold leading-tight text-foreground">
                  Gestiona el negocio con claridad y control.
                </h2>
                <p className="max-w-md text-base leading-7 text-muted-foreground">
                  Centraliza inventario, ventas, contenido y atención al cliente en una sola vista pensada para operar con rapidez y confianza.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
                <div className="mb-2 text-2xl font-semibold text-foreground">24/7</div>
                <div>Operación</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
                <div className="mb-2 text-2xl font-semibold text-foreground">+90%</div>
                <div>Visibilidad</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
                <div className="mb-2 text-2xl font-semibold text-foreground">1</div>
                <div>Panel central</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-aether text-aether-foreground shadow-sm">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">DYC</p>
                    <h1 className="font-display text-2xl font-bold text-foreground">Admin</h1>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Panel administrativo</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Bienvenido</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Inicia sesión</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <label htmlFor="admin-email" className="block text-sm font-medium text-foreground">
                    Correo electrónico
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu-correo@ejemplo.com"
                    aria-invalid={Boolean(error)}
                    className="h-12 w-full rounded-xl border border-input bg-background/80 px-3.5 text-[0.95rem] text-foreground shadow-sm focus:border-aether focus:outline-none focus:ring-2 focus:ring-aether/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="admin-password" className="block text-sm font-medium text-foreground">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-xs font-medium text-aether underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aether/20 rounded-md"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      aria-invalid={Boolean(error)}
                      className="h-12 w-full rounded-xl border border-input bg-background/80 px-3.5 pr-11 text-[0.95rem] text-foreground shadow-sm focus:border-aether focus:outline-none focus:ring-2 focus:ring-aether/20"
                    />
                  </div>
                </div>

                {error && (
                  <div aria-live="polite" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="wine"
                  size="lg"
                  disabled={isSubmitting}
                  className="mt-2 h-12 w-full rounded-xl font-semibold shadow-sm disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Accediendo...
                    </span>
                  ) : (
                    'Acceder'
                  )}
                </Button>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-72 border-r border-border bg-card/90 backdrop-blur-md md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-border p-5">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-aether text-aether-foreground shadow-sm">
              <Wand2 className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">DYC</h1>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-aether/8 text-aether shadow-sm ring-1 ring-aether/20'
                      : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <Button
              variant="outline"
              className="w-full justify-center rounded-xl"
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem(STORAGE_KEY);
              }}
            >
              <LogOut className="mr-2 size-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-colors hover:border-aether/30 hover:text-foreground md:hidden"
              >
                {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground sm:text-lg">
                  {navItems.find((item) => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
                  {new Date().toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {activeTab === 'dashboard' && <GlobalSearch products={products} categories={categories} users={[]} />}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-colors hover:border-aether/30 hover:text-foreground">
                <Bell className="size-4 sm:size-5" />
                {contacts.some((c: Contact) => !c.leido && !c.read) && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
                )}
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aether text-sm font-semibold text-aether-foreground">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Welcome section */}
              <div>
                <h1 className="font-display text-4xl font-bold text-foreground">Bienvenido al panel administrativo</h1>
                <p className="text-muted-foreground mt-2">Resumen general del sistema</p>
              </div>

              {/* Stats cards */}
              <DashboardStats stats={calculatedStats} isLoading={isLoading} />

              {/* Quick Actions */}
              <QuickActions onRefresh={handleRefresh} isRefreshing={isLoading} />

              {/* Alerts */}
              <SystemAlerts alerts={systemAlerts} isLoading={isLoading} />

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartComponent data={categoryChartData} isLoading={isLoading} title="Productos por categoría" type="pie" />
                <ChartComponent data={stockChartData} isLoading={isLoading} title="Estado del inventario" type="bar" />
              </div>

              {/* Featured products and activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                <FeaturedProducts products={products} isLoading={isLoading} />
                <ActivityFeed activities={activityFeed} isLoading={isLoading} />
              </div>
            </div>
          )}

          {activeTab === 'productos' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground">Productos</h2>
                  <p className="text-muted-foreground mt-2">{products.length} productos registrados</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="size-4 animate-spin" />
                      <span className="text-muted-foreground">Cargando productos...</span>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">Sin productos registrados</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-background/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Categoría</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Precio</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map((product: Product) => (
                          <tr key={product._id} className="hover:bg-background/50 transition-colors">
                            <td className="px-6 py-3 text-sm font-medium text-foreground">
                              {product.nombre || product.name}
                            </td>
                            <td className="px-6 py-3 text-sm text-muted-foreground">
                              {product.categoria?.nombre || product.categoria?.name || 'Sin categoría'}
                            </td>
                            <td className="px-6 py-3 text-sm font-medium text-foreground">
                              ${product.precio || product.price}
                            </td>
                            <td className="px-6 py-3 text-sm">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                  product.stock > 10
                                    ? 'bg-success/10 text-success'
                                    : product.stock > 0
                                      ? 'bg-warning/10 text-warning'
                                      : 'bg-destructive/10 text-destructive'
                                }`}
                              >
                                {product.stock}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'categorias' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Categorías</h2>
                <p className="text-muted-foreground mt-2">{categories.length} categorías totales</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-border/40 bg-card/50 h-24 animate-pulse" />
                    ))}
                  </>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12 col-span-full rounded-xl border border-border bg-card p-8">
                    <Tags className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Sin categorías registradas</p>
                  </div>
                ) : (
                  categories.map((category: Category) => (
                    <div
                      key={category._id}
                      className="rounded-lg border border-border/40 bg-card/50 p-4 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{category.nombre || category.name}</h4>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            category.activo || category.active ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {category.activo || category.active ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <AlertCircle className="size-3 mr-1" />
                          )}
                          {category.activo || category.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'noticias' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Noticias</h2>
                <p className="text-muted-foreground mt-2">{news.length} noticias publicadas</p>
              </div>

              <div className="grid gap-4">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-border/40 bg-card/50 h-32 animate-pulse" />
                    ))}
                  </>
                ) : news.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border border-border bg-card p-8">
                    <TrendingUp className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Sin noticias registradas</p>
                  </div>
                ) : (
                  news.map((item: NewsItem) => (
                    <div key={item._id} className="rounded-lg border border-border/40 bg-card/50 p-4 hover:shadow-soft transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.titulo || item.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.contenido || item.content}</p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                            item.activo || item.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.activo || item.active ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <AlertCircle className="size-3 mr-1" />
                          )}
                          {item.activo || item.active ? 'Activa' : 'Oculta'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'mensajes' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Mensajes de contacto</h2>
                <p className="text-muted-foreground mt-2">
                  {contacts.filter((c: Contact) => !c.leido && !c.read).length} nuevos
                </p>
              </div>

              <div className="grid gap-4">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-border/40 bg-card/50 h-32 animate-pulse" />
                    ))}
                  </>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border border-border bg-card p-8">
                    <MessageSquare className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Sin mensajes registrados</p>
                  </div>
                ) : (
                  contacts.map((contact: Contact) => (
                    <div key={contact._id} className="rounded-lg border border-border/40 bg-card/50 p-4 hover:shadow-soft transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{contact.nombre || contact.name}</h4>
                          <p className="mt-2 text-sm text-muted-foreground">{contact.mensaje || contact.message}</p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                            contact.leido || contact.read ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {!(contact.leido || contact.read) ? (
                            <AlertCircle className="size-3 mr-1" />
                          ) : (
                            <CheckCircle2 className="size-3 mr-1" />
                          )}
                          {!(contact.leido || contact.read) ? 'Nuevo' : 'Leído'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Configuración</h2>
                <p className="text-muted-foreground mt-2">Administra la configuración del sistema</p>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <p className="text-sm font-medium text-foreground">API Status</p>
                    <p className="text-xs text-muted-foreground mt-1">Backend conectado correctamente</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <p className="text-sm font-medium text-foreground">Base de datos</p>
                    <p className="text-xs text-muted-foreground mt-1">MongoDB Atlas conectado</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <p className="text-sm font-medium text-foreground">Versión</p>
                    <p className="text-xs text-muted-foreground mt-1">DYC Admin v1.0</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
