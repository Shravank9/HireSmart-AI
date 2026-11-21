export type UserRole = 'ADMIN' | 'RECRUITER' | 'CANDIDATE';

export interface User {
  id: number;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  avatarUrl?: string;
}

export interface EducationDetail {
  degree: string;
  institution: string;
  graduationYear: string;
  cgpa?: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  description: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  experienceLevel: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  requiredSkills: string[];
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'; // Admin verification status
  companyId: number;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  postedAt: string;
  vacanciesCount?: number;
  // Note: Recruiter personal name/phone are strictly hidden from job seekers for privacy
}

export interface Resume {
  id: number;
  candidateId: number;
  originalFilename: string;
  storageKey: string;
  storageUrl: string;
  fileSize: number;
  contentType: string;
  extractedText: string;
  uploadTimestamp: string;
}

export interface ResumeAnalysis {
  candidateName: string;
  contactInfo: string;
  summary: string;
  technicalSkills: string[];
  softSkills: string[];
  educationSummary: string;
  experienceSummary: string;
  strengths: string[];
  gapsMissingInfo: string[];
  suggestedImprovements: string[];
  potentialJobRoles: string[];
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  resumeId: number;
  resumeStorageUrl: string;
  status: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED';
  matchScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  matchExplanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  appliedAt: string;
}

export interface InterviewQuestion {
  question: string;
  category: 'TECHNICAL' | 'CODING' | 'HR' | 'SCENARIO';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sampleAnswer?: string;
}

export interface InterviewEvaluation {
  technicalScore: number;
  clarityScore: number;
  relevanceScore: number;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
}

export interface Company {
  id: number;
  name: string;
  website: string;
  description: string;
  industry: string;
  location: string;
  logoUrl?: string;
  approvalStatus?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
}
