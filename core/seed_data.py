"""
OutcomeIQ Synthetic Data Generator
Generates realistic, reproducible OBE records (seed=42):
- 4 courses, 60 students per course, 5 COs each
- 12 NBA Program Outcomes & Articulation Matrices
- CIE & SEE assessments, questions mapped to COs with Bloom levels
- Question-level student marks and 12-week attendance logs
- Realistic patterns: CS301 CO3 bottleneck on Q7/Q9, weeks 5-7 attendance dip
"""

import random
import numpy as np
from core.db import get_connection, init_db
from config import RANDOM_SEED

FIRST_NAMES = [
    'Aarav', 'Aditi', 'Akash', 'Ananya', 'Aryan', 'Bhavna', 'Chetan', 'Deepika', 'Dev', 'Divya',
    'Gaurav', 'Harini', 'Ishaan', 'Janani', 'Karan', 'Kavya', 'Manish', 'Meera', 'Nikhil', 'Nisha',
    'Pranav', 'Priya', 'Rahul', 'Rhea', 'Rohan', 'Sakshi', 'Sameer', 'Shreya', 'Siddharth', 'Sneha',
    'Tanmay', 'Trisha', 'Utkarsh', 'Varun', 'Vidya', 'Vivek', 'Yash', 'Zoya', 'Abhishek', 'Archana',
    'Ashwin', 'Charu', 'Ganesh', 'Ira', 'Jay', 'Kirthi', 'Madhav', 'Nandini', 'Prateek', 'Ritu',
    'Sanjay', 'Shruti', 'Suraj', 'Tara', 'Tarun', 'Vani', 'Vikas', 'Vinay', 'Aishwarya', 'Karthik'
]

LAST_NAMES = [
    'Sharma', 'Verma', 'Patel', 'Rao', 'Iyer', 'Menon', 'Nair', 'Gupta', 'Singh', 'Deshmukh',
    'Kulkarni', 'Joshi', 'Bhat', 'Reddy', 'Choudhury', 'Sen', 'Banerjee', 'Mishra', 'Agarwal', 'Pillai'
]

