import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.ai_service import AIService
from services.mongo_service import MongoKnowledgeService

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(title="D&C Innovation Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_service = MongoKnowledgeService()
ai_service = AIService()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)


class ChatResponse(BaseModel):
    response: str


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    question = request.message.strip()
    if not question:
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío.")

    try:
        context = mongo_service.get_context_for_question(question)
        response = ai_service.generate_response(question, context)
        return ChatResponse(response=response)
    except Exception as exc:  # pragma: no cover - fallback robusto
        raise HTTPException(status_code=502, detail=f"El servicio de IA falló: {exc}") from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=False)
