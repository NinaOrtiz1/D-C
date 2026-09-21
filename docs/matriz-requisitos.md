# Matriz final de requisitos

| Requisito | Estado | Evidencia | Pendiente |
|---|---|---|---|
| Diagrama de arquitectura | ✅ COMPLETO | [arquitectura.md](arquitectura.md) contiene Mermaid basado en el código real | Captura E19 |
| Justificación de arquitectura | ✅ COMPLETO | [arquitectura.md](arquitectura.md) | Ninguno documental |
| Justificación de framework | ✅ COMPLETO | [arquitectura.md](arquitectura.md) | Ninguno documental |
| Patrones utilizados | ✅ COMPLETO | Componentes, middleware, controllers, services y modelos documentados | Capturas opcionales |
| Frontend | ✅ COMPLETO | React, Vite, TypeScript y rutas en `src/` | Evidencia visual E01-E11 |
| Backend | ✅ COMPLETO | Express, controladores, middleware y rutas en `server/` | Evidencia de despliegue |
| Base de datos | ✅ COMPLETO | MongoDB Atlas mediante Mongoose | Captura Atlas sin secretos |
| API REST propia | ✅ COMPLETO | `/api/auth`, `/api/products`, `/api/orders`, dashboard e inventario | Tests API más amplios |
| API/servicio externo | 🟡 PARCIAL | FastAPI/IA integrado; Mercado Libre preparado | OAuth real |
| Historial Git | ✅ COMPROBADO LOCALMENTE | `git log` local comprobado; no se reescribió el historial | Captura E16 |
| Ramas Git | ✅ COMPROBADO LOCALMENTE | Rama de trabajo, `main` y `origin/main` comprobadas | Captura E16 |
| Pull Request | 🔴 PENDIENTE | No existe evidencia de PR asociado | Crear PR real hacia `main` |
| README | ✅ COMPLETO | README actualizado y enlaza documentación | Revisar nombres de integrantes |
| Autenticación | ✅ COMPLETO | PIN, JWT, cookies y `/auth/me` comprobados parcialmente | Casos negativos adicionales |
| Autorización | ✅ COMPLETO | Middleware de roles admin/editor/cliente | Pruebas exhaustivas por rol |
| Contraseñas protegidas | ✅ COMPLETO | bcrypt en `server/auth.ts` | Prueba adicional de login negativo |
| Validación de datos | ✅ COMPLETO | Mongoose y validaciones de productos/inventario | Ampliar tests de API |
| Variables sensibles | ✅ COMPLETO | `.env` y `cookie.txt` ignorados; secretos backend-only | Auditoría automatizada de secretos |
| HTTPS | 🟡 PARCIAL | Cookies `Secure` en producción y documentación TLS | Dominio HTTPS real |
| Dockerfile | ✅ COMPLETO | Backend, frontend y Python | Ninguno |
| Docker Compose | ✅ COMPLETO | Tres servicios, red, puertos y healthchecks | Captura E14 |
| Ejecución desde otra PC | 🟡 PARCIAL | Manual de instalación y Compose | Probar en otra máquina |
| TypeScript | 🟡 PREPARADO | Script de comprobación definido en CI; ejecución local bloqueada al no quedar dependencias instaladas | Ejecutar `npx tsc -p tsconfig.json --noEmit` |
| Tests | 🟡 PREPARADO | Script `npm test` configurado; la ejecución de esta auditoría quedó bloqueada por `npm ci`/EPERM en Windows | Ejecutar con dependencias instaladas y capturar resultado |
| Build | 🟡 PREPARADO | Script `npm run build` definido en CI; ejecución local bloqueada al no quedar dependencias instaladas | Ejecutar build y capturar resultado |
| Evidencia de pruebas | 🟡 PREPARADO | [pruebas.md](pruebas.md) y lista de capturas | Tomar capturas de resultados reales |
| CI/CD | 🟡 PREPARADO | `.github/workflows/ci.yml` configurado para `push` y `pull_request` | Falta ejecución real en GitHub Actions |
| Aplicación desplegada | 🔴 PENDIENTE | No se comprobó producción activa | Evidencia de plataforma |
| Vercel | 🟡 PARCIAL | `vercel.json` y `api/index.ts` existentes | Confirmar deployment y dominio |
| Manual de instalación | ✅ COMPLETO | [manual-instalacion.md](manual-instalacion.md) | Probar por otra persona |
| Manual de usuario | ✅ COMPLETO | [manual-usuario.md](manual-usuario.md) | Capturas |
| Documentación de despliegue | ✅ COMPLETO | [despliegue.md](despliegue.md) | Completar datos reales de plataforma |
| Mercado Libre | 🟡 PARCIAL | Estado backend-only y OAuth documentados | Credenciales/OAuth reales |
| Productos | ✅ COMPLETO | Product, SKU, precio, stock, mínimo y disponibilidad | Pruebas API adicionales |
| Inventario | ✅ COMPLETO | InventoryMovement, entrada/salida/ajuste y rollback | Pruebas de concurrencia |
| Pedidos | ✅ COMPLETO | Order, origen, estados y movimientos asociados | Número legible de pedido |
| Diseño premium | ✅ COMPLETO | Tokens, componentes, dashboard y páginas refinadas | Capturas responsive |
| Performance | 🟡 PARCIAL | Bundle medido alrededor de 1.67 MB | Code splitting futuro |
