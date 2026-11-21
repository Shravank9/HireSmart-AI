import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Building, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Layers,
  Lock,
  Search,
  Check,
  X,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { User, Company, Job } from '../../types';

interface AdminDashboardProps {
  users: User[];
  companies: Company[];
  jobs: Job[];
  onToggleUserStatus: (userId: number, currentStatus: string) => void;
  onApproveJob: (jobId: number) => void;
  onRejectJob: (jobId: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  companies,
  jobs,
  onToggleUserStatus,
  onApproveJob,
  onRejectJob
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'approvals' | 'users' | 'companies'>('approvals');
  const [userSearch, setUserSearch] = useState('');

  const pendingJobs = jobs.filter(j => j.approvalStatus === 'PENDING_APPROVAL');

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Admin Header (Facebook / YouTube Clean Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> SuperAdmin Verification Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Admin Verification & Approval Control
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Review recruiter job vacancies, manage verified accounts, and grant approvals before postings become public.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
          <Activity className="w-4 h-4 text-emerald-600" /> System Status: Operational
        </div>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" /> Pending Approvals
          </span>
          <div className="mt-2 text-3xl font-bold text-amber-600">{pendingJobs.length}</div>
          <span className="text-sm text-slate-600 mt-1 block">Vacancies to review</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total System Users</span>
          <div className="mt-2 text-3xl font-bold text-slate-900">{users.length}</div>
          <span className="text-sm text-blue-600 mt-1 block font-semibold">Candidates & Recruiters</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Companies</span>
          <div className="mt-2 text-3xl font-bold text-slate-900">{companies.length}</div>
          <span className="text-sm text-slate-600 mt-1 block">Registered organizations</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Job Postings</span>
          <div className="mt-2 text-3xl font-bold text-emerald-600">{jobs.filter(j => j.approvalStatus === 'APPROVED' || j.status === 'ACTIVE').length}</div>
          <span className="text-sm text-slate-600 mt-1 block font-semibold">Public to candidates</span>
        </div>
      </div>

      {/* Admin Navigation Switcher Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveAdminTab('approvals')}
          className={`pb-3 relative transition-colors ${
            activeAdminTab === 'approvals'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Job Vacancy Approvals ({pendingJobs.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 relative transition-colors ${
            activeAdminTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          User Account Management ({users.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('companies')}
          className={`pb-3 relative transition-colors ${
            activeAdminTab === 'companies'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Companies Directory ({companies.length})
        </button>
      </div>

      {/* TAB CONTENT 1: JOB VACANCY APPROVALS */}
      {activeAdminTab === 'approvals' && (
        <div className="space-y-4">
          {pendingJobs.length > 0 ? (
            pendingJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      PENDING APPROVAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Company: <strong className="text-slate-800">{job.companyName}</strong> • Location: {job.location} • Type: {job.employmentType}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 max-w-2xl line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.requiredSkills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onApproveJob(job.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve Vacancy
                  </button>
                  <button
                    onClick={() => onRejectJob(job.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">All Job Vacancies Approved</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                There are currently no job postings waiting for verification.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: USERS */}
      {activeAdminTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, or role..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{filteredUsers.length} users registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => onToggleUserStatus(u.id, u.status)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: COMPANIES */}
      {activeAdminTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {c.industry || 'Enterprise'}
                </span>
              </div>
              <p className="text-xs text-slate-500">{c.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                <span>Location: {c.location || 'Remote'}</span>
                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
