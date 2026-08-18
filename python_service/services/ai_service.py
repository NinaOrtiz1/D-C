import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

AI_PROVIDER = os.getenv("AI_PROVIDER", "openai")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class AIService:
    def __init__(self, provider: str | None = None, api_key: str | None = None, model: str | None = None):
        self.provider = (provider or AI_PROVIDER).lower()
        self.api_key = api_key or OPENAI_API_KEY
        self.model = model or OPENAI_MODEL
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def build_fallback_response(self, question: str, context: str) -> str:
        lower = question.lower().strip()

        if not lower or any(token in lower for token in ["hola", "buenas", "buenos", "saludos", "como estas", "qué tal", "quien eres", "quién eres", "que haces", "ayuda", "gracias", "adios", "bye"]):
            if any(token in lower for token in ["hola", "buenas", "buenos", "saludos", "qué tal", "quien eres", "quién eres", "que haces", "ayuda"]):
                return "¡Hola! 👋 Soy el asistente virtual de DYC. Puedo ayudarte con cotizaciones, servicios, tiempos de entrega y más. ¿Qué necesitas hoy?"
            if any(token in lower for token in ["gracias", "thank you"]):
                return "¡Con gusto! Estoy aquí para ayudarte con tus proyectos en DYC."
            if any(token in lower for token in ["adios", "bye", "hasta luego"]):
                return "¡Hasta luego! Si necesitas más ayuda con tu proyecto, aquí estoy."
            return "¡Hola! 👋 Soy el asistente virtual de DYC y puedo orientarte en cotizaciones, personalización y servicios."

        if context and "No se encontró" not in context and "No hay contexto" not in context:
            return (
                "Claro. Con la información disponible en DYC, te puedo responder de forma útil y honesta: "
                f"{context[:700]}"
            )

        if any(token in lower for token in ["precio", "cuesta", "cotiz", "vaso", "personaliz", "proyecto"]):
            return (
                "Podemos cotizar productos personalizados según el tipo de artículo, la cantidad y el nivel de detalle del diseño. "
                "Si compartes una referencia o nos comentas la idea general, te orientamos con una propuesta más precisa."
            )

        if any(token in lower for token in ["tarda", "entrega", "tiempo", "envio", "envío", "plazo"]):
            return (
                "Los tiempos de entrega dependen del tipo de producto y la cantidad solicitada. "
                "En pedidos estándar suele estar entre 2 y 5 días hábiles; en volumen se confirma según el proyecto."
            )

        if any(token in lower for token in ["pago", "tarjeta", "transferencia", "anticipo"]):
            return (
                "La forma de pago se revisa según el pedido; en compras de mayor volumen normalmente se solicita un anticipo. "
                "Si quieres, te orientamos con la opción más conveniente para tu caso."
            )

        if any(token in lower for token in ["servicio", "servicios", "grabado", "láser", "laser", "impresion", "3d", "diseño", "diseno"]):
            return (
                "En DYC trabajamos con personalización, grabado láser, impresión 3D y diseño a medida. "
                "Si me compartes el tipo de producto o proyecto, te puedo orientar mejor."
            )

        return (
            "Gracias por escribir. Podemos ayudarte con cotizaciones, tiempos de entrega, materiales y proyectos personalizados. "
            "Si compartes más detalles del producto o el proyecto, te respondemos con más precisión."
        )

    def generate_response(self, question: str, context: str) -> str:
        if self.provider != "openai" or not self.client:
            return self.build_fallback_response(question, context)

        try:
            system_prompt = (
                "Eres el asistente virtual de DYC. Responde en español, con tono natural, cercano y profesional. "
                "Mantén respuestas breves y útiles para preguntas simples, pero puedes ser más detallado cuando el usuario necesita ayuda con un proyecto o cotización. "
                "No inventes información ni prometas datos que no tengas. Usa el contexto de MongoDB solo cuando sea relevante; si no hay contexto suficiente, responde con honestidad y pide más detalles. "
                "Para saludos, presentaciones, agradecimientos o despedidas, responde con un saludo natural y breve."
            )

            result = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Pregunta del usuario: {question}\n\nContexto relevante: {context}"},
                ],
                temperature=0.3,
                max_tokens=400,
            )

            answer = result.choices[0].message.content
            if answer and answer.strip():
                return answer.strip()
        except Exception:
            pass

        return self.build_fallback_response(question, context)
