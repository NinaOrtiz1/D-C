# Manual de usuario

## Sitio público

- **Inicio:** presenta DYC Innovación y sus llamados a cotizar.
- **Productos:** muestra el catálogo disponible.
- **Servicios:** describe personalización, grabado láser e impresión 3D.
- **Galería:** permite filtrar y ampliar imágenes.
- **Contacto:** envía una solicitud de información.
- **Chatbot:** responde mediante Express y el servicio FastAPI cuando están disponibles.

## Acceso administrativo

1. En el footer, localiza `Hecho con precisión en Durango, México.`
2. Haz doble clic o doble tap.
3. Introduce el PIN administrativo configurado en el entorno.
4. El backend valida el PIN y establece una cookie HttpOnly temporal.
5. En el login introduce las credenciales administrativas configuradas por el responsable del sistema.

No se documentan contraseñas reales.

## Dashboard

El dashboard permite consultar usuarios, productos, categorías, pedidos, mensajes, métricas, stock y actividad.

## Productos

El administrador o editor puede crear y editar productos, precio, descripción, categoría, imágenes, SKU, stock mínimo y disponibilidad. La activación y desactivación se realiza sin borrar el registro.

## Inventario

En la sección Inventario se registran entradas, salidas y ajustes indicando cantidad y motivo. El sistema conserva usuario, fecha, stock anterior, stock posterior y pedido relacionado cuando corresponde.

## Pedidos

Los pedidos muestran cliente, productos, cantidades, total, origen y estado. Los estados incluyen pendiente, confirmado, preparación, producción, listo, enviado, entregado y cancelado según el flujo configurado.

## Cierre de sesión

Usa `Cerrar sesión`. Se eliminan las credenciales locales de sesión y se solicita el cierre al backend. Las rutas protegidas deben responder como no autorizadas después del logout.
