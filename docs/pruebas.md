# Pruebas y evidencias

## Tests automatizados

Comandos ejecutados:

```bash
npx tsc -p tsconfig.json --noEmit
npm test
npm run build
npm run lint
```

Resultado actual comprobado:

- `npm ci`: no completó en este Windows porque un binario nativo de Tailwind dentro de `node_modules` estaba bloqueado (`EPERM` al eliminarlo). El lockfile no se aceptó ni se actualizó por este intento. El workflow de GitHub ejecutará `npm ci` en Ubuntu.

No se agregaron tests de integración MongoDB para evitar tocar datos reales.

## Validación manual comprobada

- Home público: HTTP 200.
- Dashboard sin sesión: HTTP 401.
- Login administrativo sin PIN: HTTP 403.
- PIN correcto: HTTP 200 y cookie `admin_pin_access` presente.
- Login admin con PIN: HTTP 200 y cookie `auth_token` presente.
- `/auth/me`: HTTP 200.
- Logout: HTTP 200.
- Dashboard después de logout: HTTP 401.

## Validaciones pendientes

No se ejecutaron manualmente en esta fase:

- Contraseña incorrecta.
- Usuario inexistente.
- Usuario inactivo.
- JWT expirado o manipulado.
- Cliente contra cada endpoint administrativo.
- Editor contra cada combinación de permisos.
- Flujo OAuth real de Mercado Libre.
- Capturas visuales automatizadas en todas las resoluciones.

## Docker

También se comprobó:

```bash
docker compose config
docker compose build
docker compose ps
git diff --check
```

Las tres imágenes Docker construyeron correctamente y los servicios activos estaban saludables.
