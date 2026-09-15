# Despliegue

## Estado comprobado

El repositorio contiene `vercel.json` y `api/index.ts`. Vercel puede invocar el handler serverless de Express y ese handler conecta con MongoDB Atlas. Esto no demuestra que exista un despliegue activo ni un dominio de producción comprobado.

## Vercel

Configuración existente:

- Build: `npm run build`
- Salida frontend: `dist`
- Rewrites para `/api/*` y `/health`
- Handler serverless: `api/index.ts`

Variables que deben configurarse en el proyecto de Vercel mediante secretos:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_PIN`
- `CLIENT_URL`
- Contraseñas de seed solo si el flujo de despliegue las necesita
- `OPENAI_API_KEY` solo en backend o servicio correspondiente

No se comprobó un dominio Vercel activo desde este worktree.

## Backend persistente y FastAPI

El backend local usa `server/index.ts` y FastAPI usa `python_service/app.py`. Docker Compose los ejecuta como procesos persistentes. Vercel no debe asumirse como sustituto automático de esos procesos: para producción completa puede requerirse Render, Railway, Azure u otra plataforma para Express y FastAPI, manteniendo Vercel para frontend si esa es la decisión del equipo.

## HTTPS

- Desarrollo: `http://localhost:5173`, `http://localhost:4000` y `http://localhost:8001`.
- Producción: HTTPS debe ser terminado por la plataforma cloud o proxy TLS.
- Las cookies usan `Secure` cuando `NODE_ENV=production`.
- CORS debe incluir únicamente el dominio frontend real.
- Los secretos permanecen en variables de entorno del backend.
