import React from 'react';
import { 
  LayoutGrid, 
  Briefcase, 
  FileText, 
  Send, 
  Target, 
  Video, 
  Wand2, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  PlusCircle,
  Users,
  Building,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenCreateJob: () => void;
  onOpenImprovementModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenUpload,
  onOpenCreateJob,
  onOpenImprovementModal
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto custom-scrollbar">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-slate-50 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-sm shadow-blue-500/20">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            HireSmart<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            WORKSPACE
          </div>

          <nav className="space-y-1">
            {/* CANDIDATE NAVIGATION */}
            {user.role === 'CANDIDATE' && (
              <>
                <button
                  onClick={() => setActiveTab('candidate-dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'candidate-dashboard'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'jobs'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Explore jobs</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai-resume')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'ai-resume'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>My resumes</span>
                </button>

                <button
                  onClick={() => setActiveTab('candidate-dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'candidate-pipeline'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>My applications</span>
                </button>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Target className="w-4 h-4 shrink-0" />
                  <span>AI job match</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai-interview')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'ai-interview'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 shrink-0" />
                  <span>Interview prep</span>
                </button>

                <button
                  onClick={onOpenImprovementModal}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Wand2 className="w-4 h-4 shrink-0" />
                  <span>Resume enhancer</span>
                </button>

                <button
                  onClick={() => setActiveTab('candidate-dashboard')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span>My profile</span>
                </button>
              </>
            )}

            {/* RECRUITER NAVIGATION */}
            {user.role === 'RECRUITER' && (
              <>
                <button
                  onClick={() => setActiveTab('recruiter-dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'recruiter-dashboard'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('recruiter-jobs')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'recruiter-jobs'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Job vacancies</span>
                </button>

                <button
                  onClick={() => setActiveTab('recruiter-dashboard')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Applicant pipeline</span>
                </button>

                <button
                  onClick={onOpenCreateJob}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <PlusCircle className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>+ Post new job</span>
                </button>
              </>
            )}

            {/* ADMIN NAVIGATION */}
            {user.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Job approvals</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-users')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === 'admin-users'
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>User accounts</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Quick Access Card & Sign Out */}
      <div className="p-4 space-y-3">
        {/* Quick Access Card (Exact Match) */}
        <div className="p-4 rounded-3xl bg-blue-50/60 border border-blue-100/70">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 fill-current" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            Smarter hiring, powered by AI.
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Make every opportunity count with personalized insights.
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 text-sm font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
