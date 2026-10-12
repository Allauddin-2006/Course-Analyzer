"""
OutcomeIQ Analytics Module
Calculates question difficulty, discrimination indices,
biometric correlation (Pearson r), and score distribution bins.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np
from core.db import query_df

def get_question_analytics(course_id: str = 'CS301') -> pd.DataFrame:
    """Compute difficulty, discrimination index, and pass rate for all questions."""
    q_df = query_df("""
        SELECT q.id as question_id, q.question_number, q.co_code, q.max_marks, q.bloom_level,
               a.type as assessment_type, a.name as assessment_name
        FROM questions q
        JOIN assessments a ON q.assessment_id = a.id
        WHERE a.course_id = ?;
    """, (course_id,))

    marks_df = query_df("""
        SELECT sm.student_id, sm.question_id, sm.marks_obtained
        FROM student_marks sm
        JOIN questions q ON sm.question_id = q.id
        JOIN assessments a ON q.assessment_id = a.id
        WHERE a.course_id = ?;
    """, (course_id,))

    # Compute total score per student to rank top 27% and bottom 27%
    st_totals = marks_df.groupby('student_id')['marks_obtained'].sum().reset_index()
    st_totals = st_totals.sort_values(by='marks_obtained', ascending=False)
    n = len(st_totals)
    top_n = max(1, int(n * 0.27))

    top_students = set(st_totals.head(top_n)['student_id'])
    bot_students = set(st_totals.tail(top_n)['student_id'])

    records = []
    for _, q in q_df.iterrows():
        qid = q['question_id']
        q_marks = marks_df[marks_df['question_id'] == qid]
        max_m = q['max_marks']

        mean_score = q_marks['marks_obtained'].mean()
        avg_pct = round((mean_score / max_m) * 100.0, 1)

        pass_rate = round(((q_marks['marks_obtained'] >= (max_m * 0.60)).sum() / len(q_marks)) * 100.0, 1)

        # Discrimination Index D = (Mean_top - Mean_bot) / max_marks
        top_mean = q_marks[q_marks['student_id'].isin(top_students)]['marks_obtained'].mean()
        bot_mean = q_marks[q_marks['student_id'].isin(bot_students)]['marks_obtained'].mean()
        d_index = round(max(0.0, (top_mean - bot_mean) / max_m), 2)

        difficulty = 'Easy' if avg_pct >= 75.0 else ('Hard' if avg_pct < 50.0 else 'Moderate')

        records.append({
            'question_number': q['question_number'],
            'assessment_type': q['assessment_type'],
            'co_code': q['co_code'],
            'max_marks': max_m,
            'bloom_level': q['bloom_level'],
            'avg_score_pct': avg_pct,
            'pass_rate_pct': pass_rate,
            'difficulty': difficulty,
            'discrimination_index': d_index
        })

    return pd.DataFrame(records)

def get_attendance_correlation(course_id: str = 'CS301') -> Dict[str, Any]:
    """Calculate Pearson correlation between attendance % and total assessment marks."""
    df = query_df("""
        SELECT s.id, s.attendance_percent, SUM(sm.marks_obtained) as total_marks
        FROM students s
        JOIN student_marks sm ON s.id = sm.student_id
        WHERE s.course_id = ?
        GROUP BY s.id;
    """, (course_id,))

    r = float(df['attendance_percent'].corr(df['total_marks']))
    return {
        'pearson_r': round(r, 2),
        'sample_size': len(df),
        'correlation_strength': 'Strong Positive' if r >= 0.70 else 'Moderate'
    }
