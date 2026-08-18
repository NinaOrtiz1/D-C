import os
from typing import Any

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "aether"


class MongoKnowledgeService:
    def __init__(self, uri: str | None = None):
        self.uri = uri or MONGODB_URI
        self.client = MongoClient(self.uri, serverSelectionTimeoutMS=15000) if self.uri else None
        self.db = self.client[DB_NAME] if self.client is not None else None

    def _safe_text(self, value: Any) -> str:
        if value is None:
            return ""
        return str(value).strip()

    def _collection_snippet(self, collection_name: str, query: dict[str, Any], limit: int = 5) -> list[dict[str, Any]]:
        if self.db is None:
            return []

        try:
            collection = self.db[collection_name]
            docs = list(collection.find(query, {"_id": 0, "password": 0, "email": 0, "correo": 0}).limit(limit))
            return docs
        except PyMongoError:
            return []

    def get_context_for_question(self, question: str) -> str:
        if self.db is None:
            return "No hay contexto disponible de MongoDB en este momento."

        normalized = question.lower()
        context_parts: list[str] = []

        if any(token in normalized for token in ["vaso", "grabado", "láser", "laser", "personaliz", "impresion", "3d", "diseño", "diseño", "producto", "cotiz", "precio"]):
            product_docs = self._collection_snippet(
                "products",
                {"activo": True},
                limit=5,
            )
            if product_docs:
                context_parts.append(
                    "Productos disponibles: "
                    + "; ".join(
                        [
                            (
                                f"{doc.get('nombre') or doc.get('name') or 'Producto'}: "
                                f"{doc.get('descripcion') or doc.get('description') or 'Sin descripción'}; "
                                f"precio ${doc.get('precio') if doc.get('precio') is not None else doc.get('price') if doc.get('price') is not None else 'N/D'}"
                            )
                            for doc in product_docs[:5]
                        ]
                    )
                )

            category_docs = self._collection_snippet("categories", {"activo": True}, limit=5)
            if category_docs:
                context_parts.append(
                    "Categorías: "
                    + "; ".join(
                        [
                            f"{doc.get('nombre') or doc.get('name') or 'Categoría'}"
                            for doc in category_docs[:5]
                        ]
                    )
                )

        if any(token in normalized for token in ["pregunta", "faq", "servicio", "entrega", "pago", "tiempo", "envio", "envío", "confirm", "metodo"]):
            faq_docs = self._collection_snippet("faqs", {"activo": True}, limit=5)
            if faq_docs:
                context_parts.append(
                    "FAQ relevante: "
                    + "; ".join(
                        [
                            f"{doc.get('pregunta') or doc.get('question') or 'Pregunta'}: {doc.get('respuesta') or doc.get('answer') or 'Sin respuesta'}"
                            for doc in faq_docs[:5]
                        ]
                    )
                )

        if any(token in normalized for token in ["noticia", "blog", "novedad", "evento", "actualidad", "proyecto"]):
            news_docs = self._collection_snippet("news", {"activo": True}, limit=5)
            if news_docs:
                context_parts.append(
                    "Noticias recientes: "
                    + "; ".join(
                        [
                            f"{doc.get('titulo') or doc.get('title') or 'Noticia'}: {doc.get('contenido') or doc.get('content') or 'Sin contenido'}"
                            for doc in news_docs[:5]
                        ]
                    )
                )

        site_docs = self._collection_snippet("siteconfigs", {"activo": True}, limit=1)
        if site_docs:
            doc = site_docs[0]
            company = doc.get("nombreEmpresa") or doc.get("name") or "D&C Innovación"
            phone = doc.get("telefono") or doc.get("phone") or ""
            email = doc.get("correo") or doc.get("email") or ""
            context_parts.append(
                f"Información de la empresa: nombre={company}; teléfono={phone}; email={email}; "
                f"descripción={doc.get('descripcion') or doc.get('description') or ''}"
            )

        if not context_parts:
            return "No se encontró contexto específico en MongoDB para esta consulta."

        return " | ".join(context_parts)
