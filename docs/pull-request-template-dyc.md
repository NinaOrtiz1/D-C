# DYC Innovación — Cierre académico, CI/CD y documentación

## Objetivo

Cerrar los requisitos académicos relacionados con GitHub, CI/CD, documentación y pruebas.

## Cambios

- Workflow CI para `push` y `pull_request`.
- Documentación de arquitectura.
- Matriz de requisitos.
- Manual de instalación.
- Manual de usuario.
- Documentación de pruebas.
- Documentación de despliegue.
- Documentación de Mercado Libre.
- Flujo Git y evidencias.

## Pruebas

- TypeScript.
- `npm test`.
- `npm run build`.
- `docker compose config`.
- `git diff --check`.

## Seguridad

- No se incluyen secretos.
- Las variables sensibles permanecen en el entorno.
- No se modificó MongoDB.
- No se ejecutó el seed.
- No se modificó autenticación, JWT, bcrypt, PIN ni cookies.

## Pendientes

- Ejecución real de GitHub Actions.
- Deployment real de Vercel.
- Pull Request real.
- OAuth de Mercado Libre.
- Lint global si continúa pendiente por CRLF/Prettier.
- Resolver el bloqueo local de `npm ci` si persiste el bloqueo EPERM de Windows.

## Checklist

- [ ] CI ejecutado en GitHub.
- [ ] Tests pasan.
- [ ] Build pasa.
- [ ] PR creado.
- [ ] Revisión realizada.
- [ ] Merge autorizado.
