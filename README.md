# OutcomeIQ: Course Outcome Achievement Analyser
> **AI-Enabled Outcome-Based Education (OBE) & NBA / NAAC Accreditation Analytics Platform**

OutcomeIQ replaces tedious, error-prone manual spreadsheets with a transparent, AI-powered attainment engine. It automates Course Outcome (CO) and Program Outcome (PO) calculations, identifies performance gaps down to individual exam questions, predicts at-risk students, recommends remedial interventions, and pairs peers using complementary vector matching.

---

## 🏛️ System Architecture & Vector Store Split
- **ChromaDB**: Used for document knowledge base indexing (Course Syllabus, Bloom's Taxonomy definitions, NBA Tier-1 guidelines, teaching guides, and remedial lecture notes).
- **FAISS**: Used for high-speed dense vector similarity search (complementary Study Buddy pairing, question similarity matching, and skill vector projections).
- **SQLite**: Stores structured data (students, courses, assessments, question marks, biometric attendance logs, and survey ratings).
- **Dual AI Engine**: Connects to local OpenAI-compatible LLM backends (Ollama `llama3:8b` or LM Studio) with an automatic deterministic expert fallback so the platform **NEVER breaks offline**.
- **Computer Vision (OpenCV)**: Optical Mark Recognition (OMR) marksheet preprocessor executing grayscale conversion, Otsu adaptive thresholding, fiducial alignment, contour extraction, and bubble density extraction.

```
outcomeiq/
├── app/
│   └── main.py                     # Streamlit Multipage UI
├── core/
│   ├── db.py                       # SQLite schema & query helper
│   ├── seed_data.py                # Synthetic dataset generator (seed=42)
│   ├── attainment.py               # NBA CO & PO attainment calculation engine
│   ├── analytics.py                # Question difficulty, discrimination & Pearson r
│   └── ml.py                       # Predictive risk classifier & FAISS matcher
├── ai/
│   ├── prompts.py                  # System prompts with zero-hallucination guardrails
│   ├── llm_client.py               # Ollama / LM Studio client with fallback
│   ├── rag.py                      # ChromaDB syllabus & guideline RAG retriever
│   └── insights.py                 # Plain-English findings generator
├── cv/
│   └── omr.py                      # OpenCV marksheet preprocessing & simulation
├── data/
│   └── outcomeiq.db                # SQLite database file
├── config.py                       # Centralized thresholds & URLs
├── requirements.txt                # Python dependencies
└── README.md                       # Documentation
```

---

## 📐 Attainment Formulas (NBA Tier-1 / NAAC Standards)

### 1. Direct Course Outcome (CO) Attainment
For each assessment question mapped to $\text{CO}_i$, a student meets the target if:
$$\text{Score} \ge \text{Max Marks} \times \text{Target Threshold (default 60\%)}$$

- **Level 3:** $\ge 70\%$ of enrolled students meet the target score
- **Level 2:** $\ge 60\%$ and $< 70\%$ of enrolled students meet the target score
- **Level 1:** $\ge 50\%$ and $< 60\%$ of enrolled students meet the target score
- **Level 0:** $< 50\%$ of enrolled students meet the target score

### 2. Combined Course Outcome Attainment
$$\text{Combined CO}_i = (\text{Direct Level} \times 0.80) + (\text{Indirect Level} \times 0.20)$$
Where Indirect Level is the Course Exit Survey Likert rating ($1$ to $5$) scaled to the $0$ to $3$ range:
$$\text{Indirect Level} = \left(\frac{\text{Average Survey Rating}}{5.0}\right) \times 3.0$$

### 3. Program Outcome (PO) Attainment Matrix Projection
$$\text{PO}_j = \frac{\sum_i (\text{CO}_i \text{ Combined Score} \times \text{Mapping Weight}_{ij})}{\sum_i \text{Mapping Weight}_{ij}}$$

---

## 🚀 Quickstart & Setup

### Running with Streamlit (Python)
```bash
# 1. Clone repository & install dependencies
pip install -r requirements.txt

# 2. Seed database
python core/seed_data.py

# 3. Launch Streamlit Application
streamlit run app/main.py
```

### Running with Local LLM (Ollama or LM Studio)
1. **Ollama**:
   ```bash
   ollama run llama3:8b
   # Automatically listens at http://localhost:11434/v1
   ```
2. **LM Studio**:
   - Start LM Studio -> Local Inference Server -> Start Server at port 1234.
3. Configure `config.py` or export environment variables:
   ```bash
   export LLM_PROVIDER="ollama"
   export OLLAMA_BASE_URL="http://localhost:11434/v1"
   ```
*If no LLM is running, OutcomeIQ transparently falls back to its deterministic rule engine with zero downtime.*

---

## 🎬 2-Minute Hackathon Demo Script
1. **The Problem:** Prof. Rao opens Operating Systems (CS301). The CO Attainment dashboard immediately flags **CO3 (Process Scheduling & Concurrency)** in red, trailing at 48.3% pass rate (Attainment Level 1).
2. **AI Root-Cause Diagnosis:** She clicks **Generate AI Insights**. In plain English, the system reveals that 71.4% of the deficit originates from **Midterm Q7** (Round Robin calculation) and **Q9** (Banker's Algorithm safe sequence), compounded by a 16% attendance drop during weeks 5–7.
3. **Conversational Assistant:** Prof. Rao asks the RAG chatbot: *"Which students need help in CS301?"* The bot provides a cited, hallucination-free list of 9 at-risk students with specific suggested tutorial topics.
4. **Accreditation Dossier:** With one click, she generates the official **NBA Criterion 3 Accreditation Report** with complete tables, formulas, and continuous improvement action plans.
5. **Student Experience & Peer Comparison:** Switching to Student view, **Aarav Sharma** opens the **Peer Comparison** tab to plot his performance against the class **Top 25th Percentile benchmark** (P75 cutoff: 88.5%). He sees where he exceeds the top quartile (CO4 Virtual Memory at 91% vs 88%), where his largest deficit lies (CO3 at 44% vs 78%), and reviews what top performers did differently before activating his remedial study plan and pairing with **Priya Nair** via FAISS vector matching!
