import React, { useState } from 'react';
import { 
  Briefcase, 
  UserCheck, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  Building, 
  FileText, 
  Video, 
  Lock, 
  IndianRupee, 
  MapPin, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Database,
  ExternalLink
} from 'lucide-react';
import { Job, Resume, UserRole } from '../../types';
import { formatSalaryInr } from '../../utils/currency';

interface LandingPageProps {
  approvedJobs: Job[];
  onOpenRegister: (role: 'candidate' | 'recruiter') => void;
  onOpenLogin: (role: 'candidate' | 'recruiter' | 'admin') => void;
  onQuickDemo: (role: UserRole) => void;
  onSelectJob: (job: Job) => void;
  onBrowseAllJobs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  approvedJobs,
  onOpenRegister,
  onOpenLogin,
  onQuickDemo,
  onSelectJob,
  onBrowseAllJobs
}) => {
  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 sm:p-14 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>VCUBE HACK QUEST 1.0 • AI-Powered Recruitment Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Intelligent Hiring for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Job Seekers & Verified Employers
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connecting candidates with verified companies through explainable AI resume scoring, 
            interactive mock video interviews, and multi-tenant recruiter workflows — with every vacancy 
            verified and approved by the SuperAdmin.
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Admin-Verified Vacancies
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" /> 4-Factor AI Match Scoring
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Database className="w-4 h-4 text-pink-400" /> Cloudflare R2 Storage (10 GB)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Lock className="w-4 h-4 text-indigo-400" /> Recruiter Privacy Shield
            </span>
          </div>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenRegister('candidate')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> I'm a Job Seeker — Register Free
            </button>
            <button
              onClick={() => onOpenRegister('recruiter')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Building className="w-4 h-4 text-purple-400" /> I'm an Employer — Post Vacancies
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THREE DEDICATED PORTAL GATEWAYS                       */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Tailored Access Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Choose Your Role to Enter HireSmart AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Dedicated registration and sign-in channels for candidates, employers, and administrator governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ----------------- PORTAL 1: JOB SEEKER ----------------- */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 hover:border-indigo-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                Job Seeker Portal
              </span>
              <h3 className="text-xl font-black text-white mt-3">
                For Candidates & Students
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Build your profile with educational qualifications, upload your resume to Cloudflare R2, 
                and receive instant AI match scores and mock interview training.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Register with Degree, College, Year & CGPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cloudflare R2 Resume PDF text extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Matching: 40% skills, 25% exp, 20% proj, 15% edu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive AI Video Mock Interview simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Brevo 6-digit email OTP verification</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => onOpenRegister('candidate')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Register as Job Seeker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenLogin('candidate')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors"
              >
                Job Seeker Sign In
              </button>
            </div>
          </div>

          {/* ----------------- PORTAL 2: RECRUITER / EMPLOYER ----------------- */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/10">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30">
                <Building className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/30">
                Employer & Recruiter Portal
              </span>
              <h3 className="text-xl font-black text-white mt-3">
                For Recruiters & Companies
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Register your organization, post vacancies with headcount requirements, and let AI rank 
                and screen applicants inside your isolated tenant workspace.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Register with Company, Website & Vacancies count</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-tenant isolated company pipelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Postings submitted for Admin Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Recruiter privacy: Personal contact strictly hidden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Applicant stages: Applied &rarr; Shortlisted &rarr; Interviewed</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => onOpenRegister('recruiter')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Register as Recruiter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenLogin('recruiter')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors"
              >
                Recruiter Sign In
              </button>
            </div>
          </div>

          {/* ----------------- PORTAL 3: SUPERADMIN ----------------- */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-pink-500/30 hover:border-pink-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-pink-500/10">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-5 border border-pink-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-pink-950 text-pink-300 border border-pink-500/30">
                SuperAdmin Portal
              </span>
              <h3 className="text-xl font-black text-white mt-3">
                For Platform Owner (You)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Supervise the entire recruitment ecosystem. Inspect pending vacancies posted by recruiters, 
                verify their validity, and approve or reject them with single-click authority.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Vacancy Approval Queue:</strong> Approve/Reject posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unapproved vacancies hidden from job seekers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-tenant company & user governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Platform analytics & Cloudflare R2 audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Default credentials: admin@hiresmart.ai</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => onOpenLogin('admin')}
                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md shadow-pink-600/30 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>SuperAdmin Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] text-center text-slate-500 py-1 font-mono">
                Master Governance Mode
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. LIVE ADMIN-APPROVED VACANCIES PREVIEW                 */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Admin-Verified Opportunities
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Latest Live Job Vacancies
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every vacancy here has passed SuperAdmin inspection. Recruiter personal details are kept strictly confidential.
            </p>
          </div>

          <button
            onClick={onBrowseAllJobs}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View All Vacancies ({approvedJobs.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {approvedJobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-md hover:shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    {/* Privacy Shield: Company Name Only */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                      <Building className="w-3 h-3" /> {job.companyName}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mt-0.5 line-clamp-1">
                      {job.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold shrink-0">
                    {job.employmentType.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> {formatSalaryInr(job.minSalary, job.maxSalary)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 4).map((sk, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{job.vacanciesCount || 2} Openings</span>
                <span className="font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Details & Apply <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HACKATHON EVALUATION / JUDGE 1-CLICK DEMO BAR         */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-pink-950/60 border border-purple-500/30 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Hackathon Evaluation & Live Demonstration
            </span>
            <h3 className="text-xl font-black text-white">
              Instant 1-Click Role Exploration for Judges
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Want to inspect the fully authenticated workflows right away without filling registration forms? 
              Click below to jump directly into each role's environment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => onQuickDemo('CANDIDATE')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-transform active:scale-95 flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Job Seeker Demo</span>
            </button>
            <button
              onClick={() => onQuickDemo('RECRUITER')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Building className="w-4 h-4" />
              <span>Recruiter Demo</span>
            </button>
            <button
              onClick={() => onQuickDemo('ADMIN')}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md shadow-pink-600/30 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>SuperAdmin Demo</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
