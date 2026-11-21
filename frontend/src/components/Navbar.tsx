import React from 'react';
import { 
  Briefcase, 
  UserCheck, 
  Shield, 
  LogOut, 
  Sparkles, 
  Video, 
  Building,
  User as UserIcon,
  FileText
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => {
              if (user) {
                if (user.role === 'CANDIDATE') setActiveTab('candidate-dashboard');
                else if (user.role === 'RECRUITER') setActiveTab('recruiter-dashboard');
                else if (user.role === 'ADMIN') setActiveTab('admin-dashboard');
              } else {
                setActiveTab('home');
              }
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm text-white font-black text-xl">
              🎯
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                HireSmart<span className="text-blue-600">AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Smart Talent Management
              </span>
            </div>
          </div>

          {/* Navigation Items (ONLY FOR LOGGED-IN ROLE) */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {user.role === 'CANDIDATE' && (
                <>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'jobs' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    Browse Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('candidate-dashboard')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'candidate-dashboard' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    My Applications
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-resume')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'ai-resume' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> AI Resume Studio
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-interview')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'ai-interview' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <Video className="w-4 h-4" /> AI Mock Interview
                  </button>
                </>
              )}

              {user.role === 'RECRUITER' && (
                <>
                  <button
                    onClick={() => setActiveTab('recruiter-dashboard')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'recruiter-dashboard' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    Applicant Pipeline
                  </button>
                  <button
                    onClick={() => setActiveTab('recruiter-jobs')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'recruiter-jobs' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    My Job Posts
                  </button>
                </>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-dashboard')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'admin-dashboard' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    Admin Analytics & Approvals
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-users')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'admin-users' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    User Management
                  </button>
                </>
              )}
            </nav>
          )}

          {/* User Profile & Sign Out (Strict Single Role) */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 truncate max-w-[160px]">
                  {user.fullName}
                </span>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wide border border-blue-200">
                  {user.role === 'CANDIDATE' ? 'Job Seeker' : user.role === 'RECRUITER' ? 'Recruiter' : 'SuperAdmin'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors shadow-sm"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'home'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'jobs'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Explore Jobs
              </button>
              <button
                onClick={() => setActiveTab('auth')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeTab === 'auth'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Sign In / Register
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
