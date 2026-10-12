"""
OutcomeIQ SQLite Database Layer
Schema definition and connection pooling for OBE student records,
assessments, questions, biometrics, and accreditation matrices.
"""

import sqlite3
from typing import Dict, Any, List
import pandas as pd
from config import DB_PATH

def get_connection() -> sqlite3.Connection:
    """Return an active connection to the SQLite database."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db() -> None:
    """Create all required tables if they do not exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        semester INTEGER NOT NULL,
        academic_year TEXT NOT NULL,
        faculty_name TEXT NOT NULL,
        department TEXT NOT NULL,
        credits INTEGER NOT NULL,
        syllabus_overview TEXT
    );

    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        usn TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        course_id TEXT NOT NULL,
        attendance_percent REAL NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS program_outcomes (
        code TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS course_outcomes (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT NOT NULL,
        bloom_level TEXT NOT NULL,
        target_threshold_pct REAL DEFAULT 60.0,
        FOREIGN KEY (course_id) REFERENCES courses(id),
        UNIQUE(course_id, code)
    );

    CREATE TABLE IF NOT EXISTS co_po_mapping (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id TEXT NOT NULL,
        co_code TEXT NOT NULL,
        po_code TEXT NOT NULL,
        weight INTEGER NOT NULL CHECK (weight IN (0, 1, 2, 3)),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (po_code) REFERENCES program_outcomes(code)
    );

    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        max_marks REAL NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        assessment_id TEXT NOT NULL,
        question_number TEXT NOT NULL,
        co_code TEXT NOT NULL,
        max_marks REAL NOT NULL,
        bloom_level TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id)
    );

    CREATE TABLE IF NOT EXISTS student_marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        marks_obtained REAL NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (question_id) REFERENCES questions(id),
        UNIQUE(student_id, question_id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        week_number INTEGER NOT NULL,
        attendance_percent REAL NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id),
        UNIQUE(student_id, week_number)
    );

    CREATE TABLE IF NOT EXISTS surveys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        co_code TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id),
        UNIQUE(student_id, co_code)
    );

    CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        skill_name TEXT NOT NULL,
        category TEXT NOT NULL,
        associated_co TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_roles (
        id TEXT PRIMARY KEY,
        role_title TEXT NOT NULL,
        company_types TEXT NOT NULL,
        required_skills TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

def query_df(query: str, params: tuple = ()) -> pd.DataFrame:
    """Execute SQL query and return a pandas DataFrame."""
    conn = get_connection()
    try:
        df = pd.read_sql_query(query, conn, params=params)
        return df
    finally:
        conn.close()
