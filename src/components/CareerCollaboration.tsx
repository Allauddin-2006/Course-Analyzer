import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare, 
  ThumbsUp, 
  Calendar,
  Send,
  Compass,
  Award
} from 'lucide-react';
import { Student, SkillMapping, JobRoleReadiness, StudyBuddyMatch } from '../types';
import { SKILL_MAPPINGS, JOB_ROLES } from '../data/mockData';

interface CareerCollaborationProps {
  students: Student[];
}

export const CareerCollaboration: React.FC<CareerCollaborationProps> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'career' | 'study_buddy' | 'sentiment'>('career');
  const [connectedBuddies, setConnectedBuddies] = useState<Record<string, boolean>>({});

  // FAISS-style Complementary Vector Pairing for Demo Student (Aarav Sharma)
  const studyBuddyMatches: StudyBuddyMatch[] = [
    {
      peer: students.find(s => s.name === 'Priya Nair') || students[0],
      compatibilityScore: 94,
      myWeaknessCovered: 'CO3: Process Scheduling & Banker Algorithm (Priya scored 95%)',
      theirWeaknessCovered: 'CO4: Virtual Memory & Page Replacement (Aarav scored 92%)',
      rationale: 'Complementary mastery vectors: Priya achieved high analytical accuracy in Round Robin calculations, while Aarav excelled in multi-level paging table architectures.'
    },
    {
      peer: students.find(s => s.name === 'Aditi Verma') || students[1],
      compatibilityScore: 88,
      myWeaknessCovered: 'CO3: CPU Scheduling algorithms (Aditi scored 80%)',
      theirWeaknessCovered: 'CO2: POSIX Multithreading & Mutex Locks (Aarav scored 85%)',
      rationale: 'Balanced study velocity with shared afternoon free periods on Tuesdays and Thursdays.'
    },
    {
      peer: students.find(s => s.name === 'Deepika Gupta') || students[2],
      compatibilityScore: 82,
      myWeaknessCovered: 'CO3: Gantt chart calculations and Turnaround time proofs',
      theirWeaknessCovered: 'CO5: Disk I/O buffer management and RAID 5 parity',
      rationale: 'Both are preparing for Systems Engineering campus recruitment assessments.'
    }
  ];

  // Campus Experience Exit Survey Student Comments (Sentiment Analyzed)
  const surveyFeedback = [
    {
      student: 'Anonymous (USN: 1MS22CS***)',
      comment: 'The visual scheduling animations used in the remedial demo helped clear up context switch delays that I struggled with during the midterm.',
      sentiment: 'Positive' as const,
      theme: 'Pedagogy & Tools',
      score: 0.88
    },
    {
      student: 'Anonymous (USN: 1MS22CS***)',
      comment: 'Question 7 in the midterm was excessively lengthy for a 60-minute examination. Having 4 arrival times and context switch penalties created immense time pressure.',
      sentiment: 'Critical' as const,
      theme: 'Exam Structure',
      score: -0.72
    },
    {
      student: 'Anonymous (USN: 1MS22CS***)',
      comment: 'The UNIX socket programming lab in CO2 gave me practical exposure that was directly asked in my summer internship interview.',
      sentiment: 'Positive' as const,
      theme: 'Practical Relevance',
      score: 0.94
    },
    {
      student: 'Anonymous (USN: 1MS22CS***)',
      comment: 'Attendance in weeks 5-7 suffered due to the monsoons and intra-college cultural festival. Recorded lecture catch-ups would have prevented the mid-term score drop.',
      sentiment: 'Neutral' as const,
      theme: 'Campus Scheduling',
      score: -0.15
    }
  ];

  const handleConnectBuddy = (peerName: string) => {
    setConnectedBuddies(prev => ({ ...prev, [peerName]: true }));
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-sm">
        <button
          onClick={() => setActiveTab('career')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'career'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Industry Career Readiness & Skills Mapping</span>
        </button>

        <button
          onClick={() => setActiveTab('study_buddy')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'study_buddy'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Study Buddy Matcher (FAISS Vector Pairing)</span>
        </button>

        <button
          onClick={() => setActiveTab('sentiment')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'sentiment'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Campus Experience & Survey Sentiment</span>
        </button>
      </div>

      {/* 1. CAREER READINESS TAB */}
      {activeTab === 'career' && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 text-white">
            <h2 className="text-xl font-extrabold flex items-center space-x-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <span>Course Outcome to High-Value Industry Roles Mapping</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Translating academic Bloom taxonomy achievements into real engineering competency scores for campus recruitment, technical interviews, and portfolio readiness.
            </p>
          </div>

          {/* Job Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {JOB_ROLES.map(role => (
              <div
                key={role.roleTitle}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Briefcase className="w-5 h-5" />
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{role.matchScore}%</span>
                      <span className="text-[10px] text-slate-400 block">Readiness Match</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white">{role.roleTitle}</h3>
                  <p className="text-xs text-slate-400 mb-4">{role.targetCompanyTypes}</p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-semibold text-slate-300 block uppercase tracking-wider">Required Skills:</span>
                    {role.requiredSkills.map(sk => (
                      <div key={sk.name} className="flex items-center space-x-2 text-xs">
                        {sk.acquired ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className={sk.acquired ? 'text-slate-300' : 'text-amber-200 font-medium'}>
                          {sk.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                  <span className="text-purple-400 font-semibold block mb-1">Recommended Pathway:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{role.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Mastery Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Evaluated Technical Skills & CO Provenance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SKILL_MAPPINGS.map(skill => (
                <div key={skill.skillName} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white">{skill.skillName}</span>
                    <span className="font-mono text-indigo-400 font-bold">{skill.masteryScore}%</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                    <span>{skill.category}</span>
                    <span className="font-mono text-slate-500">Source: {skill.associatedCos.join(', ')}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        skill.masteryScore >= 75 ? 'bg-emerald-500' : skill.masteryScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${skill.masteryScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. STUDY BUDDY MATCHER (FAISS Vector Cosine Similarity) */}
      {activeTab === 'study_buddy' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-sky-950/60 border border-indigo-500/30 text-white">
            <h2 className="text-xl font-extrabold flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>FAISS-Based Study Buddy Complement Matcher</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Embedding-based cosine similarity pairs student cohorts based on <em>complementary</em> cognitive strengths (where Student A excels where Student B lags, and vice-versa) to accelerate mutual academic remediation.
            </p>
          </div>

          <div className="space-y-4">
            {studyBuddyMatches.map((match) => {
              const isConnected = connectedBuddies[match.peer.name];

              return (
                <div
                  key={match.peer.name}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30 shrink-0">
                      {match.peer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-white">{match.peer.name}</h3>
                        <span className="font-mono text-xs text-slate-400">({match.peer.usn})</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                          {match.compatibilityScore}% Complement Score
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        {match.rationale}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                          <span className="font-bold block text-[11px] text-emerald-400">What they teach you:</span>
                          <span>{match.myWeaknessCovered}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
                          <span className="font-bold block text-[11px] text-indigo-400">What you teach them:</span>
                          <span>{match.theirWeaknessCovered}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => handleConnectBuddy(match.peer.name)}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                        isConnected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Session Scheduled!</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Pair & Schedule Study Session</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400">Mutual consent notified via email</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CAMPUS EXPERIENCE & SENTIMENT */}
      {activeTab === 'sentiment' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 text-white">
            <h2 className="text-xl font-extrabold flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <span>Course Exit Survey Qualitative Sentiment Analysis</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Natural Language sentiment extraction from indirect student feedback surveys to diagnose non-quantitative friction points, pace concerns, and institutional scheduling overlaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveyFeedback.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-slate-400 text-[11px]">{item.student}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.sentiment === 'Positive'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.sentiment === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.sentiment} ({item.score > 0 ? `+${item.score}` : item.score})
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed italic">&ldquo;{item.comment}&rdquo;</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <span>Theme: <strong className="text-slate-300">{item.theme}</strong></span>
                  <span className="text-sky-400 font-medium">ChromaDB Indexed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
