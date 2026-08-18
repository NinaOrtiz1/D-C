# Chatbot IA con Python y MongoDB

## Flujo actual

React/Chatbox -> Express -> Python -> MongoDB -> Python -> IA -> Python -> Express -> Chatbox

## Archivos principales

### Frontend
- `src/components/site/ChatWidget.tsx` : widget visual del chat, mantiene el diseño actual y envía mensajes al backend.

### Backend Express
- `server/routes/api.ts` : añade el endpoint `POST /api/chat` que reenvía la solicitud al servicio Python y maneja fallback.
- `server/index.ts` : servidor Express principal.
- `server/database.ts` : conexión existente con MongoDB Atlas.
- `server/models.ts` : modelos Mongoose reutilizados como `Product`, `Category`, `News`, `FAQ`, `SiteConfig`, etc.

### Python IA
- `python_service/app.py` : API FastAPI con `POST /chat`.
- `python_service/services/mongo_service.py` : consulta MongoDB para obtener contexto relevante.
- `python_service/services/ai_service.py` : integración con OpenAI y fallback local.
- `python_service/requirements.txt` : dependencias Python.

## Cómo funciona

1. El usuario escribe en el ChatWidget.
2. El frontend hace `POST /api/chat` al backend Express.
3. Express valida la entrada y llama al servicio Python en `http://localhost:8001/chat`.
4. Python consulta MongoDB para obtener contexto útil según la pregunta.
5. Python envía la pregunta + contexto al modelo externo configurado con `OPENAI_API_KEY`.
6. La respuesta regresa a Express.
7. Express la devuelve al frontend y el widget la muestra sin romper el diseño.

## Variables de entorno

En el archivo `.env` del proyecto se necesitan:

- `MONGODB_URI`
- `PORT`
- `VITE_API_URL`
- `PYTHON_CHAT_SERVICE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `AI_PROVIDER`

Nunca se expone la API key al frontend.

## Dependencias de Python

```bash
cd python_service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Ejecutar Python

```bash
cd python_service
python app.py
```

O con uvicorn:

```bash
cd python_service
uvicorn app:app --host 0.0.0.0 --port 8001
```

## Ejecutar Express + React

```bash
npm run dev
```

Esto arranca:
- Express en `http://localhost:4000`
- Vite en `http://localhost:8080`

## Probar el endpoint

### Python directo
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué diseños puedo crear para una cafetería?"}'
```

### Express integrado
```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué diseños puedo crear para una cafetería?"}'
```

## Qué pasa si Python falla

Si el servicio de Python no responde, Express devuelve un mensaje amigable al frontend y no rompe la aplicación. El error se registra en el backend y el resto del sitio sigue funcionando.
