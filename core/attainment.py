"""
OutcomeIQ Core Attainment Calculation Engine
Implements NBA Tier-1 & NAAC compliant algorithms:
- Target threshold checking on question marks
- Direct attainment level scoring (0, 1, 2, 3)
- Indirect exit survey integration & combined weighting
- Program Outcome matrix projection
"""

from typing import Dict, List, Any, Tuple
import pandas as pd
import numpy as np
from core.db import query_df
from config import (
    DEFAULT_TARGET_THRESHOLD_PCT,
    DEFAULT_LEVEL3_PCT,
    DEFAULT_LEVEL2_PCT,
    DEFAULT_LEVEL1_PCT,
    DEFAULT_DIRECT_WEIGHT,
    DEFAULT_INDIRECT_WEIGHT
)

def compute_course_co_attainment(
    course_id: str = 'CS301',
    target_threshold_pct: float = DEFAULT_TARGET_THRESHOLD_PCT,
    level3_pct: float = DEFAULT_LEVEL3_PCT,
    level2_pct: float = DEFAULT_LEVEL2_PCT,
    level1_pct: float = DEFAULT_LEVEL1_PCT,
    direct_weight: float = DEFAULT_DIRECT_WEIGHT,
    indirect_weight: float = DEFAULT_INDIRECT_WEIGHT
) -> pd.DataFrame:
    """Compute complete CO attainment metrics for all outcomes in a course."""
    cos_df = query_df("SELECT * FROM course_outcomes WHERE course_id = ? ORDER BY code ASC;", (course_id,))
    questions_df = query_df("""
        SELECT q.id as question_id, q.question_number, q.co_code, q.max_marks, q.bloom_level, a.type as assessment_type
        FROM questions q
        JOIN assessments a ON q.assessment_id = a.id
        WHERE a.course_id = ?;
    """, (course_id,))

    marks_df = query_df("""
        SELECT sm.student_id, sm.question_id, sm.marks_obtained, q.co_code, q.max_marks
        FROM student_marks sm
        JOIN questions q ON sm.question_id = q.id
        JOIN assessments a ON q.assessment_id = a.id
        WHERE a.course_id = ?;
    """, (course_id,))

    surveys_df = query_df("""
        SELECT s.student_id, s.co_code, s.rating
        FROM surveys s
        JOIN students st ON s.student_id = st.id
        WHERE st.course_id = ?;
    """, (course_id,))

    students_count = query_df("SELECT COUNT(*) as cnt FROM students WHERE course_id = ?;", (course_id,)).iloc[0]['cnt']

    results = []

    for _, co in cos_df.iterrows():
        co_code = co['code']
        co_marks = marks_df[marks_df['co_code'] == co_code]

        # Calculate per-student total marks earned vs max marks for this CO
        student_co_totals = co_marks.groupby('student_id').agg(
            total_earned=('marks_obtained', 'sum'),
            total_max=('max_marks', 'sum')
        ).reset_index()

        student_co_totals['pct_earned'] = (student_co_totals['total_earned'] / student_co_totals['total_max']) * 100.0
        students_meeting_target = (student_co_totals['pct_earned'] >= target_threshold_pct).sum()

        pct_met = (students_meeting_target / max(1, students_count)) * 100.0

        # Direct Level
        if pct_met >= level3_pct:
            direct_level = 3
        elif pct_met >= level2_pct:
            direct_level = 2
        elif pct_met >= level1_pct:
            direct_level = 1
        else:
            direct_level = 0

        # Indirect Level from surveys (1 to 5 scale converted to 0 to 3 scale)
        co_surv = surveys_df[surveys_df['co_code'] == co_code]
        avg_survey = co_surv['rating'].mean() if len(co_surv) > 0 else 3.5
        indirect_level = round((avg_survey / 5.0) * 3.0, 2)

        # Combined Attainment Score
        combined_score = round((direct_level * direct_weight) + (indirect_level * indirect_weight), 2)

        status = 'Met' if combined_score >= 2.0 else ('Marginal' if combined_score >= 1.6 else 'Not Met')

        results.append({
            'co_code': co_code,
            'description': co['description'],
            'bloom_level': co['bloom_level'],
            'students_met': int(students_meeting_target),
            'total_students': int(students_count),
            'percentage_met': round(pct_met, 1),
            'direct_level': direct_level,
            'indirect_rating': round(avg_survey, 2),
            'indirect_level': indirect_level,
            'combined_score': combined_score,
            'status': status
        })

    return pd.DataFrame(results)

def compute_po_attainment(course_id: str, co_attainment_df: pd.DataFrame) -> pd.DataFrame:
    """Compute PO attainments by multiplying CO attainments through the mapping matrix."""
    pos_df = query_df("SELECT * FROM program_outcomes ORDER BY code ASC;")
    mappings_df = query_df("SELECT * FROM co_po_mapping WHERE course_id = ? AND weight > 0;", (course_id,))

    results = []

    for _, po in pos_df.iterrows():
        po_code = po['code']
        po_maps = mappings_df[mappings_df['po_code'] == po_code]

        if len(po_maps) == 0:
            results.append({
                'po_code': po_code,
                'title': po['title'],
                'description': po['description'],
                'achieved_score': 0.0,
                'pct_attained': 0.0,
                'status': 'Not Mapped'
            })
            continue

        weighted_sum = 0.0
        total_weight = 0

        for _, m in po_maps.iterrows():
            co_c = m['co_code']
            w = m['weight']
            co_row = co_attainment_df[co_attainment_df['co_code'] == co_c]
            if len(co_row) > 0:
                score = co_row.iloc[0]['combined_score']
                weighted_sum += (score * w)
                total_weight += w

        achieved = round(weighted_sum / total_weight, 2) if total_weight > 0 else 0.0
        pct = round((achieved / 3.0) * 100.0, 1)

        status = 'Attained' if achieved >= 2.0 else ('Near Target' if achieved >= 1.6 else 'Lagging')

        results.append({
            'po_code': po_code,
            'title': po['title'],
            'description': po['description'],
            'achieved_score': achieved,
            'pct_attained': pct,
            'status': status
        })

    return pd.DataFrame(results)
