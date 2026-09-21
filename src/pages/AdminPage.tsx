import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  Trash2,
  Plus,
  Save,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { apiUrl, fetchWithTimeout } from "@/lib/api";
import { ADMIN_AUTH_STORAGE_KEY, readStoredAdminAuth } from "@/lib/admin-auth";

// Import new components
import { DashboardStats } from "@/components/admin/DashboardStats";
import { ChartComponent } from "@/components/admin/ChartComponent";
import { SystemAlerts } from "@/components/admin/SystemAlerts";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { FeaturedProducts } from "@/components/admin/FeaturedProducts";
import { QuickActions } from "@/components/admin/QuickActions";
import { GlobalSearch } from "@/components/admin/GlobalSearch";

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
  pendingOrders?: number;
  preparationOrders?: number;
  sales?: number;
  mercadoLibre?: {
    connected: boolean;
    label: string;
  };
}

interface AdminUser {
  _id: string;
  nombre?: string;
  correo?: string;
  email?: string;
  rol?: string;
  role?: string;
  activo?: boolean;
  telefono?: string;
  ultimoLogin?: string;
  lastLogin?: string;
  documento?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  codigoPostal?: string;
  empresa?: string;
}

interface Product {
  _id: string;
  nombre?: string;
  name?: string;
  descripcion?: string;
  precio?: number;
  price?: number;
  stock: number;
  stockMinimo?: number;
  sku?: string;
  disponible?: boolean;
  imagenes?: string[];
  activo?: boolean;
  active?: boolean;
  categoria?: {
    nombre?: string;
    name?: string;
  };
}

interface Category {
  _id: string;
  nombre?: string;
  name?: string;
  activo?: boolean;
  active?: boolean;
  descripcion?: string;
  imagenes?: string[];
}

