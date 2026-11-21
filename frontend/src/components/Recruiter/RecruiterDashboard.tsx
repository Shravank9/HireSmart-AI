import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Filter, 
  ExternalLink,
  ChevronRight,
  PlusCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Application, Job } from '../../types';
import { openResumeFile } from '../../utils/resumeHelper';

interface RecruiterDashboardProps {
  jobs: Job[];
  applications: Application[];
  onUpdateStatus: (applicationId: number, status: string, notes?: string, reason?: string) => void;
  onOpenScheduleModal: (application: Application) => void;
  onOpenCreateJobModal: () => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  jobs,
  applications,
  onUpdateStatus,
  onOpenScheduleModal,
  onOpenCreateJobModal
}) => {
  const [selectedStage, setSelectedStage] = useState('ALL');

  const STAGES = ['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];

  const filteredApps = selectedStage === 'ALL' 
    ? applications 
    : applications.filter(a => a.status === selectedStage);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Recruiter Header (Facebook / YouTube Clean Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <Briefcase className="w-4 h-4 text-blue-600" /> Recruiter Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Talent Pipeline & AI Match Engine
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Review candidate applications ranked by explainable AI scoring. Advance qualified candidates through recruitment stages: Review → Shortlist → Interview → Offer.
          </p>
        </div>

        <button
          onClick={onOpenCreateJobModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-colors active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Create New Job Posting
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Active Jobs</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{jobs.length}</span>
            <span className="text-sm text-blue-600 font-semibold">Live postings</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{applications.length}</span>
            <span className="text-sm text-blue-600 font-semibold">Applications</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shortlisted Candidates</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">
              {applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length}
            </span>
            <span className="text-sm text-emerald-600 font-semibold">Qualified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average AI Match</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {applications.length > 0
                ? Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / applications.length) + '%'
                : '—'}
            </span>
            <span className="text-sm text-blue-600 font-semibold">Explainable AI</span>
          </div>
        </div>
      </div>

      {/* Stage Selector Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center gap-2 text-sm font-bold shadow-sm">
        <span className="text-slate-500 mr-2 flex items-center gap-1.5 text-sm">
          <Filter className="w-4 h-4" /> Stage:
        </span>
        {STAGES.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStage(st)}
            className={`px-4 py-1.5 rounded-xl transition-all ${
              selectedStage === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applicant Cards List */}
      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Candidate Info */}
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-xl font-bold text-slate-900">{app.candidateName}</h3>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    Applied for: <strong className="text-slate-900 font-bold">{app.jobTitle}</strong> • {app.candidateEmail}
                  </p>

                  {/* Safe resume view link */}
                  <div className="mt-2.5 flex items-center gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => openResumeFile(app.resumeStorageUrl, `${app.candidateName.replace(/\s+/g, '_')}_Resume.pdf`, app.candidateName)}
                      className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      View Resume <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">Submitted: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* AI Match Score Radial Pill */}
                <div className="flex items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-center pr-5 border-r border-slate-200">
                    <span className="text-2xl font-bold text-blue-600">{app.matchScore}%</span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">AI Match</span>
                  </div>

                  <div className="text-sm space-y-1 text-slate-600 font-medium">
                    <div>Skills: <strong className="text-slate-900 font-bold">{app.skillsMatchScore}%</strong></div>
                    <div>Experience: <strong className="text-slate-900 font-bold">{app.experienceMatchScore}%</strong></div>
                    <div>Education: <strong className="text-slate-900 font-bold">{app.educationMatchScore}%</strong></div>
                  </div>
                </div>
              </div>

              {/* Matched & Missing Skills Row */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 font-semibold text-xs">Matched Skills:</span>
                  {app.matchedSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold border border-emerald-200">
                      ✓ {sk}
                    </span>
                  ))}
                  {app.missingSkills.length > 0 && (
                    <>
                      <span className="text-slate-500 font-semibold text-xs ml-2">Missing:</span>
                      {app.missingSkills.map((sk, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-xs font-semibold border border-amber-200">
                          ⚠️ {sk}
                        </span>
                      ))}
                    </>
                  )}
                </div>

                {/* Action Buttons for Recruiter */}
                <div className="flex items-center gap-2.5">
                  {app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW_SCHEDULED' && (
                    <button
                      onClick={() => onUpdateStatus(app.id, 'SHORTLISTED', 'Candidate matches position requirements.')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-sm"
                    >
                      Shortlist
                    </button>
                  )}

                  <button
                    onClick={() => onOpenScheduleModal(app)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-sm flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" /> Schedule Interview
                  </button>

                  {app.status !== 'REJECTED' && (
                    <button
                      onClick={() => onUpdateStatus(app.id, 'REJECTED', 'Missing specialized requirements.')}
                      className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>

              {/* Explanation box */}
              {app.matchExplanation && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                  💡 <strong>AI Scoring Explanation:</strong> {app.matchExplanation}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-base">No applicants in this stage</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              {selectedStage === 'ALL' 
                ? 'Create a job posting to begin receiving candidate applications.' 
                : `No candidates currently in '${selectedStage.replace('_', ' ')}' stage.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
