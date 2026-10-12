"""
OutcomeIQ Configuration Module
Centralized settings for database, LLM backends (Ollama/LM Studio),
ChromaDB/FAISS vector stores, and default NBA/NAAC attainment parameters.
"""

import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DB_PATH = DATA_DIR / "outcomeiq.db"
CHROMA_PERSIST_DIR = DATA_DIR / "chroma_db"

# LLM Backend Settings (Ollama / LM Studio OpenAI-compatible endpoints)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama")  # 'ollama', 'lm_studio', or 'fallback'
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
LM_STUDIO_BASE_URL = os.getenv("LM_STUDIO_BASE_URL", "http://localhost:1234/v1")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:8b")
LM_STUDIO_MODEL = os.getenv("LM_STUDIO_MODEL", "local-model")
LLM_TEMPERATURE = 0.2
LLM_REQUEST_TIMEOUT = 10  # seconds

# Attainment Defaults (NBA Tier-1 / NAAC Standards)
DEFAULT_TARGET_THRESHOLD_PCT = 60.0  # % of max marks required on question to meet target
DEFAULT_LEVEL3_PCT = 70.0  # >= 70% students met target => Level 3
DEFAULT_LEVEL2_PCT = 60.0  # >= 60% students met target => Level 2
DEFAULT_LEVEL1_PCT = 50.0  # >= 50% students met target => Level 1
DEFAULT_DIRECT_WEIGHT = 0.80  # 80% CIE + SEE
DEFAULT_INDIRECT_WEIGHT = 0.20  # 20% Course Exit Survey

# Random Seed for Reproducible Data Generation
RANDOM_SEED = 42