interface Order {
  _id: string;
  total: number;
  subtotal: number;
  estado: string;
  esPedidoGrande?: boolean;
  requiereCotizacion?: boolean;
  items?: Array<{ nombre: string; cantidad: number }>;
  usuario?: { nombre?: string; correo?: string; rol?: string };
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
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    stockMinimo: "",
    sku: "",
    imagen: "",
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "cliente",
    telefono: "",
    documento: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    empresa: "",
  });
  const [inventoryForm, setInventoryForm] = useState({
    productId: "",
    cantidad: "",
    tipo: "entrada",
    motivo: "",
  });

  const storedAuth = readStoredAdminAuth();
  const authToken = "";

  // Fetch data from API
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isFetching: dashboardFetching,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/dashboard"), {
        credentials: "include",
        headers: {
        },
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/orders"), {
        credentials: "include",
        headers: {},
      });
      if (!res.ok) throw new Error("No se pudieron cargar los pedidos.");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/products"), {
        credentials: "include",
        headers: {
        },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/categories"), {
        credentials: "include",
        headers: {
        },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: newsData,
    isLoading: newsLoading,
    isFetching: newsFetching,
    refetch: refetchNews,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/news"), {
        credentials: "include",
        headers: {
        },
      });
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: contactsData,
    isLoading: contactsLoading,
    isFetching: contactsFetching,
    refetch: refetchContacts,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/contact"), {
        credentials: "include",
        headers: {
        },
      });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetchWithTimeout(apiUrl("/users"), {
        credentials: "include",
        headers: {},
      });
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios.");
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const products = useMemo<Product[]>(() => productsData?.data ?? [], [productsData?.data]);
  const categories = useMemo<Category[]>(() => categoriesData?.data ?? [], [categoriesData?.data]);
  const news = newsData?.data || [];
  const contacts = contactsData?.data || [];
  const users = useMemo<AdminUser[]>(() => usersData?.data ?? [], [usersData?.data]);
  const orders = useMemo<Order[]>(() => ordersData?.data ?? [], [ordersData?.data]);
  const stats = dashboardData?.data;
  const totalProducts = stats?.totals?.productos ?? stats?.totalProducts ?? 0;
  const totalUsers = stats?.totals?.usuarios ?? stats?.totalUsers ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const preparationOrders = stats?.preparationOrders ?? 0;

  // Restore auth state
  useEffect(() => {
    const auth = readStoredAdminAuth();
    void fetchWithTimeout(apiUrl("/auth/me"), { credentials: "include" })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        const role = payload?.data?.rol ?? payload?.data?.role;
        if (response.ok && role === "admin") setIsAuthenticated(true);
        else await navigate({ to: "/admin/login", replace: true });
      })
      .catch(() => navigate({ to: "/admin/login", replace: true }))
      .finally(() => setIsAuthReady(true));
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Introduce tu correo y contraseña para continuar.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      const payload = await response.json();

      if (!response.ok || !payload?.data?.token) {
        setError(
          payload?.message || "Las credenciales no coinciden con el acceso del administrador.",
        );
        setIsSubmitting(false);
        return;
      }

      const token = String(payload.data.token);
      setIsAuthenticated(true);
      localStorage.setItem(
        ADMIN_AUTH_STORAGE_KEY,
        JSON.stringify({
          isAuthenticated: true,
          token,
          role: payload.data.user?.rol ?? payload.data.user?.role,
        }),
      );
      setForm({ email: "", password: "" });
    } catch (loginError) {
      if (loginError instanceof DOMException && loginError.name === "AbortError") {
        setError("El servidor tardó demasiado en responder. Inténtalo de nuevo.");
      } else {
        setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
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
        label: "Productos",
        value: totalProducts,
        icon: <Package className="size-5 text-aether" />,
        description: "registrados",
        color: "bg-gradient-to-br from-aether/5 to-transparent",
      },
      {
        label: "Categorías",
        value: categories.length,
        icon: <Tags className="size-5 text-purple" />,
        description: "activas",
        color: "bg-gradient-to-br from-purple/5 to-transparent",
      },
      {
        label: "Usuarios",
        value: totalUsers,
        icon: <Users className="size-5 text-aether" />,
        description: "registrados",
        color: "bg-gradient-to-br from-aether/5 to-transparent",
      },
      {
        label: "Stock total",
        value: totalStock,
        icon: <TrendingUp className="size-5 text-success" />,
        description: "unidades disponibles",
        color: "bg-gradient-to-br from-success/5 to-transparent",
      },
      {
        label: "Stock bajo",
        value: lowStockCount,
        icon: <AlertTriangle className="size-5 text-warning" />,
        description: "< 10 unidades",
        color: "bg-gradient-to-br from-warning/5 to-transparent",
      },
      {
        label: "Agotados",
        value: outOfStockCount,
        icon: <AlertCircle className="size-5 text-destructive" />,
        description: "0 unidades",
        color: "bg-gradient-to-br from-destructive/5 to-transparent",
      },
      {
        label: "Pedidos pendientes",
        value: pendingOrders,
        icon: <Package className="size-5 text-warning" />,
        description: "por confirmar",
        color: "bg-gradient-to-br from-warning/5 to-transparent",
      },
      {
        label: "En preparación",
        value: preparationOrders,
        icon: <TrendingUp className="size-5 text-aether" />,
        description: "en producción",
        color: "bg-gradient-to-br from-aether/5 to-transparent",
      },
      {
        label: "Ventas",
        value: `$${Number(stats?.sales ?? 0).toLocaleString("es-MX")} MXN`,
        icon: <TrendingUp className="size-5 text-success" />,
        description: "pedidos no cancelados",
        color: "bg-gradient-to-br from-success/5 to-transparent",
      },
      {
        label: "Mercado Libre",
        value: stats?.mercadoLibre?.connected ? "Conectado" : "Pendiente",
        icon: <ShieldCheck className="size-5 text-gold" />,
        description: stats?.mercadoLibre?.label ?? "Mercado Libre no está conectado",
        color: "bg-gradient-to-br from-gold/5 to-transparent",
      },
    ];
  }, [stats, products, categories, pendingOrders, preparationOrders, totalProducts, totalUsers]);

  // Calculate system alerts
  const systemAlerts = useMemo(() => {
    const alerts = [];
    const outOfStock = products.filter((p: Product) => p.stock === 0).length;
    const lowStock = products.filter((p: Product) => p.stock < 10 && p.stock > 0).length;

    if (outOfStock > 0) {
      alerts.push({
        id: "out-of-stock",
        type: "error" as const,
        message: "Productos agotados",
        count: outOfStock,
      });
    }

    if (lowStock > 0) {
      alerts.push({
        id: "low-stock",
        type: "warning" as const,
        message: "Productos con stock bajo",
        count: lowStock,
      });
    }

    if (outOfStock === 0 && lowStock === 0) {
      alerts.push({
        id: "all-good",
        type: "success" as const,
        message: "El inventario está en buen estado",
      });
    }

    return alerts;
  }, [products]);

  // Chart data for products by category
  const categoryChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    products.forEach((p: Product) => {
      const catName = p.categoria?.nombre || p.categoria?.name || "Sin categoría";
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
      { name: "Disponible", value: available },
      { name: "Stock bajo", value: lowStock },
      { name: "Agotado", value: outOfStock },
    ];
  }, [products]);

  // Activity feed (mock - in real scenario would come from API)
  const activityFeed = useMemo(
    () => [
      {
        id: "1",
        action: "Productos actualizados",
        type: "edit" as const,
        timestamp: "Hace 2 minutos",
        details: `Total: ${products.length} productos`,
      },
      {
        id: "2",
        action: "Categorías consultadas",
        type: "add" as const,
        timestamp: "Hace 5 minutos",
        details: `Total: ${categories.length} categorías`,
      },
      {
        id: "3",
        action: "Dashboard accedido",
        type: "login" as const,
        timestamp: "Hace 10 minutos",
        details: "Admin panel",
      },
    ],
    [products, categories],
  );

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "productos", label: "Productos", icon: Package },
    { id: "inventario", label: "Inventario", icon: TrendingUp },
    { id: "categorias", label: "Categorías", icon: Tags },
    { id: "noticias", label: "Noticias", icon: TrendingUp },
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "pedidos", label: "Pedidos", icon: Package },
    { id: "mensajes", label: "Mensajes", icon: MessageSquare },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  const handleRefresh = async () => {
    await Promise.allSettled([
      refetchDashboard(),
      refetchProducts(),
      refetchCategories(),
      refetchNews(),
      refetchContacts(),
      refetchUsers(),
      refetchOrders(),
    ]);
  };

  const mutateAdmin = async (
    path: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body?: unknown,
  ) => {
    setMutationError("");
    const response = await fetch(apiUrl(path), {
      method,
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.message || "No se pudo completar la operación.");
    return payload;
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let imageUrl = productForm.imagen.trim();
      if (productImage) {
        const formData = new FormData();
        formData.append("file", productImage);
        const uploadResponse = await fetch(apiUrl("/upload"), {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const uploadPayload = await uploadResponse.json().catch(() => null);
        if (!uploadResponse.ok) throw new Error(uploadPayload?.message || "No se pudo subir la imagen.");
        imageUrl = String(uploadPayload?.data?.url ?? "");
      }
      await mutateAdmin("/products", "POST", {
        ...productForm,
        precio: Number(productForm.precio),
        stock: Number(productForm.stock),
        stockMinimo: Number(productForm.stockMinimo || 0),
        imagenes: imageUrl ? [imageUrl] : [],
      });
      setProductForm({ nombre: "", descripcion: "", precio: "", stock: "", stockMinimo: "", sku: "", imagen: "" });
      setProductImage(null);
      setShowProductForm(false);
      await Promise.all([refetchProducts(), refetchDashboard()]);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo crear el producto.");
    }
  };

  const handleInventoryMovement = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await mutateAdmin(`/products/${inventoryForm.productId}/inventory`, "POST", {
        cantidad: Number(inventoryForm.cantidad),
        tipo: inventoryForm.tipo,
        motivo: inventoryForm.motivo.trim(),
      });
      setInventoryForm({ productId: "", cantidad: "", tipo: "entrada", motivo: "" });
      await Promise.all([refetchProducts(), refetchDashboard()]);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo registrar el movimiento.");
    }
  };

  const handleEditProduct = async (product: Product) => {
    const stock = window.prompt("Stock disponible", String(product.stock));
    if (stock === null) return;
    const description = window.prompt("Descripción", product.descripcion ?? "");
    if (description === null) return;
    const image = window.prompt("URL de imagen", product.imagenes?.[0] ?? "");
    if (image === null) return;

    try {
      await mutateAdmin(`/products/${product._id}`, "PUT", {
        stock: Math.max(0, Number(stock)),
        descripcion: description.trim(),
        imagenes: image.trim() ? [image.trim()] : [],
      });
      await Promise.all([refetchProducts(), refetchDashboard()]);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo actualizar el producto.");
    }
  };

  const handleDelete = async (resource: string, id: string, refresh: () => Promise<unknown>) => {
    if (!window.confirm("¿Confirmas que deseas eliminar este registro?")) return;
    try {
      await mutateAdmin(`/${resource}/${id}`, "DELETE");
      await refresh();
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo eliminar el registro.");
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await mutateAdmin("/users", "POST", userForm);
      setUserForm({
        nombre: "",
        correo: "",
        password: "",
        rol: "cliente",
        telefono: "",
        documento: "",
        direccion: "",
        ciudad: "",
        estado: "",
        codigoPostal: "",
        empresa: "",
      });
      setShowUserForm(false);
      await Promise.all([refetchUsers(), refetchDashboard()]);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo crear el usuario.");
    }
  };

  const handleUpdateOrder = async (orderId: string, estado: string) => {
    try {
      await mutateAdmin(`/orders/${orderId}/status`, "PATCH", { estado });
      await refetchOrders();
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "No se pudo actualizar el pedido.");
    }
  };

  const handleToggleUser = async (user: AdminUser) => {
    try {
      await mutateAdmin(`/users/${user._id}`, "PUT", { activo: !(user.activo ?? true) });
      await refetchUsers();
    } catch (error) {
      setMutationError(
        error instanceof Error ? error.message : "No se pudo actualizar el usuario.",
      );
    }
  };

  const isLoading =
    dashboardLoading ||
    ordersLoading ||
    productsLoading ||
    categoriesLoading ||
    newsLoading ||
    contactsLoading ||
    usersLoading;
  const isRefreshing =
    dashboardFetching ||
    ordersFetching ||
    productsFetching ||
    categoriesFetching ||
    newsFetching ||
    contactsFetching ||
    usersFetching;

  // Login screen
  if (!isAuthReady) {
    return (
      <div className="admin-screen flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 text-base font-medium text-muted-foreground">
          <span className="size-5 animate-spin rounded-full border-2 border-aether border-t-transparent" />
          Verificando acceso...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-aether)_10%,transparent),transparent_30%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-gold)_10%,transparent),transparent_28%),var(--color-background)] px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-premium backdrop-blur-md lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden overflow-hidden border-r border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-aether)_8%,transparent),color-mix(in_srgb,var(--color-gold)_8%,transparent),transparent)] p-8 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-aether)_17%,transparent),transparent_35%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-gold)_14%,transparent),transparent_28%)]" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-aether text-aether-foreground shadow-sm">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    D&C
                  </p>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    Panel operativo
                  </h1>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-aether">
                  Panel operativo
                </p>
                <h2 className="max-w-sm text-4xl font-semibold leading-tight text-foreground">
                  Gestiona el negocio con claridad y control.
                </h2>
                <p className="max-w-md text-base leading-7 text-muted-foreground">
                  Centraliza inventario, ventas, contenido y atención al cliente en una sola vista
                  pensada para operar con rapidez y confianza.
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
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      D&C
                    </p>
                    <h1 className="font-display text-2xl font-bold text-foreground">Operación</h1>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Panel operativo</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Bienvenido
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  Inicia sesión
                </h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <label
                    htmlFor="admin-email"
                    className="block text-sm font-medium text-foreground"
                  >
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
                    <label
                      htmlFor="admin-password"
                      className="block text-sm font-medium text-foreground"
                    >
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-xs font-medium text-aether underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aether/20 rounded-md"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
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
                  <div
                    aria-live="polite"
                    className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
                  >
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
                    "Acceder"
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
    <div className="admin-screen flex min-h-screen bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-aether)_12%,transparent),transparent_25%),var(--color-background)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } admin-panel w-72 border-r-0 bg-card/95 shadow-premium backdrop-blur-md md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border/80 p-5 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-aether to-purple text-aether-foreground shadow-float">
                <Wand2 className="size-5" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">D&C</h1>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Operación
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-aether/15 bg-aether/5 px-3 py-2.5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-aether">
                Centro de control
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Gestiona todo desde un solo lugar
              </p>
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
                  className={`admin-shine group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-aether/8 text-aether shadow-sm ring-1 ring-aether/20"
                      : "text-muted-foreground hover:bg-aether/5 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 transition-transform group-hover:scale-110" />
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
                localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
                void fetchWithTimeout(apiUrl("/auth/logout"), {
                  method: "POST",
                  headers: {},
                }).catch((logoutError) => {
                  console.error("No se pudo registrar el cierre de sesión.", logoutError);
                });
                void navigate({ to: "/admin/login", replace: true });
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
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 shadow-soft backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-colors hover:border-aether/30 hover:text-foreground md:hidden"
              >
                {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                  {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {activeTab === "dashboard" && (
                <GlobalSearch products={products} categories={categories} users={[]} />
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-2 text-xs font-semibold text-success sm:flex">
                <CheckCircle2 className="size-4" />
                Sistema activo
              </div>
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-colors hover:border-aether/30 hover:bg-aether/5 hover:text-foreground">
                <Bell className="size-4 sm:size-5" />
                {contacts.some((c: Contact) => !c.leido && !c.read) && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
                )}
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-aether to-purple text-sm font-semibold text-aether-foreground shadow-float">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 text-base sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="admin-shine relative overflow-hidden rounded-[2rem] border border-aether/20 bg-gradient-to-br from-aether/15 via-card to-purple/15 p-6 shadow-premium sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-aether/10 blur-3xl" />
                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-aether/20 bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-aether">
                      <CheckCircle2 className="size-4" />
                      Operación en orden
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                      Bienvenido a D&C
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                      Resumen general de tu operación para que tomes decisiones rápidas, claras y
                      con control.
                    </p>
                  </div>
                  <div className="admin-panel min-w-48 rounded-2xl p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Vista general
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">Todo bajo control</p>
                  </div>
                </div>
              </div>

              {/* Stats cards */}
              <DashboardStats stats={calculatedStats} isLoading={isLoading} />

              {/* Quick Actions */}
              <QuickActions onRefresh={handleRefresh} isRefreshing={isRefreshing} />

              {/* Alerts */}
              <SystemAlerts alerts={systemAlerts} isLoading={isLoading} />

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartComponent
                  data={categoryChartData}
                  isLoading={isLoading}
                  title="Productos por categoría"
                  type="pie"
                />
                <ChartComponent
                  data={stockChartData}
                  isLoading={isLoading}
                  title="Estado del inventario"
                  type="bar"
                />
              </div>

              {/* Featured products and activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                <FeaturedProducts products={products} isLoading={isLoading} />
                <ActivityFeed activities={activityFeed} isLoading={isLoading} />
              </div>
            </div>
          )}

          {activeTab === "productos" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground">Productos</h2>
                  <p className="text-muted-foreground mt-2">
                    {products.length} productos registrados
                  </p>
                </div>
                <Button variant="wine" onClick={() => setShowProductForm((value) => !value)}>
                  <Plus className="size-4" />
                  Nuevo producto
                </Button>
              </div>

              {mutationError ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{mutationError}</AlertDescription>
                </Alert>
              ) : null}

              {showProductForm ? (
                <form
                  onSubmit={handleCreateProduct}
                  className="admin-form-panel product-form admin-panel grid gap-4 rounded-2xl p-5 md:grid-cols-2"
                >
                  <input
                    required
                    placeholder="Nombre"
                    value={productForm.nombre}
                    onChange={(event) =>
                      setProductForm({ ...productForm, nombre: event.target.value })
                    }
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="Precio"
                    value={productForm.precio}
                    onChange={(event) =>
                      setProductForm({ ...productForm, precio: event.target.value })
                    }
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock mínimo"
                    value={productForm.stockMinimo}
                    onChange={(event) =>
                      setProductForm({ ...productForm, stockMinimo: event.target.value })
                    }
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="SKU (opcional)"
                    value={productForm.sku}
                    onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={productForm.stock}
                    onChange={(event) =>
                      setProductForm({ ...productForm, stock: event.target.value })
                    }
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    required
                    placeholder="Descripción"
                    value={productForm.descripcion}
                    onChange={(event) =>
                      setProductForm({ ...productForm, descripcion: event.target.value })
                    }
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    type="url"
                    placeholder="URL de imagen (opcional)"
                    value={productForm.imagen}
                    onChange={(event) => setProductForm({ ...productForm, imagen: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) => setProductImage(event.target.files?.[0] ?? null)}
                    className="h-11 rounded-xl border bg-background px-3 py-2 text-sm"
                  />
                  <Button type="submit" variant="wine" className="md:col-span-2">
                    <Save className="size-4" />
                    Guardar producto
                  </Button>
                </form>
              ) : null}

              <div className="admin-panel admin-shine overflow-hidden rounded-[1.5rem]">
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
                      <thead className="border-b border-border bg-aether/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Nombre
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Categoría
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Precio
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Stock
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            SKU
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map((product: Product) => (
                          <tr key={product._id} className="transition-colors hover:bg-aether/5">
                            <td className="px-6 py-3 text-sm font-medium text-foreground">
                              {product.nombre || product.name}
                            </td>
                            <td className="px-6 py-3 text-sm text-muted-foreground">
                              {product.categoria?.nombre ||
                                product.categoria?.name ||
                                "Sin categoría"}
                            </td>
                            <td className="px-6 py-3 text-sm font-medium text-foreground">
                              ${product.precio || product.price}
                            </td>
                            <td className="px-6 py-3 text-sm">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                  product.stock > 10
                                    ? "bg-success/10 text-success"
                                    : product.stock > 0
                                      ? "bg-warning/10 text-warning"
                                      : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-sm text-muted-foreground">
                              {product.sku || "Sin SKU"}
                            </td>
                            <td className="px-6 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Editar ${product.nombre || product.name}`}
                                onClick={() => void handleEditProduct(product)}
                              >
                                <Pencil className="size-4 text-aether" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Eliminar ${product.nombre || product.name}`}
                                onClick={() =>
                                  handleDelete("products", product._id, refetchProducts)
                                }
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  void mutateAdmin(`/products/${product._id}`, "PUT", {
                                    activo: !(product.activo ?? product.active ?? true),
                                  }).then(() => refetchProducts())
                                }
                              >
                                {product.activo ?? product.active ?? true ? "Desactivar" : "Activar"}
                              </Button>
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

          {activeTab === "inventario" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aether">Control de stock</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Inventario</h2>
                <p className="mt-2 text-muted-foreground">Registra entradas, salidas y ajustes con motivo y usuario.</p>
              </div>

              {mutationError ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{mutationError}</AlertDescription>
                </Alert>
              ) : null}

              <form onSubmit={handleInventoryMovement} className="admin-form-panel inventory-form admin-panel grid gap-4 rounded-2xl p-5 md:grid-cols-4">
                <select
                  required
                  value={inventoryForm.productId}
                  onChange={(event) => setInventoryForm({ ...inventoryForm, productId: event.target.value })}
                  className="h-11 rounded-xl border bg-background px-3 md:col-span-2"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.nombre || product.name} · stock {product.stock}
                    </option>
                  ))}
                </select>
                <select
                  value={inventoryForm.tipo}
                  onChange={(event) => setInventoryForm({ ...inventoryForm, tipo: event.target.value })}
                  className="h-11 rounded-xl border bg-background px-3"
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  <option value="ajuste">Ajuste</option>
                </select>
                <input
                  required
                  min="1"
                  type="number"
                  placeholder="Cantidad"
                  value={inventoryForm.cantidad}
                  onChange={(event) => setInventoryForm({ ...inventoryForm, cantidad: event.target.value })}
                  className="h-11 rounded-xl border bg-background px-3"
                />
                <input
                  required
                  placeholder="Motivo del movimiento"
                  value={inventoryForm.motivo}
                  onChange={(event) => setInventoryForm({ ...inventoryForm, motivo: event.target.value })}
                  className="h-11 rounded-xl border bg-background px-3 md:col-span-3"
                />
                <Button type="submit" variant="wine">Registrar movimiento</Button>
              </form>

              <div className="admin-panel overflow-hidden rounded-2xl">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Cargando inventario...</div>
                ) : products.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No hay productos para gestionar.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead className="border-b border-border bg-aether/5">
                        <tr>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Producto</th>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">SKU</th>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Actual</th>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Mínimo</th>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map((product) => {
                          const minimum = product.stockMinimo ?? 0;
                          const low = product.stock <= minimum;
                          return (
                            <tr key={product._id} className="transition-colors hover:bg-aether/5">
                              <td className="px-5 py-3 text-sm font-medium text-foreground">{product.nombre || product.name}</td>
                              <td className="px-5 py-3 text-sm text-muted-foreground">{product.sku || "Sin SKU"}</td>
                              <td className="px-5 py-3 text-sm font-semibold text-foreground">{product.stock}</td>
                              <td className="px-5 py-3 text-sm text-muted-foreground">{minimum}</td>
                              <td className="px-5 py-3 text-sm">
                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${low ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                                  {low ? "Stock bajo" : "Disponible"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "categorias" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Categorías</h2>
                <p className="text-muted-foreground mt-2">{categories.length} categorías totales</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 bg-card/50 h-24 animate-pulse"
                      />
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
                      className="admin-shine rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-float"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">
                          {category.nombre || category.name}
                        </h4>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            category.activo || category.active
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {category.activo || category.active ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <AlertCircle className="size-3 mr-1" />
                          )}
                          {category.activo || category.active ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Eliminar ${category.nombre || category.name}`}
                          onClick={() =>
                            handleDelete("categories", category._id, refetchCategories)
                          }
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "noticias" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Noticias</h2>
                <p className="text-muted-foreground mt-2">{news.length} noticias publicadas</p>
              </div>

              <div className="grid gap-4">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 bg-card/50 h-32 animate-pulse"
                      />
                    ))}
                  </>
                ) : news.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border border-border bg-card p-8">
                    <TrendingUp className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Sin noticias registradas</p>
                  </div>
                ) : (
                  news.map((item: NewsItem) => (
                    <div
                      key={item._id}
                      className="rounded-lg border border-border/40 bg-card/50 p-4 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {item.titulo || item.title}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {item.contenido || item.content}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                            item.activo || item.active
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.activo || item.active ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <AlertCircle className="size-3 mr-1" />
                          )}
                          {item.activo || item.active ? "Activa" : "Oculta"}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Eliminar ${item.titulo || item.title}`}
                          onClick={() => handleDelete("news", item._id, refetchNews)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "usuarios" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aether">
                    Equipo y accesos
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Usuarios</h2>
                  <p className="mt-2 text-muted-foreground">
                    Administra cuentas, roles y acceso al panel.
                  </p>
                </div>
                <Button variant="wine" onClick={() => setShowUserForm((value) => !value)}>
                  <Plus className="size-4" />
                  Nuevo usuario
                </Button>
              </div>

              {showUserForm ? (
                <form
                  onSubmit={handleCreateUser}
                  className="admin-form-panel user-form admin-panel grid gap-4 rounded-2xl p-5 md:grid-cols-2"
                >
                  <input
                    required
                    placeholder="Nombre completo"
                    value={userForm.nombre}
                    onChange={(event) => setUserForm({ ...userForm, nombre: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Correo"
                    value={userForm.correo}
                    onChange={(event) => setUserForm({ ...userForm, correo: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    required
                    minLength={8}
                    type="password"
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    value={userForm.password}
                    onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="Teléfono"
                    value={userForm.telefono}
                    onChange={(event) => setUserForm({ ...userForm, telefono: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="Documento o RFC"
                    value={userForm.documento}
                    onChange={(event) => setUserForm({ ...userForm, documento: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="Dirección de entrega"
                    value={userForm.direccion}
                    onChange={(event) => setUserForm({ ...userForm, direccion: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3 md:col-span-2"
                  />
                  <input
                    placeholder="Ciudad"
                    value={userForm.ciudad}
                    onChange={(event) => setUserForm({ ...userForm, ciudad: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="Estado"
                    value={userForm.estado}
                    onChange={(event) => setUserForm({ ...userForm, estado: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="Código postal"
                    value={userForm.codigoPostal}
                    onChange={(event) => setUserForm({ ...userForm, codigoPostal: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <input
                    placeholder="Empresa (opcional)"
                    value={userForm.empresa}
                    onChange={(event) => setUserForm({ ...userForm, empresa: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  />
                  <select
                    value={userForm.rol}
                    onChange={(event) => setUserForm({ ...userForm, rol: event.target.value })}
                    className="h-11 rounded-xl border bg-background px-3"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="plus">Usuario Plus</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <Button type="submit" variant="wine" className="md:col-span-2">
                    <Save className="size-4" />
                    Crear usuario
                  </Button>
                </form>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {usersLoading ? (
                  [1, 2, 3].map((item) => (
                    <div key={item} className="h-40 animate-pulse rounded-2xl border bg-card/50" />
                  ))
                ) : users.length === 0 ? (
                  <div className="admin-panel col-span-full rounded-2xl p-10 text-center">
                    <Users className="mx-auto mb-3 size-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No hay usuarios registrados.</p>
                  </div>
                ) : (
                  users.map((user) => {
                    const role = user.rol ?? user.role ?? "cliente";
                    const active = user.activo ?? true;
                    return (
                      <article key={user._id} className="admin-panel admin-shine rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-aether/10 text-aether">
                              <Users className="size-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{user.nombre}</h3>
                              <p className="text-xs text-muted-foreground">
                                {user.correo ?? user.email}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide ${
                              active
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {active ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                          <span className="rounded-full bg-aether/10 px-3 py-1 text-xs font-medium capitalize text-aether">
                            {role}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => void handleToggleUser(user)}
                            >
                              {active ? "Desactivar" : "Activar"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Eliminar ${user.nombre}`}
                              onClick={() => void handleDelete("users", user._id, refetchUsers)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aether">Operación comercial</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Pedidos</h2>
                <p className="mt-2 text-muted-foreground">Supervisa pedidos normales y solicitudes de gran volumen.</p>
              </div>
              <div className="grid gap-4">
                {ordersLoading ? (
                  <div className="admin-panel rounded-2xl p-8 text-center text-muted-foreground">Cargando pedidos...</div>
                ) : orders.length === 0 ? (
                  <div className="admin-panel rounded-2xl p-8 text-center text-muted-foreground">No hay pedidos registrados.</div>
                ) : (
                  orders.map((order) => (
                    <article key={order._id} className="admin-panel rounded-2xl p-5">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{order.usuario?.nombre || "Cliente"}</h3>
                            {order.esPedidoGrande ? (
                              <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">Pedido grande</span>
                            ) : null}
                            {order.requiereCotizacion ? (
                              <span className="rounded-full bg-aether/10 px-2.5 py-1 text-xs font-semibold text-aether">Requiere cotización</span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{order.usuario?.correo || "Sin correo"}</p>
                          <p className="mt-2 text-sm text-foreground">{order.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0} unidades · ${order.total.toLocaleString("es-MX")}</p>
                        </div>
                        <select
                          value={order.estado}
                          onChange={(event) => void handleUpdateOrder(order._id, event.target.value)}
                          className="h-11 rounded-xl border bg-background px-3 text-sm"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="en_preparacion">En preparación</option>
                          <option value="en_produccion">En producción</option>
                          <option value="listo">Listo</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "mensajes" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Mensajes de contacto
                </h2>
                <p className="text-muted-foreground mt-2">
                  {contacts.filter((c: Contact) => !c.leido && !c.read).length} nuevos
                </p>
              </div>

              <div className="grid gap-4">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 bg-card/50 h-32 animate-pulse"
                      />
                    ))}
                  </>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border border-border bg-card p-8">
                    <MessageSquare className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Sin mensajes registrados</p>
                  </div>
                ) : (
                  contacts.map((contact: Contact) => (
                    <div
                      key={contact._id}
                      className="rounded-lg border border-border/40 bg-card/50 p-4 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {contact.nombre || contact.name}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {contact.mensaje || contact.message}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                            contact.leido || contact.read
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {!(contact.leido || contact.read) ? (
                            <AlertCircle className="size-3 mr-1" />
                          ) : (
                            <CheckCircle2 className="size-3 mr-1" />
                          )}
                          {!(contact.leido || contact.read) ? "Nuevo" : "Leído"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "configuracion" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Configuración</h2>
                <p className="text-muted-foreground mt-2">
                  Administra la configuración del sistema
                </p>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-soft">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <p className="text-sm font-medium text-foreground">API Status</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Backend conectado correctamente
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <p className="text-sm font-medium text-foreground">Base de datos</p>
                    <p className="text-xs text-muted-foreground mt-1">MongoDB Atlas conectado</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <p className="text-sm font-medium text-foreground">Versión</p>
                    <p className="text-xs text-muted-foreground mt-1">D&C · Operación v1.0</p>
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
