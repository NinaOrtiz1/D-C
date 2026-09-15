# Mercado Libre

## Estado

🟡 **MERCADO LIBRE — PREPARADO, PENDIENTE DE CREDENCIALES/OAUTH**

El backend contiene `server/services/mercadoLibreService.ts` y el endpoint protegido `GET /api/mercadolibre/status`. Sin credenciales reales el sistema informa que Mercado Libre no está conectado y no inventa productos, pedidos ni sincronizaciones.

## Variables backend-only

- `MERCADOLIBRE_CLIENT_ID`
- `MERCADOLIBRE_CLIENT_SECRET`
- `MERCADOLIBRE_REDIRECT_URI`
- `MERCADOLIBRE_ACCESS_TOKEN`
- `MERCADOLIBRE_REFRESH_TOKEN`

No deben usar prefijo `VITE_`, no deben enviarse al navegador y no deben aparecer en logs.

## Flujo OAuth previsto

1. El administrador inicia la conexión desde una ruta backend protegida.
2. Express genera la URL de autorización usando el client ID y redirect URI.
3. Mercado Libre devuelve un código al callback backend.
4. Express intercambia el código por access token y refresh token usando el client secret únicamente en servidor.
5. Los tokens se almacenan en un gestor de secretos o almacenamiento backend cifrado, nunca en `localStorage`.
6. Antes de caducar, el backend utiliza el refresh token para obtener un access token nuevo.
7. Las llamadas a Mercado Libre se encapsulan en un servicio backend con timeouts, validación de respuestas y manejo de errores.

## Relación con DYC

- Productos de Mercado Libre se relacionarán con `Product` mediante un identificador externo que deberá añadirse cuando se implemente la sincronización real.
- Pedidos externos usarán `Order.origen = MERCADO_LIBRE`.
- Las entradas y salidas de inventario se registrarán mediante `InventoryMovement`.
- El dashboard podrá mostrar estado de conexión y métricas sincronizadas solo después de una integración real.

## Pendiente

No se implementó OAuth ni llamadas reales porque no hay credenciales configuradas. No se simula una conexión exitosa.
