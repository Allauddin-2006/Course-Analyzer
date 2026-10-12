import React, { useState, useMemo } from 'react';
import { UserRole, AttainmentSettings, Course, Student } from './types';
import { COURSES, CS301_QUESTIONS, INITIAL_ALERTS, CO_PO_MAPPINGS } from './data/mockData';
import { generateCourseStudents } from './data/mockData';
import { computeCoAttainments, computePoAttainments, DEFAULT_ATTAINMENT_SETTINGS } from './services/attainmentEngine';
import { computePredictiveStudentRisk } from './services/aiInsights';

import { Navbar } from './components/Navbar';
import { FacultyDashboard } from './components/FacultyDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistant } from './components/AiAssistant';
import { OmrScanner } from './components/OmrScanner';
import { CareerCollaboration } from './components/CareerCollaboration';
import { DataUpload } from './components/DataUpload';
import { CalculationExplainer } from './components/CalculationExplainer';
import { AlertsDrawer } from './components/AlertsDrawer';
import { ReportsModal } from './components/ReportsModal';
import { DemoTourModal } from './components/DemoTourModal';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('faculty');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('CS301');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Settings & Modals
  const [settings, setSettings] = useState<AttainmentSettings>(DEFAULT_ATTAINMENT_SETTINGS);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Custom uploaded students per course
  const [customCourseStudents, setCustomCourseStudents] = useState<Record<string, Student[]>>({});
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  // Selected Course
  const selectedCourse = useMemo(() => {
    return COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  }, [selectedCourseId]);

  // Students for this course (custom uploaded if available, otherwise generated)
  const students = useMemo(() => {
    return customCourseStudents[selectedCourse.id] || generateCourseStudents(selectedCourse.id);
  }, [customCourseStudents, selectedCourse.id]);

  // Assessment Questions
  const questions = useMemo(() => {
    return CS301_QUESTIONS;
  }, []);

  // Compute CO Attainments
  const coResults = useMemo(() => {
    return computeCoAttainments(selectedCourse, students, questions, settings);
  }, [selectedCourse, students, questions, settings]);

  // Compute PO Attainments
  const poResults = useMemo(() => {
    const mappings = CO_PO_MAPPINGS[selectedCourse.id] || CO_PO_MAPPINGS['CS301'];
    return computePoAttainments(coResults, mappings);
  }, [selectedCourse, coResults]);

  // Compute Predictive Student Risk
  const atRiskStudents = useMemo(() => {
    return computePredictiveStudentRisk(students, questions);
  }, [students, questions]);

  // Active Student for Student View
  const activeStudent = useMemo(() => {
    if (activeStudentId) {
      const found = students.find(s => s.id === activeStudentId || s.usn === activeStudentId);
      if (found) return found;
    }
    return students[0];
  }, [students, activeStudentId]);

  const handleUploadStudents = (newStudents: Student[]) => {
    if (!newStudents || newStudents.length === 0) return;
    setCustomCourseStudents(prev => ({
      ...prev,
      [selectedCourse.id]: newStudents
    }));
    setActiveStudentId(newStudents[0].id);

    const uploadAlert = {
      id: `alt_upload_${Date.now()}`,
      severity: 'info' as const,
      title: `Dataset Ingested: ${newStudents.length} Students for ${selectedCourse.code}`,
      message: `Active roster updated. Primary student set to ${newStudents[0].name} (${newStudents[0].usn}). Attainment and risk matrices refreshed.`,
      courseCode: selectedCourse.code,
      date: new Date().toISOString().split('T')[0],
      type: 'CO_DEFICIT' as const,
      emailRecipient: 'academics@rvce.edu.in',
      emailPreview: {
        subject: `[OutcomeIQ] Marksheet Ingested for ${selectedCourse.code}`,
        body: `Successfully loaded ${newStudents.length} student records for ${selectedCourse.title}.\nFirst student in roster: ${newStudents[0].name} (${newStudents[0].usn}).`
      }
    };
    setAlerts(prev => [uploadAlert, ...prev]);
  };

  const handleImportOmrMarks = (extractedRows: any[]) => {
    if (!extractedRows || extractedRows.length === 0) return;
    const updated = students.map((s) => {
      const match = extractedRows.find(r => r.usn === s.usn || r.name === s.name);
      if (match) {
        return {
          ...s,
          name: match.name || s.name,
          marks: {
            ...s.marks,
            q_mid4: match.q7 ?? s.marks['q_mid4'],
            q_mid6: match.q9 ?? s.marks['q_mid6'],
          }
        };
      }
      return s;
    });
    setCustomCourseStudents(prev => ({
      ...prev,
      [selectedCourse.id]: updated
    }));
  };

  // Tour Step Handler
  const handleExecuteTourStep = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentRole('faculty');
      setSelectedCourseId('CS301');
      setActiveTab('dashboard');
      setIsReportOpen(false);
    } else if (stepNumber === 2) {
      setCurrentRole('faculty');
      setSelectedCourseId('CS301');
      setActiveTab('dashboard');
      setIsReportOpen(false);
    } else if (stepNumber === 3) {
      setCurrentRole('faculty');
      setActiveTab('ai_assistant');
      setIsReportOpen(false);
    } else if (stepNumber === 4) {
      setIsReportOpen(true);
    } else if (stepNumber === 5) {
      setIsReportOpen(false);
      setCurrentRole('student');
      setActiveTab('dashboard');
    }
  };

  const handleOpenAssistantWithQuery = (_query: string) => {
    setActiveTab('ai_assistant');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedCourse={selectedCourse}
        courses={COURSES}
        onCourseChange={setSelectedCourseId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadAlertsCount={alerts.length}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onStartDemoTour={() => setIsTourOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        activeStudentName={activeStudent.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dynamic View based on Active Tab & Role */}
        {activeTab === 'dashboard' && (
          <>
            {currentRole === 'faculty' && (
              <FacultyDashboard
                course={selectedCourse}
                students={students}
                questions={questions}
                coResults={coResults}
                poResults={poResults}
                atRiskStudents={atRiskStudents}
                settings={settings}
                onUpdateSettings={setSettings}
                onOpenExplainer={() => setIsExplainerOpen(true)}
                onOpenAssistantWithQuery={handleOpenAssistantWithQuery}
                onOpenReport={() => setIsReportOpen(true)}
              />
            )}

            {currentRole === 'student' && (
              <StudentDashboard
                student={activeStudent}
                course={selectedCourse}
                coResults={coResults}
                students={students}
                questions={questions}
                onSelectStudent={setActiveStudentId}
                onOpenAssistant={handleOpenAssistantWithQuery}
                onOpenCollaboration={() => setActiveTab('career')}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                courses={COURSES}
                poResults={poResults}
                onOpenReport={() => setIsReportOpen(true)}
                onSelectCourse={(id) => {
                  setSelectedCourseId(id);
                  setCurrentRole('faculty');
                }}
              />
            )}
          </>
        )}

        {activeTab === 'ai_assistant' && (
          <AiAssistant
            course={selectedCourse}
            coResults={coResults}
            poResults={poResults}
            students={students}
            atRiskStudents={atRiskStudents}
          />
        )}

        {activeTab === 'omr_scanner' && (
          <OmrScanner
            onImportOmrMarks={handleImportOmrMarks}
          />
        )}

        {activeTab === 'career' && (
          <CareerCollaboration
            students={students}
          />
        )}

        {activeTab === 'data_upload' && (
          <DataUpload
            selectedCourse={selectedCourse}
            currentStudentsCount={students.length}
            onUploadStudents={handleUploadStudents}
            onNavigateToRole={(role) => {
              setCurrentRole(role);
              setActiveTab('dashboard');
            }}
          />
        )}

      </main>

      {/* Modals and Drawers */}
      <CalculationExplainer
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />

      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
      />

      <ReportsModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        course={selectedCourse}
        coResults={coResults}
        poResults={poResults}
      />

      <DemoTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onExecuteTourStep={handleExecuteTourStep}
      />

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OutcomeIQ: Course Outcome Achievement Analyser • Autonomous OBE / NBA / NAAC Engine</span>
          <span className="font-mono text-[11px] text-slate-400">Offline Verified • Privacy-First Synthetic Cohort</span>
        </div>
      </footer>

    </div>
  );
}
