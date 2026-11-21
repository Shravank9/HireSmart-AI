import axios from 'axios';
import { Job, Application, Resume, ResumeAnalysis, InterviewQuestion, InterviewEvaluation } from '../types';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hiresmart_jwt');
  if (token && !token.startsWith('demo-') && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle 401 → auto-logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('hiresmart_jwt');
      if (token && !token.startsWith('demo-')) {
        localStorage.removeItem('hiresmart_jwt');
        localStorage.removeItem('hiresmart_user');
        window.dispatchEvent(new Event('hiresmart_logout'));
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  verifyOtp: (data: any) => apiClient.post('/auth/verify-otp', data),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data: { email: string; otpCode: string; newPassword: string }) => apiClient.post('/auth/reset-password', data),
  resendOtp: (data: { email: string; purpose?: string } | string, purpose?: string) => {
    if (typeof data === 'object') {
      return apiClient.post('/auth/resend-otp', { email: data.email, purpose: data.purpose || 'REGISTRATION' });
    }
    return apiClient.post('/auth/resend-otp', { email: data, purpose: purpose || 'REGISTRATION' });
  },

  // Jobs
  getJobs: (search?: string) => apiClient.get<Job[]>('/jobs', { params: { search } }),
  getJobById: (id: number) => apiClient.get<Job>(`/jobs/${id}`),
  createJob: (data: any) => apiClient.post<Job>('/jobs', data),

  // Resumes & Cloudflare R2
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getMyResumes: () => apiClient.get<Resume[]>('/resumes/my'),

  // Applications
  applyForJob: (jobId: number, resumeId: number) => apiClient.post<Application>('/applications', { jobId, resumeId }),
  getMyApplications: () => apiClient.get<Application[]>('/applications/my'),
  getJobApplications: (jobId: number) => apiClient.get<Application[]>(`/applications/job/${jobId}`),
  updateApplicationStatus: (id: number, status: string, notes?: string, rejectionReason?: string) =>
    apiClient.put<Application>(`/applications/${id}/status`, { status, notes, rejectionReason }),

  // AI Services
  analyzeResume: (resumeId?: number, text?: string) => apiClient.post<ResumeAnalysis>('/ai/analyze-resume', { resumeId, text }),
  matchJob: (candidateId: number, jobId: number) => apiClient.post('/ai/match-job', { candidateId, jobId }),
  generateInterviewQuestions: (jobId: number, difficulty: string = 'MEDIUM') =>
    apiClient.post<InterviewQuestion[]>('/ai/generate-interview-questions', { jobId, difficulty }),
  improveResume: (resumeId: number) => apiClient.post('/ai/improve-resume', { resumeId }),
  evaluateInterview: (transcript: string) => apiClient.post<InterviewEvaluation>('/ai/evaluate-interview', { transcript }),

  // Recruiter & Admin Dashboards
  getRecruiterDashboard: () => apiClient.get('/recruiter/dashboard'),
  getRecruiterCandidates: () => apiClient.get<Application[]>('/recruiter/candidates'),
  scheduleInterview: (data: any) => apiClient.post('/recruiter/interviews', data),
  getAdminDashboard: () => apiClient.get('/admin/dashboard'),
  getAdminUsers: () => apiClient.get('/admin/users'),
  getAdminCompanies: () => apiClient.get('/admin/companies'),
  updateUserStatus: (id: number, status: string) => apiClient.put(`/admin/users/${id}/status`, { status }),
  approveJob: (id: number) => apiClient.put(`/admin/jobs/${id}/approve`),
  rejectJob: (id: number, reason?: string) => apiClient.put(`/admin/jobs/${id}/reject`, { reason })
};
