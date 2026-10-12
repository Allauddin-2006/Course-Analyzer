"""
OutcomeIQ LLM Client
Connects to local OpenAI-compatible endpoints (Ollama / LM Studio)
with automatic fallback to a rule-based expert engine if unavailable.
"""

import requests
from typing import Dict, Any, Optional
from config import (
    LLM_PROVIDER,
    OLLAMA_BASE_URL,
    LM_STUDIO_BASE_URL,
    OLLAMA_MODEL,
    LM_STUDIO_MODEL,
    LLM_TEMPERATURE,
    LLM_REQUEST_TIMEOUT
)

def query_local_llm(system_prompt: str, user_prompt: str) -> Optional[str]:
    """Query Ollama or LM Studio OpenAI-compatible endpoint."""
    base_url = OLLAMA_BASE_URL if LLM_PROVIDER == 'ollama' else LM_STUDIO_BASE_URL
    model_name = OLLAMA_MODEL if LLM_PROVIDER == 'ollama' else LM_STUDIO_MODEL

    url = f"{base_url.rstrip('/')}/chat/completions"
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": LLM_TEMPERATURE
    }

    try:
        response = requests.post(url, json=payload, timeout=LLM_REQUEST_TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception:
        # Graceful fallback on network timeout or service down
        return None

    return None
