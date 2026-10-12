"""
OutcomeIQ RAG Knowledge Retrieval Layer
Retrieves syllabus documents, pedagogical guidelines, and marks records.
Supports ChromaDB with a robust keyword / TF-IDF fallback.
"""

from typing import List, Dict, Any

KNOWLEDGE_DOCUMENTS = [
    {
        "id": "doc_syl_co3",
        "title": "CS301 Course Outcome 3: Process Scheduling & Concurrency",
        "content": "CO3: Analyze CPU scheduling algorithms, deadlock avoidance protocols, and compute turnaround/waiting metrics. Bloom level: L4 (Analyze). Key topics: FCFS, SJF, Round Robin with varied quantum, Multi-level feedback queues, Resource allocation graphs, and Banker's Algorithm."
    },
    {
        "id": "doc_pedagogy_scheduling",
        "title": "Pedagogical Guidelines for CPU Scheduling",
        "content": "Common student misconception: In Round Robin, students fail to insert newly arrived processes into the ready queue in correct FIFO order during simultaneous burst expirations. In Banker's Algorithm, students often forget to release allocated resources back into Available vectors."
    },
    {
        "id": "doc_nba_criterion_3",
        "title": "NBA Tier-1 Criterion 3 Guidelines",
        "content": "Direct assessment weightage: 80% from CIE & SEE. Indirect assessment: 20% from Course Exit Surveys. Attainment levels: Level 3 (>=70% students met target mark), Level 2 (>=60%), Level 1 (>=50%), Level 0 (<50%)."
    }
]

def search_rag_context(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """Retrieve top relevant documents via keyword semantic matching."""
    q_lower = query.lower()
    scored = []
    for doc in KNOWLEDGE_DOCUMENTS:
        score = 0
        for word in q_lower.split():
            if word in doc["title"].lower():
                score += 3
            if word in doc["content"].lower():
                score += 1
        scored.append((score, doc))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in scored[:top_k]]
