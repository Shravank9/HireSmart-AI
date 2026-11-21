import React from 'react';
import { 
  FileText, 
  Send, 
  Briefcase, 
  Sparkles, 
  Target, 
  Video, 
  Wand2, 
  ArrowRight, 
  Building, 
  MapPin, 
  IndianRupee, 
  ExternalLink,
  Inbox
} from 'lucide-react';
import { Application, Resume, Job, User } from '../../types';
import { formatSalaryInr } from '../../utils/currency';
import { openResumeFile } from '../../utils/resumeHelper';

interface CandidateDashboardProps {
  applications: Application[];
  resumes: Resume[];
  jobs: Job[];
  currentUser?: User | null;
  onOpenUpload: () => void;
  onOpenMockInterview: () => void;
  onBrowseJobs: () => void;
  onOpenResumeAnalysis?: () => void;
  onOpenImprovementModal?: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  applications,
  resumes,
  jobs,
  currentUser,
  onOpenUpload,
  onOpenMockInterview,
  onBrowseJobs,
  onOpenResumeAnalysis,
  onOpenImprovementModal
}) => {
  const activeResume = resumes.length > 0 ? resumes[0] : null;
  const firstName = currentUser?.fullName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'abc';

  return (
    <div className="space-y-7 animate-fade-in max-w-6xl mx-auto">
      
      {/* Welcome Title (Exact match to TalentFlow reference UI) */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
          YOUR WORKSPACE
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Good to see you, {firstName} <span className="text-2xl">👋</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's a snapshot of your career journey today.
        </p>
      </div>

      {/* 3 Metric Cards Row (Exact Match) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Uploaded resumes */}
        <div 
          onClick={onOpenUpload}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Uploaded resumes
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black text-slate-900">
              {resumes.length}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {activeResume ? 'Ready for AI analysis' : 'Upload your resume to get started'}
            </p>
          </div>
        </div>

        {/* Metric 2: Applications sent */}
        <div 
          onClick={onBrowseJobs}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Applications sent
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/60">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black text-slate-900">
              {applications.length}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Across all opportunities
            </p>
          </div>
        </div>

        {/* Metric 3: Open opportunities */}
        <div 
          onClick={onBrowseJobs}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Open opportunities
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black text-slate-900">
              {jobs.length}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Explore your next role
            </p>
          </div>
        </div>

      </div>

      {/* 2-Column Main Workspace Section (Exact Match to Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Explore opportunities */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Explore opportunities
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Discover roles that could be your next big move.
              </p>
            </div>
            <button
              onClick={onBrowseJobs}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {jobs.length === 0 ? (
            /* Clean Empty State Card */
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100/60">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No open jobs yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Your information will appear here once available.
              </p>
            </div>
          ) : (
            /* Recent Opportunities Feed */
            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  onClick={onBrowseJobs}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/30 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" /> {job.companyName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-semibold">
                        {job.employmentType.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                        <IndianRupee className="w-3 h-3" /> {formatSalaryInr(job.minSalary, job.maxSalary)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onBrowseJobs}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1"
                  >
                    View & Apply <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submitted Applications Feed */}
          {applications.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your Applications ({applications.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live recruitment pipeline tracking and AI match results
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{app.jobTitle}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {app.companyName} • Submitted: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        AI Match: {app.matchScore}%
                      </span>
                      <button
                        type="button"
                        onClick={() => openResumeFile(app.resumeStorageUrl, `${app.candidateName.replace(/\s+/g, '_')}_Resume.pdf`, app.candidateName)}
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                      >
                        View Resume <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Your AI toolkit (Exact Match) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your AI toolkit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Make your next move smarter.
            </p>
          </div>

          <div className="space-y-3">
            {/* Action 1: Analyze your resume */}
            <div
              onClick={() => onOpenResumeAnalysis ? onOpenResumeAnalysis() : onOpenUpload()}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                    Analyze your resume
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Extract competencies & gaps
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Action 2: Match with a job */}
            <div
              onClick={onBrowseJobs}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/60">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors block">
                    Match with a job
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Instant AI scoring calculation
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Action 3: Prepare for interviews */}
            <div
              onClick={onOpenMockInterview}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors block">
                    Prepare for interviews
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Live speech-to-text video practice
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Action 4: Improve your resume */}
            <div
              onClick={() => onOpenImprovementModal ? onOpenImprovementModal() : onOpenUpload()}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/60">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors block">
                    Improve your resume
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Actionable ATS bullet rewrites
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
