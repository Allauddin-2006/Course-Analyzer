import React from 'react';
import { UserRole, Course } from '../types';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Bell, 
  PlayCircle, 
  FileText, 
  Sliders, 
  HelpCircle,
  ScanLine,
  Compass,
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedCourse: Course;
  courses: Course[];
  onCourseChange: (courseId: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onStartDemoTour: () => void;
  onOpenReport: () => void;
  onOpenExplainer: () => void;
  activeStudentName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedCourse,
  courses,
  onCourseChange,
  activeTab,
  onTabChange,
  unreadAlertsCount,
  onOpenAlerts,
  onStartDemoTour,
  onOpenReport,
  onOpenExplainer,
  activeStudentName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                  OutcomeIQ
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  OBE • NBA • NAAC
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Course Outcome Achievement & Gap Analyser</p>
            </div>
          </div>

          {/* Course Selector & Actions */}
          <div className="flex items-center space-x-3">
            {/* Course Dropdown */}
            {currentRole !== 'admin' && (
              <div className="relative">
                <select
                  value={selectedCourse.id}
                  onChange={(e) => onCourseChange(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Run Demo Tour Button */}
            <button
              onClick={onStartDemoTour}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all transform active:scale-95 animate-pulse"
              title="Walk through the hackathon demo scenario"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Run Demo Tour</span>
              <span className="sm:hidden">Tour</span>
            </button>

            {/* Quick Report Trigger */}
            <button
              onClick={onOpenReport}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Generate NBA Criterion 3 Accreditation Report"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Accreditation Report</span>
            </button>

            {/* Alerts Bell */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Automated Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => onRoleChange('faculty')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'faculty'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Faculty View (Prof. Ananya Rao)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Faculty</span>
              </button>

              <button
                onClick={() => onRoleChange('student')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'student'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={activeStudentName ? `Student View (${activeStudentName})` : "Student View"}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentRole === 'student' && activeStudentName ? activeStudentName.split(' ')[0] : 'Student'}
                </span>
              </button>

              <button
                onClick={() => onRoleChange('admin')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="HoD / Admin View (Dr. K. S. Sharma)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">HoD / Admin</span>
              </button>
            </div>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60 text-xs sm:text-sm">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-indigo-400 font-semibold border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {currentRole === 'faculty' ? 'Course Attainment Dashboard' : currentRole === 'student' ? 'My Progress & Study Plan' : 'Department PO Attainment'}
            </span>
          </button>

          <button
            onClick={() => onTabChange('ai_assistant')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'ai_assistant'
                ? 'bg-slate-800 text-sky-400 font-semibold border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>RAG AI Assistant</span>
          </button>

          <button
            onClick={() => onTabChange('omr_scanner')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'omr_scanner'
                ? 'bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan Marksheet / OMR (OpenCV)</span>
          </button>

          <button
            onClick={() => onTabChange('career')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'career'
                ? 'bg-slate-800 text-purple-400 font-semibold border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Career Readiness & Collaboration</span>
          </button>

          <button
            onClick={() => onTabChange('data_upload')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'data_upload'
                ? 'bg-slate-800 text-amber-400 font-semibold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Data Upload (CSV/Excel)</span>
          </button>

          <button
            onClick={onOpenExplainer}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors ml-auto"
            title="How CO/PO Attainment is Calculated"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Formula Explainer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
