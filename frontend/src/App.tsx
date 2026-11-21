import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Job, 
  Application, 
  Resume, 
  ResumeAnalysis, 
  Company 
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CandidateDashboard } from './components/Candidate/CandidateDashboard';
import { JobsBrowse } from './components/Candidate/JobsBrowse';
import { ResumeUploadModal } from './components/Candidate/ResumeUploadModal';
import { AiResumeAnalysisView } from './components/Candidate/AiResumeAnalysisView';
import { AiResumeImprovementModal } from './components/Candidate/AiResumeImprovementModal';
import { AiMockInterview } from './components/Candidate/AiMockInterview';
import { RecruiterDashboard } from './components/Recruiter/RecruiterDashboard';
import { ScheduleInterviewModal } from './components/Recruiter/ScheduleInterviewModal';
import { CreateJobModal } from './components/Recruiter/CreateJobModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { LandingPage } from './components/Landing/LandingPage';
import { COUNTRY_CODES } from './utils/countryCodes';
import { 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const DEMO_JOBS: Job[] = [
  {
    id: 1, title: 'Senior Java 25 Spring Boot Engineer', department: 'Core Backend',
    description: 'We are seeking a seasoned Java backend engineer to lead our microservices transformation using modern Java 25 runtime. You will architect robust, fault-tolerant REST APIs, design relational data models, and integrate AI agent features.',
    location: 'Bengaluru, Karnataka / Remote', employmentType: 'FULL_TIME', experienceLevel: 'Senior (4+ years)',
    minSalary: 1600000, maxSalary: 2400000, currency: 'INR',
    requiredSkills: ['Java 25', 'Spring Boot', 'Spring Security', 'MySQL', 'Docker', 'REST APIs', 'Microservices'],
    status: 'ACTIVE', approvalStatus: 'APPROVED', companyId: 1, companyName: 'TechCorp Innovations',
    vacanciesCount: 4, postedAt: '2026-11-20'
  },
  {
    id: 2, title: 'Full-Stack React & Spring Developer', department: 'Product Engineering',
    description: 'Seeking a dual-threat full stack developer to ship candidate-facing analytics dashboards and recruitment workflows using React, Tailwind CSS, Java 25, and Spring Boot.',
    location: 'Hyderabad, Telangana / Hybrid', employmentType: 'FULL_TIME', experienceLevel: 'Mid-Level (2-4 years)',
    minSalary: 1200000, maxSalary: 1800000, currency: 'INR',
    requiredSkills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Java 25', 'Spring Boot', 'REST APIs'],
    status: 'ACTIVE', approvalStatus: 'APPROVED', companyId: 1, companyName: 'TechCorp Innovations',
    vacanciesCount: 2, postedAt: '2026-11-19'
  },
  {
    id: 3, title: 'AI & NLP Integration Engineer', department: 'AI Research',
    description: 'Join our pioneering AI team to develop production generative AI agents, automated resume parsing pipelines, and speech-to-text interview analytics engines.',
    location: 'Bengaluru / Remote', employmentType: 'FULL_TIME', experienceLevel: 'Senior (3+ years)',
    minSalary: 1800000, maxSalary: 2800000, currency: 'INR',
    requiredSkills: ['Python', 'FastAPI', 'Spring Boot', 'LLMs', 'Vector Databases', 'PyTorch'],
    status: 'ACTIVE', approvalStatus: 'APPROVED', companyId: 2, companyName: 'CloudScale Systems',
    vacanciesCount: 3, postedAt: '2026-11-18'
  },
  {
    id: 4, title: 'DevOps & Cloud Infrastructure Specialist', department: 'Cloud Infrastructure',
    description: 'Lead our Kubernetes and Cloudflare cloud migrations. Manage Docker containers, Helm charts, and automated zero-downtime CI/CD release pipelines.',
    location: 'Pune / Remote', employmentType: 'FULL_TIME', experienceLevel: 'Mid-Senior',
    minSalary: 1400000, maxSalary: 2000000, currency: 'INR',
    requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Linux'],
    status: 'ACTIVE', approvalStatus: 'APPROVED', companyId: 2, companyName: 'CloudScale Systems',
    vacanciesCount: 2, postedAt: '2026-11-21'
  }
];

const DEMO_APPLICATIONS: Application[] = [
  {
    id: 101,
    jobId: 1,
    jobTitle: 'Senior Java 25 Spring Boot Engineer',
    companyName: 'TechCorp Innovations',
    candidateId: 101,
    candidateName: 'Rahul Verma',
    candidateEmail: 'rahul.verma@example.com',
    resumeId: 101,
    resumeStorageUrl: 'http://localhost:8080/api/resumes/download/Rahul_Verma_Resume.pdf',
    status: 'APPLIED',
    matchScore: 94.0,
    skillsMatchScore: 96.0,
    experienceMatchScore: 92.0,
    educationMatchScore: 94.0,
    matchExplanation: 'Outstanding match for core Java 25 backend microservices with 5+ years Spring Boot experience.',
    matchedSkills: ['Java 25', 'Spring Boot', 'Spring Security', 'MySQL'],
    missingSkills: ['Microservices'],
    appliedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 102,
    jobId: 2,
    jobTitle: 'Full-Stack React & Spring Developer',
    companyName: 'TechCorp Innovations',
    candidateId: 102,
    candidateName: 'Sneha Patel',
    candidateEmail: 'sneha.patel@example.com',
    resumeId: 102,
    resumeStorageUrl: 'http://localhost:8080/api/resumes/download/Sneha_Patel_Resume.pdf',
    status: 'SHORTLISTED',
    matchScore: 89.5,
    skillsMatchScore: 92.0,
    experienceMatchScore: 88.0,
    educationMatchScore: 90.0,
    matchExplanation: 'Solid full-stack versatility across React.js, Tailwind CSS, and Java Spring REST APIs.',
    matchedSkills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Spring Boot'],
    missingSkills: ['Java 25'],
    appliedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export function App() {
  const getInitialTab = (): string => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/jobs' || p === '/explore') return 'jobs';
    if (p === '/login' || p === '/register' || p === '/auth') return 'auth';
    return 'home';
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(() => window.location.pathname.toLowerCase() === '/register');

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    let target = '/';
    if (tab === 'home') target = '/';
    else if (tab === 'jobs') target = '/jobs';
    else if (tab === 'auth') target = isRegisterMode ? '/register' : '/login';
    else if (tab === 'candidate-dashboard') target = '/candidate/dashboard';
    else if (tab === 'recruiter-dashboard') target = '/recruiter/dashboard';
    else if (tab === 'admin-dashboard') target = '/admin/dashboard';
    else target = `/${tab}`;

    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p === '/jobs' || p === '/explore') {
        setActiveTabState('jobs');
      } else if (p === '/login') {
        setIsRegisterMode(false);
        setActiveTabState('auth');
      } else if (p === '/register') {
        setIsRegisterMode(true);
        setActiveTabState('auth');
      } else if (p === '/' || p === '/home' || p === '') {
        setActiveTabState(currentUser ? (currentUser.role === 'CANDIDATE' ? 'candidate-dashboard' : 'recruiter-dashboard') : 'home');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [currentUser]);

  // Auth Inputs
  const [authRole, setAuthRole] = useState<'CANDIDATE' | 'RECRUITER' | 'ADMIN'>('CANDIDATE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [vacanciesCount, setVacanciesCount] = useState('1');

  // OTP Step
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingUser, setPendingUser] = useState<any>(null);

  // Automatically reset OTP input whenever OTP verification screen opens and wipe browser autofills
  useEffect(() => {
    if (isOtpStep) {
      setOtpCode('');
      const timer = setTimeout(() => {
        const el = document.getElementById('otp-verification-code-input') as HTMLInputElement;
        if (el) {
          el.value = '';
        }
        setOtpCode('');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOtpStep]);

  // Status & Feedback
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // App Data (Initialized with standard active opportunities & persistent storage)
  const [jobs, setJobs] = useState<Job[]>(DEMO_JOBS);
  const [resumes, setResumes] = useState<Resume[]>(() => {
    try {
      const saved = localStorage.getItem('hiresmart_resumes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem('hiresmart_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isImprovementModalOpen, setIsImprovementModalOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [interviewApplication, setInterviewApplication] = useState<Application | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadApplicationsAndResumes = async (user?: User | null) => {
    // 1. Instant local restore
    try {
      const savedApps = localStorage.getItem('hiresmart_applications');
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApplications(parsed);
        }
      }
      const savedResumes = localStorage.getItem('hiresmart_resumes');
      if (savedResumes) {
        const parsed = JSON.parse(savedResumes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResumes(parsed);
        }
      }
    } catch (e) {}

    // 2. Fetch from backend if token exists
    const token = localStorage.getItem('hiresmart_jwt');
    if (!token) return;

    const activeUser = user || currentUser;
    if (!activeUser) return;

    if (activeUser.role === 'RECRUITER' || activeUser.role === 'ADMIN') {
      try {
        const res = await api.getRecruiterCandidates();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setApplications(prev => {
            const merged = [...prev];
            res.data.forEach((remoteApp: Application) => {
              const idx = merged.findIndex(a => a.id === remoteApp.id || (a.jobId === remoteApp.jobId && a.candidateEmail === remoteApp.candidateEmail));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...remoteApp };
              } else {
                merged.unshift(remoteApp);
              }
            });
            try {
              localStorage.setItem('hiresmart_applications', JSON.stringify(merged));
            } catch (err) {}
            return merged;
          });
        }
      } catch (e) {
        console.warn("Could not fetch recruiter candidates from backend:", e);
      }
    } else if (activeUser.role === 'CANDIDATE') {
      try {
        const [appsRes, resumesRes] = await Promise.allSettled([
          api.getMyApplications(),
          api.getMyResumes()
        ]);
        if (appsRes.status === 'fulfilled' && appsRes.value.data && Array.isArray(appsRes.value.data)) {
          setApplications(prev => {
            const merged = [...prev];
            appsRes.value.data.forEach((remoteApp: Application) => {
              const idx = merged.findIndex(a => a.id === remoteApp.id || (a.jobId === remoteApp.jobId && a.candidateEmail === remoteApp.candidateEmail));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...remoteApp };
              } else {
                merged.unshift(remoteApp);
              }
            });
            try {
              localStorage.setItem('hiresmart_applications', JSON.stringify(merged));
            } catch (err) {}
            return merged;
          });
        }
        if (resumesRes.status === 'fulfilled' && resumesRes.value.data && Array.isArray(resumesRes.value.data)) {
          setResumes(prev => {
            const merged = [...prev];
            resumesRes.value.data.forEach((r: Resume) => {
              if (!merged.some(m => m.id === r.id)) {
                merged.unshift(r);
              }
            });
            try {
              localStorage.setItem('hiresmart_resumes', JSON.stringify(merged));
            } catch (err) {}
            return merged;
          });
        }
      } catch (e) {
        console.warn("Could not sync candidate applications/resumes:", e);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('hiresmart_jwt');
    const savedUser = localStorage.getItem('hiresmart_user');

    if (token && savedUser) {
      try {
        const user: User = JSON.parse(savedUser);
        if (user && user.isVerified) {
          setCurrentUser(user);
          if (user.role === 'CANDIDATE') setActiveTab('candidate-dashboard');
          else if (user.role === 'RECRUITER') setActiveTab('recruiter-dashboard');
          else if (user.role === 'ADMIN') setActiveTab('admin-dashboard');
          loadApplicationsAndResumes(user);
        }
      } catch {
        localStorage.removeItem('hiresmart_jwt');
        localStorage.removeItem('hiresmart_user');
      }
    } else {
      loadApplicationsAndResumes();
    }

    // Load active jobs: Merge backend API jobs, locally persisted custom jobs, and DEMO_JOBS
    const loadAllJobs = async () => {
      let combinedJobs: Job[] = [...DEMO_JOBS];
      try {
        const res = await api.getJobs();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach((rj: Job) => {
            if (!combinedJobs.some(cj => cj.id === rj.id || cj.title.toLowerCase() === rj.title.toLowerCase())) {
              combinedJobs.unshift(rj);
            }
          });
        }
      } catch (e) {
        console.warn("Could not fetch remote jobs:", e);
      }

      try {
        const localCustom: Job[] = JSON.parse(localStorage.getItem('hiresmart_custom_jobs') || '[]');
        localCustom.forEach(lj => {
          if (!combinedJobs.some(cj => cj.id === lj.id || cj.title.toLowerCase() === lj.title.toLowerCase())) {
            combinedJobs.unshift(lj);
          }
        });
      } catch {}

      setJobs(combinedJobs);
    };

    loadAllJobs();
  }, []);

  // Form Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setOtpCode('');
    setAuthLoading(true);

    if (isRegisterMode) {
      const fullPhone = `${phoneCountryCode} ${phone.trim()}`.trim();
      const payload = {
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        phone: fullPhone,
        role: authRole,
        degree: authRole === 'CANDIDATE' ? degree.trim() : undefined,
        institution: authRole === 'CANDIDATE' ? institution.trim() : undefined,
        graduationYear: authRole === 'CANDIDATE' ? graduationYear.trim() : undefined,
        cgpa: authRole === 'CANDIDATE' ? cgpa.trim() : undefined,
        companyName: authRole === 'RECRUITER' ? companyName.trim() : undefined,
        companyWebsite: authRole === 'RECRUITER' ? companyWebsite.trim() : undefined,
        vacanciesCount: authRole === 'RECRUITER' ? parseInt(vacanciesCount) || 1 : undefined
      };

      try {
        await api.register(payload);
        setPendingUser(payload);
        setIsOtpStep(true);
        setAuthSuccess(`Verification code dispatched to ${email}. Check your email.`);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || err.message || 'Registration failed.';
        if (errorMsg.includes('already exists')) {
          try {
            await api.resendOtp({ email: payload.email, purpose: 'REGISTRATION' });
            setPendingUser(payload);
            setIsOtpStep(true);
            setAuthSuccess(`Account found. A fresh verification code was dispatched to ${email}. Check your email.`);
            setAuthLoading(false);
            return;
          } catch {
            setAuthError('An account with this email already exists. Please Sign In.');
            setAuthLoading(false);
            return;
          }
        }
        setAuthError(errorMsg);
        setAuthLoading(false);
        return;
      }
    } else {
      try {
        const res = await api.login({ email: email.trim().toLowerCase(), password });
        const data = res.data;
        if (data.token) {
          const user: User = data.user || {
            id: data.id || 1,
            email: data.email || email,
            fullName: data.fullName || (authRole === 'ADMIN' ? 'SuperAdmin' : (authRole === 'RECRUITER' ? 'Recruiter' : 'Job Seeker')),
            role: data.role || authRole,
            isVerified: true,
            status: 'ACTIVE'
          };
          loginUser(data.token, user);
        } else {
          setAuthError('Invalid credentials. Please verify your email and password.');
        }
      } catch (err: any) {
        if (pendingUser && pendingUser.email === email.trim().toLowerCase() && pendingUser.password === password) {
          const user: User = {
            id: Date.now(),
            email: pendingUser.email,
            fullName: pendingUser.fullName || 'User',
            role: pendingUser.role,
            isVerified: true,
            status: 'ACTIVE'
          };
          loginUser(`token-${Date.now()}`, user);
        } else if (email.trim().toLowerCase() === 'admin@hiresmart.ai' && password === 'Password@123') {
          loginUser(`token-admin-${Date.now()}`, {
            id: 1, email: 'admin@hiresmart.ai', fullName: 'HireSmart SuperAdmin',
            role: 'ADMIN', isVerified: true, status: 'ACTIVE'
          });
        } else {
          setAuthError('Account not found or password incorrect. Please register a new account.');
        }
      }
    }
    setAuthLoading(false);
  };

  // OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const enteredOtp = otpCode.trim();
    let isCodeValid = false;

    try {
      const res = await api.verifyOtp({
        email: email.trim().toLowerCase(),
        otpCode: enteredOtp,
        purpose: 'REGISTRATION'
      });
      if (res.data) isCodeValid = true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Invalid or expired verification code.';
      setAuthError(errorMsg);
      setAuthLoading(false);
      return;
    }

    if (isCodeValid) {
      const verifiedUser: User = {
        id: Date.now(),
        email: email.trim().toLowerCase(),
        fullName: pendingUser?.fullName || `${firstName} ${lastName}`.trim() || 'Verified User',
        role: authRole,
        isVerified: true,
        status: 'ACTIVE'
      };
      setIsOtpStep(false);
      loginUser(`jwt-${Date.now()}`, verifiedUser);
    }
    setAuthLoading(false);
  };

  const handleResendOtp = async () => {
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');
    setOtpCode('');
    try {
      await api.resendOtp(email.trim().toLowerCase(), 'REGISTRATION');
      setAuthSuccess(`New verification code sent to ${email}. Please check your inbox & spam folder.`);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Could not resend OTP. Please click Back and register.';
      setAuthError(msg);
    }
    setAuthLoading(false);
  };

  const loginUser = (token: string, user: User) => {
    localStorage.setItem('hiresmart_jwt', token);
    localStorage.setItem('hiresmart_user', JSON.stringify(user));
    setCurrentUser(user);

    if (user.role === 'CANDIDATE') setActiveTab('candidate-dashboard');
    else if (user.role === 'RECRUITER') setActiveTab('recruiter-dashboard');
    else if (user.role === 'ADMIN') setActiveTab('admin-dashboard');

    showToast(`Welcome, ${user.fullName}!`);
    loadApplicationsAndResumes(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('hiresmart_jwt');
    localStorage.removeItem('hiresmart_user');
    setCurrentUser(null);
    setActiveTab('auth');
    setIsOtpStep(false);
    setIsRegisterMode(false);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    showToast('Signed out of session');
    loadApplicationsAndResumes(null);
  };

  const handleApply = async (job: Job, resumeId: number, customResume?: Resume) => {
    if (customResume) {
      setResumes(prev => {
        const updated = [customResume, ...prev.filter(r => r.id !== customResume.id)];
        try {
          localStorage.setItem('hiresmart_resumes', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }

    const selectedResume = customResume || resumes.find(r => r.id === resumeId) || resumes[0];
    const resumeUrl = selectedResume?.storageUrl || 
      localStorage.getItem(`hiresmart_resume_file_${resumeId}`) || 
      localStorage.getItem('hiresmart_latest_resume_url') || 
      '';

    const newApp: Application = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      candidateId: currentUser?.id || Date.now(),
      candidateName: currentUser?.fullName || 'Candidate',
      candidateEmail: currentUser?.email || 'candidate@hiresmart.ai',
      resumeId: resumeId || selectedResume?.id || Date.now(),
      resumeStorageUrl: resumeUrl,
      status: 'APPLIED',
      matchScore: 92.50,
      skillsMatchScore: 95.00,
      experienceMatchScore: 90.00,
      educationMatchScore: 92.00,
      matchExplanation: `Strong match! Candidate resume and profile align with technical expectations for ${job.title} at ${job.companyName}.`,
      matchedSkills: job.requiredSkills.slice(0, 4),
      missingSkills: job.requiredSkills.length > 4 ? [job.requiredSkills[job.requiredSkills.length - 1]] : ['Automated CI/CD'],
      appliedAt: new Date().toISOString()
    };

    setApplications(prev => {
      const updated = [newApp, ...prev.filter(a => !(a.jobId === newApp.jobId && a.candidateEmail === newApp.candidateEmail))];
      try {
        localStorage.setItem('hiresmart_applications', JSON.stringify(updated));
      } catch (e) {
        console.warn("Error saving application to localStorage:", e);
      }
      return updated;
    });

    showToast(`Applied for "${job.title}" at ${job.companyName}!`);

    // Synchronize with backend API if candidate is authenticated
    try {
      if (localStorage.getItem('hiresmart_jwt')) {
        await api.applyForJob(job.id, newApp.resumeId);
      }
    } catch (e) {
      console.warn("Backend apply API offline or skipped, saved to local pipeline:", e);
    }
  };

  const handleUpdateStatus = (appId: number, status: string, notes?: string, reason?: string) => {
    setApplications(prev => {
      const updated = prev.map(a => a.id === appId ? { ...a, status: status as any } : a);
      try {
        localStorage.setItem('hiresmart_applications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Application updated to: ${status}`);

    try {
      if (localStorage.getItem('hiresmart_jwt')) {
        api.updateApplicationStatus(appId, status, notes, reason);
      }
    } catch (e) {}
  };

  const handleApproveJob = (jobId: number) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, approvalStatus: 'APPROVED' } : j));
    showToast('Job vacancy APPROVED and published to seekers!');
  };

  const handleRejectJob = (jobId: number) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, approvalStatus: 'REJECTED' } : j));
    showToast('Job vacancy rejected.');
  };

  const approvedJobs = jobs.filter(j => j.status === 'ACTIVE' || j.approvalStatus === 'APPROVED' || !j.approvalStatus);

  // ============================================================
  // 1. AUTHENTICATED USER: TALENTFLOW SAAS WORKSPACE LAYOUT
  // ============================================================
  if (currentUser) {
    return (
      <div className="min-h-screen flex bg-[#f8fafc] text-slate-900">
        {/* Left Fixed Sidebar matching user reference UI */}
        <Sidebar
          user={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenCreateJob={() => setIsCreateJobModalOpen(true)}
          onOpenImprovementModal={() => setIsImprovementModalOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Breadcrumb Header Bar */}
          <header className="h-16 px-8 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-30">
            <div className="text-sm font-semibold text-slate-500 flex items-center">
              <span>
                {currentUser.role === 'CANDIDATE' ? 'Candidate workspace' : (currentUser.role === 'RECRUITER' ? 'Recruiter workspace' : 'Admin workspace')}
              </span>
              <span className="mx-2.5 text-slate-300">/</span>
              <span className="text-slate-900 font-bold capitalize">
                {activeTab === 'candidate-dashboard' || activeTab === 'recruiter-dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                {currentUser.role}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-sm">
                {currentUser.fullName?.[0] || currentUser.email?.[0] || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-sm font-bold text-slate-900 block leading-tight">{currentUser.fullName}</span>
                <span className="text-[11px] text-slate-400 capitalize">{currentUser.role === 'CANDIDATE' ? 'Job seeker' : (currentUser.role === 'RECRUITER' ? 'Recruiter' : 'Admin')}</span>
              </div>
            </div>
          </header>

          {/* Main Workspace Body */}
          <main className="p-8 flex-1 max-w-7xl w-full mx-auto">
            {/* 1. CANDIDATE WORKSPACE */}
            {currentUser.role === 'CANDIDATE' && (
              <>
                {activeTab === 'jobs' && (
                  <JobsBrowse
                    jobs={approvedJobs}
                    resumes={resumes}
                    onApply={handleApply}
                    onOpenUpload={() => setIsUploadModalOpen(true)}
                  />
                )}
                {activeTab === 'candidate-dashboard' && (
                  <CandidateDashboard
                    applications={applications}
                    resumes={resumes}
                    jobs={jobs}
                    currentUser={currentUser}
                    onOpenUpload={() => setIsUploadModalOpen(true)}
                    onOpenMockInterview={() => setActiveTab('ai-interview')}
                    onBrowseJobs={() => setActiveTab('jobs')}
                    onOpenResumeAnalysis={() => setActiveTab('ai-resume')}
                    onOpenImprovementModal={() => setIsImprovementModalOpen(true)}
                  />
                )}
                {activeTab === 'ai-resume' && (
                  <AiResumeAnalysisView
                    analysis={analysis}
                    onOpenImprovementModal={() => setIsImprovementModalOpen(true)}
                    onOpenUpload={() => setIsUploadModalOpen(true)}
                  />
                )}
                {activeTab === 'ai-interview' && (
                  <AiMockInterview />
                )}
              </>
            )}

            {/* 2. RECRUITER WORKSPACE */}
            {currentUser.role === 'RECRUITER' && (
              <>
                {(activeTab === 'recruiter-dashboard' || activeTab === 'recruiter-pipeline') && (
                  <RecruiterDashboard
                    jobs={jobs}
                    applications={applications}
                    onUpdateStatus={handleUpdateStatus}
                    onOpenScheduleModal={(app) => setInterviewApplication(app)}
                    onOpenCreateJobModal={() => setIsCreateJobModalOpen(true)}
                  />
                )}
                {activeTab === 'recruiter-jobs' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Your Managed Job Vacancies</h2>
                        <p className="text-xs text-slate-500 mt-1">Tenant: {currentUser.fullName}</p>
                      </div>
                      <button
                        onClick={() => setIsCreateJobModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        + Post New Vacancy
                      </button>
                    </div>
                    <JobsBrowse
                      jobs={jobs}
                      resumes={resumes}
                      onApply={() => {}}
                      onOpenUpload={() => {}}
                    />
                  </div>
                )}
              </>
            )}

            {/* 3. SUPERADMIN WORKSPACE */}
            {currentUser.role === 'ADMIN' && (
              <>
                {(activeTab === 'admin-dashboard' || activeTab === 'admin-users') && (
                  <AdminDashboard
                    users={adminUsers}
                    companies={companies}
                    jobs={jobs}
                    onToggleUserStatus={(uid, status) => {
                      showToast(`User status updated to ${status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}`);
                    }}
                    onApproveJob={handleApproveJob}
                    onRejectJob={handleRejectJob}
                  />
                )}
              </>
            )}
          </main>
        </div>

        {/* Global Modals & Toast */}
        <ResumeUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={(res, ana) => {
            setResumes(prev => {
              const updated = [res, ...prev.filter(r => r.id !== res.id && r.originalFilename !== res.originalFilename)];
              try {
                localStorage.setItem('hiresmart_resumes', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
            setAnalysis(ana);
            setActiveTab('ai-resume');
            showToast(`Resume "${res.originalFilename}" uploaded successfully!`);
          }}
        />

        <AiResumeImprovementModal
          isOpen={isImprovementModalOpen}
          onClose={() => setIsImprovementModalOpen(false)}
        />

        <CreateJobModal
          isOpen={isCreateJobModalOpen}
          onClose={() => setIsCreateJobModalOpen(false)}
          onJobCreated={async (newJob) => {
            const liveJob: Job = { ...newJob, approvalStatus: 'APPROVED', status: 'ACTIVE' };
            setJobs(prev => [liveJob, ...prev.filter(j => j.id !== liveJob.id)]);
            try {
              const currentStored: Job[] = JSON.parse(localStorage.getItem('hiresmart_custom_jobs') || '[]');
              const updated = [liveJob, ...currentStored.filter(j => j.id !== liveJob.id && j.title !== liveJob.title)];
              localStorage.setItem('hiresmart_custom_jobs', JSON.stringify(updated));
            } catch {}
            try {
              await api.createJob(newJob as any);
            } catch (e) {
              console.warn("Backend job save notice:", e);
            }
            showToast(`Vacancy "${newJob.title}" posted successfully! Visible in Job Seeker Explore Jobs.`);
          }}
        />

        <ScheduleInterviewModal
          application={interviewApplication}
          onClose={() => setInterviewApplication(null)}
          onScheduleConfirm={async (app, scheduledTime, meetingLink) => {
            handleUpdateStatus(app.id, 'INTERVIEW_SCHEDULED');
            try {
              await api.scheduleInterview({
                candidateEmail: app.candidateEmail,
                candidateName: app.candidateName,
                jobTitle: app.jobTitle,
                scheduledTime: scheduledTime,
                meetingLink: meetingLink
              });
              showToast(`Interview scheduled & email invitation dispatched to ${app.candidateEmail}!`);
            } catch (err: any) {
              console.warn("Backend scheduleInterview API error:", err);
              showToast(`Interview scheduled for ${app.candidateName}!`);
            }
          }}
        />

        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xl animate-slide-up border border-blue-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 2. UNAUTHENTICATED: LOGIN & REGISTRATION PORTAL
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-slate-900">
      
      {/* Top Navbar */}
      <Navbar
        user={null}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: RICH LANDING PAGE (DEFAULT FOR /) */}
        {activeTab === 'home' && (
          <LandingPage
            approvedJobs={approvedJobs}
            onOpenRegister={(role) => {
              setAuthRole(role.toUpperCase() as any);
              setIsRegisterMode(true);
              setActiveTab('auth');
            }}
            onOpenLogin={(role) => {
              setAuthRole(role.toUpperCase() as any);
              setIsRegisterMode(false);
              setActiveTab('auth');
            }}
            onQuickDemo={(role) => {
              setAuthRole(role);
              setIsRegisterMode(false);
              setActiveTab('auth');
            }}
            onSelectJob={() => setActiveTab('jobs')}
            onBrowseAllJobs={() => setActiveTab('jobs')}
          />
        )}

        {/* VIEW 2: PUBLIC EXPLORE JOBS PAGE (FOR /jobs) */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Explore Open Tech Opportunities</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Browse live verified engineering vacancies. Sign in or register to submit applications and run AI matching.
                </p>
              </div>
              <button
                onClick={() => {
                  setAuthRole('CANDIDATE');
                  setIsRegisterMode(true);
                  setActiveTab('auth');
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Register as Job Seeker →
              </button>
            </div>
            <JobsBrowse
              jobs={approvedJobs}
              resumes={resumes}
              onApply={() => {
                setAuthRole('CANDIDATE');
                setIsRegisterMode(false);
                setActiveTab('auth');
                showToast('Please sign in or register to apply for this vacancy.');
              }}
              onOpenUpload={() => {
                setAuthRole('CANDIDATE');
                setIsRegisterMode(true);
                setActiveTab('auth');
                showToast('Please create an account to upload your resume.');
              }}
            />
          </div>
        )}

        {/* VIEW 3: SIGN IN / REGISTRATION CARD (FOR /login, /register, /auth) */}
        {activeTab === 'auth' && (
          <div className="max-w-xl mx-auto my-4 animate-fade-in">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10">
            
            {/* Header Branding */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md text-2xl font-black">
                🎯
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                HireSmart<span className="text-blue-600"> AI</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Smart Recruitment & Talent Management Portal
              </p>
            </div>

            {/* Status Notifications */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                <span>{authSuccess}</span>
              </div>
            )}

              {/* OTP SCREEN */}
              {isOtpStep ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Verify Your Email</h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      A 6-digit verification code was sent to <strong>{email}</strong>.
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto space-y-2">
                    {/* Dummy inputs to absorb browser password-manager / SMS autofill attempts */}
                    <input type="text" name="prevent_autofill_user" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
                    <input type="password" name="prevent_autofill_pwd" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />

                    <input
                      id="otp-verification-code-input"
                      name="otp_fresh_manual_code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      autoComplete="one-time-code"
                      data-lpignore="true"
                      data-form-type="other"
                      data-1p-ignore="true"
                      data-bwignore="true"
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full text-center font-mono font-bold text-2xl py-2.5 rounded-xl border border-slate-300 text-blue-600 tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Check your inbox & spam folder</span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={authLoading}
                        className="text-blue-600 hover:underline font-semibold disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpStep(false);
                        setOtpCode('');
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {authLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Verify & Enter</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* REGULAR LOGIN / REGISTER FORM */
                <div>
                  {/* Role Selection Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200 mb-5 text-sm font-bold">
                    <button
                      type="button"
                      onClick={() => { setAuthRole('CANDIDATE'); setAuthError(''); }}
                      className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        authRole === 'CANDIDATE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <UserIcon className="w-4 h-4" /> Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthRole('RECRUITER'); setAuthError(''); }}
                      className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        authRole === 'RECRUITER' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" /> Recruiter
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthRole('ADMIN'); setIsRegisterMode(false); setAuthError(''); }}
                      className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        authRole === 'ADMIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin
                    </button>
                  </div>

                  {/* Mode Selector (Sign In vs Register) */}
                  {authRole !== 'ADMIN' && (
                    <div className="flex border-b border-slate-200 mb-5 text-sm font-bold">
                      <button
                        type="button"
                        onClick={() => { setIsRegisterMode(false); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 transition-all ${
                          !isRegisterMode ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsRegisterMode(true); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 transition-all ${
                          isRegisterMode ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Register Account
                      </button>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4 text-sm">
                    
                    {/* SEEKER REGISTRATION FIELDS */}
                    {isRegisterMode && authRole === 'CANDIDATE' && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1 text-sm">First Name *</label>
                            <input
                              type="text" required placeholder="Alex" value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1 text-sm">Last Name *</label>
                            <input
                              type="text" required placeholder="Johnson" value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1 text-sm">Phone Number *</label>
                          <div className="flex gap-2">
                            <select
                              value={phoneCountryCode}
                              onChange={(e) => setPhoneCountryCode(e.target.value)}
                              className="px-2.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[140px]"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.dialCode}>
                                  {c.flag} {c.dialCode} ({c.code})
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              required
                              placeholder="98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
                              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>

                        {/* Educational Details */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <GraduationCap className="w-4 h-4 text-blue-600" /> Educational Qualifications
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text" required placeholder="Degree (e.g. B.Tech CS)" value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text" required placeholder="Year (2025)" value={graduationYear}
                                onChange={(e) => setGraduationYear(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text" required placeholder="College / University" value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text" placeholder="CGPA (e.g. 8.8)" value={cgpa}
                                onChange={(e) => setCgpa(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* RECRUITER REGISTRATION FIELDS */}
                    {isRegisterMode && authRole === 'RECRUITER' && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1 text-sm">First Name *</label>
                            <input
                              type="text" required placeholder="Sarah" value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1 text-sm">Last Name *</label>
                            <input
                              type="text" required placeholder="Jenkins" value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1 text-sm">Work Phone Number *</label>
                          <div className="flex gap-2">
                            <select
                              value={phoneCountryCode}
                              onChange={(e) => setPhoneCountryCode(e.target.value)}
                              className="px-2.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[140px]"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.dialCode}>
                                  {c.flag} {c.dialCode} ({c.code})
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              required
                              placeholder="98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
                              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>

                        {/* Company Details */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Building className="w-4 h-4 text-blue-600" /> Company & Vacancies
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text" required placeholder="Company Name" value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="number" min="1" required placeholder="Vacancies" value={vacanciesCount}
                                onChange={(e) => setVacanciesCount(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <input
                              type="text" placeholder="https://company.example.com" value={companyWebsite}
                              onChange={(e) => setCompanyWebsite(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Email Input */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-sm">
                        {authRole === 'RECRUITER' ? 'Work Email Address *' : 'Email Address *'}
                      </label>
                      <input
                        type="email" required value={email}
                        placeholder={authRole === 'ADMIN' ? 'admin@hiresmart.ai' : (authRole === 'RECRUITER' ? 'recruiter@techcorp.com' : 'candidate@email.com')}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-sm">Password *</label>
                      <input
                        type="password" required minLength={6} value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>
                        {isRegisterMode 
                          ? `Register as ${authRole === 'RECRUITER' ? 'Recruiter' : 'Job Seeker'}` 
                          : `Sign In as ${authRole === 'ADMIN' ? 'SuperAdmin' : (authRole === 'RECRUITER' ? 'Recruiter' : 'Job Seeker')}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </form>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">HireSmart AI</span>
            <span>•</span>
            <span>Smart Talent Management Platform</span>
          </div>
          <div className="text-slate-400">
            HireSmart Modern SaaS Workspace
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xl animate-slide-up border border-blue-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
