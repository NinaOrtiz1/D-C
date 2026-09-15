# DYC Innovación

Aplicación web integral de DYC Innovación para productos personalizados, grabado láser, impresión 3D, pedidos e inventario. Combina un sitio público con un panel administrativo protegido.

## 1. Descripción general

Este proyecto ha sido desarrollado como una solución integral con:

- Frontend moderno en React + Vite + TypeScript
- Backend API REST con Express + TypeScript
- Base de datos con MongoDB (Atlas o memoria local para desarrollo)
- Sistema de autenticación con JWT y PIN administrativo
- Panel administrativo con acceso protegido y gestión de contenido
- Arquitectura lista para despliegue profesional
- Contenedores Docker para ejecución local
- Documentación y pruebas básicas de calidad

## 2. Objetivo del proyecto

Desarrollar una aplicación funcional, segura y visualmente profesional que permita:

- mostrar productos y servicios al público
- gestionar contenido del sitio
- administrar usuarios y roles
- centralizar información de negocio y operación
- proteger el acceso al panel administrativo
- simular un entorno real de trabajo empresarial

## 3. Stack tecnológico

- React 19
- Vite
- TypeScript
- Tailwind CSS
- TanStack Router
- TanStack Query
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- Docker
- Vitest
- Node.js 20+

## 4. Estructura del proyecto

```text
.
├── src/                 # Frontend React
│   ├── components/      # Componentes reutilizables y módulos del sitio
│   ├── pages/           # Vistas del sitio y administración
│   ├── routes/          # Rutas de TanStack Router
│   ├── lib/             # Utilidades, auth y pruebas
│   └── styles.css       # Estilos globales
├── server/              # Backend Express
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # API REST
│   ├── middleware/      # Auth y manejo de errores
│   ├── models.ts        # Esquemas MongoDB
│   ├── auth.ts          # JWT y hash de contraseñas
│   └── database.ts      # Conexión a MongoDB
├── public/              # Archivos públicos
├── uploads/             # Archivos cargados por usuarios
├── python_service/      # Servicio Python aislado para IA o automatización
├── Dockerfile           # Configuración del contenedor principal
├── docker-compose.yml   # Orquestación local
├── package.json         # Scripts del proyecto
├── vite.config.ts       # Configuración de Vite
├── README.md            # Documentación principal
└── .env.example         # Variables de entorno esperadas
```

## 5. Requisitos previos

- Node.js 20 o superior
- npm
- Git
- Docker y Docker Compose (opcional para ejecución containerizada)
- MongoDB Atlas o conexión local opcional

## 6. Instalación y ejecución

### 6.1 Clonar el repositorio

```bash
git clone https://github.com/NinaOrtiz1/D-C.git
cd D-C
```

### 6.2 Instalar dependencias

```bash
npm install
```

### 6.3 Configurar variables de entorno

Crea un archivo `.env` en la raíz con este contenido:

```bash
JWT_SECRET=define-una-clave-local-segura
ADMIN_PIN=define-en-tu-entorno
MONGODB_URI=
CLIENT_URL=http://localhost:5173
PORT=4000
SEED_ADMIN_PASSWORD=define-en-tu-entorno
SEED_EDITOR_PASSWORD=define-en-tu-entorno
SEED_CLIENT_PASSWORD=define-en-tu-entorno
```

Notas:

- `MONGODB_URI` debe apuntar a MongoDB Atlas; el backend no inicia si está vacía o es inválida.
- Para producción se recomienda usar MongoDB Atlas con una URI real.
- El PIN admin se usa para validar el acceso al panel administrativo.

### 6.4 Ejecutar en modo desarrollo

```bash
npm run dev
```

Esto levanta:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### 6.5 Compilar para producción

```bash
npm run build
```

### 6.6 Ejecutar pruebas

```bash
npm test
```

### 6.7 Inicializar datos base

```bash
npm run seed
```

Este comando crea usuarios demo iniciales y contenido base para la aplicación.

## 7. Credenciales demo

El seed genera cuentas de prueba:

- Administrador
  - Email: admin@dcinnovacion.mx
  - Contraseña: la definida en `SEED_ADMIN_PASSWORD`
- Editor
  - Email: editor@dcinnovacion.mx
  - Contraseña: la definida en `SEED_EDITOR_PASSWORD`
- Cliente
  - Email: cliente1@dcinnovacion.mx
  - Contraseña: la definida en `SEED_CLIENT_PASSWORD`

## 8. Arquitectura del sistema

### Frontend

El frontend está estructurado en componentes reutilizables, páginas y rutas. Incluye:

