# Manual de instalación

## Requisitos

- Node.js 20 o superior
- npm
- Git
- Docker Desktop y Docker Compose para ejecución containerizada
- MongoDB Atlas o una instancia MongoDB accesible
- Python 3.12 si se ejecuta FastAPI fuera de Docker

## Instalación local

```bash
git clone <URL_DEL_REPOSITORIO>
cd D-C
npm ci
```

Copia `.env.example` a `.env` y completa las variables en tu entorno. Nunca subas `.env` al repositorio.

Variables mínimas del backend:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_PIN`
- `SEED_ADMIN_PASSWORD`
- `SEED_EDITOR_PASSWORD`
- `SEED_CLIENT_PASSWORD`
- `CLIENT_URL`
- `PYTHON_CHAT_SERVICE_URL`

Mercado Libre usa variables backend-only documentadas en `.env.example`.

## Desarrollo normal

```bash
npm run dev
```

- Frontend Vite: `http://localhost:5173`
- API Express: `http://localhost:4000`
- FastAPI: `http://localhost:8001`

## Docker Compose

```bash
docker compose config
docker compose build
docker compose up
```

Los servicios son `frontend`, `backend` y `python-service`. La red es `dyc-network`.

## Pruebas y build

```bash
npx tsc -p tsconfig.json --noEmit
npm test
npm run build
```

## Producción

El frontend puede construirse para Vercel. El backend Express persistente y FastAPI deben desplegarse en servicios que soporten procesos backend, o adaptarse explícitamente a funciones serverless. MongoDB Atlas debe permitir la conexión desde las redes de producción.

En producción se debe usar HTTPS, `JWT_SECRET` fuerte, `ADMIN_PIN` definido fuera del código, CORS restringido al dominio real y cookies `Secure`.