def seed_database(force: bool = False) -> None:
    """Populate database with synthetic data if empty or forced."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM courses;")
    count = cursor.fetchone()[0]
    if count > 0 and not force:
        conn.close()
        return

    random.seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)

    # 1. Program Outcomes (PO1 to PO12)
    pos = [
        ('PO1', 'Engineering Knowledge', 'Apply mathematics, science, engineering fundamentals to solve complex problems.'),
        ('PO2', 'Problem Analysis', 'Identify, formulate, review literature, and analyze complex engineering problems.'),
        ('PO3', 'Design / Development', 'Design solutions for complex problems and system components with safety considerations.'),
        ('PO4', 'Conduct Investigations', 'Use research-based knowledge and methods including design of experiments and data synthesis.'),
        ('PO5', 'Modern Tool Usage', 'Create, select, and apply appropriate modern IT and engineering tools.'),
        ('PO6', 'The Engineer & Society', 'Apply contextual knowledge to assess societal, health, and legal issues.'),
        ('PO7', 'Environment & Sustainability', 'Understand impact of professional engineering solutions in environmental contexts.'),
        ('PO8', 'Ethics', 'Apply ethical principles and commit to professional ethics and norms.'),
        ('PO9', 'Individual & Team Work', 'Function effectively as an individual, and as member or leader in diverse teams.'),
        ('PO10', 'Communication', 'Communicate effectively on complex engineering activities with society.'),
        ('PO11', 'Project Management & Finance', 'Demonstrate knowledge of engineering and management principles for projects.'),
        ('PO12', 'Lifelong Learning', 'Recognize need for independent and lifelong learning in technology context.')
    ]
    cursor.executemany("INSERT OR REPLACE INTO program_outcomes VALUES (?, ?, ?);", pos)

    # 2. Courses
    courses = [
        ('CS301', 'CS301', 'Operating Systems', 5, '2025-2026 (Odd)', 'Prof. Ananya Rao', 'Computer Science & Engineering', 4,
         'Kernel architectures, process control, CPU scheduling algorithms, synchronization primitives, deadlocks, and virtual memory.'),
        ('CS401', 'CS401', 'Machine Learning & Neural Systems', 7, '2025-2026 (Odd)', 'Dr. Vikram Malhotra', 'Computer Science & Engineering', 4,
         'Supervised regression, classification, ensemble random forests, deep learning neural nets, and validation pipelines.'),
        ('CS302', 'CS302', 'Computer Networks', 5, '2025-2026 (Odd)', 'Prof. Rajesh Nair', 'Computer Science & Engineering', 4,
         'OSI and TCP/IP architectures, socket programming, routing algorithms (Dijkstra), and TCP congestion control.'),
        ('CS204', 'CS204', 'Java Programming & OOP', 3, '2025-2026 (Odd)', 'Dr. Sneha Patil', 'Computer Science & Engineering', 3,
         'OOP principles, polymorphism, exception handling, Java Collection Framework, multithreading, and GUI persistence.')
    ]
    cursor.executemany("INSERT OR REPLACE INTO courses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", courses)

    # 3. Course Outcomes
    cos_data = [
        # CS301
        ('co_cs301_1', 'CS301', 'CO1', 'Understand OS system architecture, dual-mode execution, and kernel system calls.', 'L2', 60.0),
        ('co_cs301_2', 'CS301', 'CO2', 'Apply multi-threading models, IPC mechanisms, and synchronization constructs to concurrent apps.', 'L3', 60.0),
        ('co_cs301_3', 'CS301', 'CO3', 'Analyze CPU scheduling algorithms, deadlock avoidance protocols, and compute turnaround metrics.', 'L4', 60.0),
        ('co_cs301_4', 'CS301', 'CO4', 'Apply virtual memory architectures, paging tables, page replacement policies, and thrashing controls.', 'L3', 60.0),
        ('co_cs301_5', 'CS301', 'CO5', 'Evaluate file system directory implementations, disk allocation strategies, and I/O buffer scheduling.', 'L2', 60.0),
        # CS401
        ('co_cs401_1', 'CS401', 'CO1', 'Formulate supervised and unsupervised learning problem statements mathematically.', 'L2', 60.0),
        ('co_cs401_2', 'CS401', 'CO2', 'Implement linear regression, logistic classification, and gradient descent optimization.', 'L3', 60.0),
        ('co_cs401_3', 'CS401', 'CO3', 'Construct ensemble decision trees, random forests, and boost algorithms.', 'L4', 60.0),
        ('co_cs401_4', 'CS401', 'CO4', 'Evaluate deep multi-layer perceptron neural networks with regularization and dropout.', 'L4', 60.0),
        ('co_cs401_5', 'CS401', 'CO5', 'Deploy end-to-end ML training pipelines with cross-validation and hyperparameter tuning.', 'L5', 60.0),
    ]
    cursor.executemany("INSERT OR REPLACE INTO course_outcomes VALUES (?, ?, ?, ?, ?, ?);", cos_data)

    # 4. CO-PO Mapping
    co_po_map = [
        # CS301
        ('CS301', 'CO1', 'PO1', 3), ('CS301', 'CO1', 'PO2', 2), ('CS301', 'CO1', 'PO12', 1),
        ('CS301', 'CO2', 'PO1', 2), ('CS301', 'CO2', 'PO2', 3), ('CS301', 'CO2', 'PO3', 3), ('CS301', 'CO2', 'PO5', 2),
        ('CS301', 'CO3', 'PO1', 3), ('CS301', 'CO3', 'PO2', 3), ('CS301', 'CO3', 'PO3', 2), ('CS301', 'CO3', 'PO4', 2), ('CS301', 'CO3', 'PO11', 1),
        ('CS301', 'CO4', 'PO1', 2), ('CS301', 'CO4', 'PO2', 3), ('CS301', 'CO4', 'PO3', 2), ('CS301', 'CO4', 'PO5', 2),
        ('CS301', 'CO5', 'PO1', 2), ('CS301', 'CO5', 'PO2', 2), ('CS301', 'CO5', 'PO3', 3), ('CS301', 'CO5', 'PO12', 2),
    ]
    cursor.executemany("INSERT INTO co_po_mapping (course_id, co_code, po_code, weight) VALUES (?, ?, ?, ?);", co_po_map)

    # 5. Assessments & Questions for CS301
    assessments = [
        ('as_cs301_quiz', 'CS301', 'Quiz 1', 'Quiz', 20.0),
        ('as_cs301_mid', 'CS301', 'Midterm Exam', 'Midterm', 60.0),
        ('as_cs301_asg', 'CS301', 'Assignment 1', 'Assignment', 30.0),
        ('as_cs301_lab', 'CS301', 'Lab Exam', 'Lab', 40.0),
        ('as_cs301_end', 'CS301', 'End-Semester Exam', 'EndSem', 70.0),
    ]
    cursor.executemany("INSERT OR REPLACE INTO assessments VALUES (?, ?, ?, ?, ?);", assessments)

    questions = [
        ('q_q1', 'as_cs301_quiz', 'Q1', 'CO1', 5.0, 'L2', 'Dual mode kernel vs user transition'),
        ('q_q2', 'as_cs301_quiz', 'Q2', 'CO1', 5.0, 'L2', 'System call fork() & exec() mechanics'),
        ('q_q3', 'as_cs301_quiz', 'Q3', 'CO2', 10.0, 'L3', 'POSIX pthread creation & join synchronization'),
        ('q_mid1', 'as_cs301_mid', 'Q4', 'CO1', 10.0, 'L2', 'Microkernel vs Monolithic OS design tradeoffs'),
        ('q_mid2', 'as_cs301_mid', 'Q5', 'CO2', 10.0, 'L3', 'Producer-Consumer bounded buffer with Semaphores'),
        ('q_mid3', 'as_cs301_mid', 'Q6', 'CO2', 10.0, 'L3', 'Peterson solution mutual exclusion proof'),
        ('q_mid4', 'as_cs301_mid', 'Q7', 'CO3', 10.0, 'L4', 'Round Robin & Shortest Remaining Time First Turnaround calculation'), # Bottleneck
        ('q_mid5', 'as_cs301_mid', 'Q8', 'CO3', 10.0, 'L4', 'Multi-level Feedback Queue priority aging simulation'),
        ('q_mid6', 'as_cs301_mid', 'Q9', 'CO3', 10.0, 'L4', 'Banker algorithm safe sequence state matrix analysis'), # Bottleneck
        ('q_asg1', 'as_cs301_asg', 'Q10', 'CO2', 15.0, 'L3', 'Dining Philosophers monitor deadlock-free implementation'),
        ('q_asg2', 'as_cs301_asg', 'Q11', 'CO3', 15.0, 'L4', 'Comparative scheduling simulator in C++'),
        ('q_lab1', 'as_cs301_lab', 'Q12', 'CO2', 20.0, 'L3', 'UNIX Pipes and shared memory IPC implementation'),
        ('q_lab2', 'as_cs301_lab', 'Q13', 'CO4', 20.0, 'L3', 'FIFO and LRU page replacement algorithm implementation'),
        ('q_end1', 'as_cs301_end', 'Q14', 'CO1', 10.0, 'L2', 'Interrupt dispatch and trap vectors'),
        ('q_end2', 'as_cs301_end', 'Q15', 'CO2', 10.0, 'L3', 'Reader-Writer problem semaphore synchronization'),
        ('q_end3', 'as_cs301_end', 'Q16', 'CO3', 15.0, 'L4', 'Real-time rate monotonic vs earliest deadline first'),
        ('q_end4', 'as_cs301_end', 'Q17', 'CO4', 15.0, 'L3', 'Two-level paging and inverted page tables addressing'),
        ('q_end5', 'as_cs301_end', 'Q18', 'CO5', 20.0, 'L2', 'Indexed vs Linked file allocation and RAID 5 parity'),
    ]
    cursor.executemany("INSERT OR REPLACE INTO questions VALUES (?, ?, ?, ?, ?, ?, ?);", questions)

    # 6. Generate 60 Students for CS301
    for i in range(60):
        first = FIRST_NAMES[i % len(FIRST_NAMES)]
        last = LAST_NAMES[(i * 3 + 7) % len(LAST_NAMES)]
        name = f"{first} {last}"
        usn = f"1MS22CS{str(i + 1).zfill(3)}"
        email = f"{first.lower()}.{last.lower()}@rvce.edu.in"
        st_id = f"std_cs301_{str(i + 1).zfill(3)}"

        # Capability archetype
        roll = random.random()
        if roll < 0.15:
            base_att = random.uniform(88, 98)
            score_mult = 0.88
        elif roll < 0.55:
            base_att = random.uniform(80, 92)
            score_mult = 0.74
        elif roll < 0.85:
            base_att = random.uniform(72, 84)
            score_mult = 0.62
        else:
            base_att = random.uniform(56, 74) # at-risk
            score_mult = 0.42

        # Attendance weekly logs
        total_att = 0.0
        for w in range(1, 13):
            w_att = base_att + random.uniform(-6, 6)
            if w in [5, 6, 7]:
                w_att -= (18 if base_att < 75 else 8)
            w_att = max(40.0, min(100.0, w_att))
            cursor.execute("INSERT INTO attendance (student_id, week_number, attendance_percent) VALUES (?, ?, ?);",
                           (st_id, w, round(w_att, 1)))
            total_att += w_att

        final_att = round(total_att / 12.0, 1)

        cursor.execute("INSERT OR REPLACE INTO students VALUES (?, ?, ?, ?, ?, ?);",
                       (st_id, usn, name, email, 'CS301', final_att))

        # Marks per question
        for q in questions:
            q_id, _, _, co_code, max_m, _, _ = q
            ratio = score_mult * (0.8 + (final_att / 100.0) * 0.25)

            # Bottleneck on CO3 Midterm Q7 and Q9
            if co_code == 'CO3':
                if q_id == 'q_mid4':
                    ratio *= 0.62 # Q7
                elif q_id == 'q_mid6':
                    ratio *= 0.65 # Q9
                else:
                    ratio *= 0.76

            awarded = round(max(0.0, min(max_m, ratio * max_m + random.uniform(-0.5, 0.5))), 1)
            cursor.execute("INSERT OR REPLACE INTO student_marks (student_id, question_id, marks_obtained) VALUES (?, ?, ?);",
                           (st_id, q_id, awarded))

        # Exit Surveys (1 to 5)
        co_surveys = [
            ('CO1', min(5, max(1, int(round(random.uniform(3.8, 4.8)))))),
            ('CO2', min(5, max(1, int(round(random.uniform(3.6, 4.7)))))),
            ('CO3', min(5, max(1, int(round(random.uniform(2.5, 3.8)))))), # Lower satisfaction
            ('CO4', min(5, max(1, int(round(random.uniform(3.7, 4.8)))))),
            ('CO5', min(5, max(1, int(round(random.uniform(3.9, 4.9)))))),
        ]
        for co_c, rtg in co_surveys:
            cursor.execute("INSERT OR REPLACE INTO surveys (student_id, co_code, rating, comments) VALUES (?, ?, ?, ?);",
                           (st_id, co_c, rtg, 'Standard semester exit feedback.'))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_database(force=True)
    print("OutcomeIQ SQLite database seeded successfully.")