- landing page del negocio
- secciones de productos, servicios, FAQ, contacto y testimonios
- panel administrador con métricas y gestión
- acceso protegido con PIN y sesión persistente

### Backend

El backend se encarga de:

- autenticación de usuarios
- validación de JWT
- validación de PIN administrativo
- gestión de productos, usuarios y contenido
- manejo de logs y historial de actividad
- respuestas normalizadas para la API

### Seguridad

Se implementan medidas clave:

- JWT con expiración
- cookies HttpOnly para acceso protegido
- validación de roles
- comprobación de usuarios activos
- control de sesión en almacenamiento local
- protección por PIN para acceso administrativo
- manejo de errores en endpoints críticos

## 9. Estado académico verificable

El proyecto cumple con los requisitos del curso de Desarrollo Web Integral:

- Arquitectura modular frontend/backend: ✅ comprobada
- Desarrollo React + TypeScript + Express + MongoDB: ✅ comprobado
- Control de versiones: ✅ historial, ramas y remoto comprobados
- Seguridad base: ✅ JWT, PIN, roles, bcrypt y cookies comprobados por código y pruebas manuales parciales
- Docker: 🟡 configuración documentada; build pendiente de validación local reproducible
- Pruebas automatizadas: 🟡 script configurado; ejecución pendiente por bloqueo local de `npm ci`
- CI/CD: 🟡 workflow CI configurado; pendiente de validación mediante ejecución real en GitHub
- Despliegue: 🟡 configuración Vercel existente; producción activa no comprobada
- Pull Request: 🔴 pendiente de evidencia
- Mercado Libre: 🟡 preparado, pendiente de credenciales/OAuth

## 10. Docker

### Ejecutar con Docker Compose

```bash
docker compose up --build
```

El proyecto queda disponible en:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 11. Despliegue y documentación

### Opción recomendada

- Frontend: Vercel
- Backend: Render, Railway o Azure
- Base de datos: MongoDB Atlas

La arquitectura de despliegue y sus límites están documentados en [docs/despliegue.md](docs/despliegue.md). La instalación está en [docs/manual-instalacion.md](docs/manual-instalacion.md), el uso en [docs/manual-usuario.md](docs/manual-usuario.md) y la arquitectura en [docs/arquitectura.md](docs/arquitectura.md).

### Variables necesarias en producción

```bash
JWT_SECRET=define-un-secret-real-largo-y-seguro
ADMIN_PIN=define-un-pin-en-tu-entorno
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/aether
CLIENT_URL=https://tu-frontend.vercel.app
PORT=4000
```

## 12. Herramientas de pruebas

El proyecto incluye pruebas unitarias para el almacenamiento de sesión administrativa y validación de estados críticos de auth.

Ejemplos de cobertura:

- sesión válida
- expiración de token
- limpieza de almacenamiento
- detección de sesión cercana a vencerse

## 13. Funcionalidades premium implementadas

- acceso protegido con PIN para administración
- sesión persistente con expiración visible
- UI premium en login con estado de seguridad
- flujo de autenticación más claro para usuarios administrativos
- manejo de respuesta del backend más consistente
- base preparada para automatización y crecimiento del proyecto

## 14. Estado actual del proyecto

El proyecto está operativo en entorno local, con un sistema de autenticación y administración funcional, seguridad base apropiada para un proyecto académico/empresarial y documentación lista para entrega.

## 15. Siguiente nivel recomendado

Para convertirlo en una entrega aún más robusta, se recomienda:

1. añadir pruebas de API REST
2. mejorar roles y permisos por módulo
3. agregar dashboard más avanzado con gráficos y métricas reales
4. implementar carga de imágenes y gestión de archivos más profesional
5. configurar despliegue real con CI/CD

## 16. Documentación académica

- [Arquitectura](docs/arquitectura.md)
- [Manual de instalación](docs/manual-instalacion.md)
- [Manual de usuario](docs/manual-usuario.md)
- [Pruebas](docs/pruebas.md)
- [Despliegue](docs/despliegue.md)
- [Mercado Libre](docs/mercado-libre.md)
- [Flujo Git](docs/git-workflow.md)
- [Evidencias](docs/evidencias.md)
- [Matriz de requisitos](docs/matriz-requisitos.md)
- [Plantilla de Pull Request](docs/pull-request-template-dyc.md)

## 17. Conclusión

La aplicación está preparada para demostrar desarrollo web integral, administración de datos, seguridad base, Docker y operación DYC. Los puntos que requieren evidencia externa o configuración real se mantienen marcados como pendientes en la documentación.
