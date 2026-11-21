import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Briefcase, 
  Building, 
  CheckCircle2, 
  Sparkles, 
  X,
  ChevronRight,
  ShieldCheck,
  Lock,
  UploadCloud,
  FileText,
  Paperclip
} from 'lucide-react';
import { Job, Resume } from '../../types';
import { formatSalaryInr } from '../../utils/currency';

interface JobsBrowseProps {
  jobs: Job[];
  resumes: Resume[];
  onApply: (job: Job, resumeId: number, customResume?: Resume) => void;
  onOpenUpload: () => void;
}

export const JobsBrowse: React.FC<JobsBrowseProps> = ({
  jobs,
  resumes,
  onApply,
  onOpenUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number>(resumes[0]?.id || 1);
  const [hasApplied, setHasApplied] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedResume, setAttachedResume] = useState<Resume | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);

  const ALL_SKILLS = ['All', 'Java 25', 'Spring Boot', 'React.js', 'Python', 'MySQL', 'Docker', 'Microservices'];

  const approvedJobs = useMemo(() => {
    return jobs.filter(j => j.status === 'ACTIVE' || j.approvalStatus === 'APPROVED' || !j.approvalStatus);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return approvedJobs.filter(job => {
      const matchesSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill = selectedSkill === 'All' || 
        job.requiredSkills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()));

      return matchesSearch && matchesSkill;
    });
  }, [approvedJobs, searchQuery, selectedSkill]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsAttaching(true);
      try {
        const fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        const resumeId = Date.now();
        const newResume: Resume = {
          id: resumeId,
          candidateId: 1,
          originalFilename: file.name,
          storageKey: `resumes/cand_1_${resumeId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          storageUrl: fileDataUrl,
          fileSize: file.size,
          contentType: file.type || 'application/pdf',
          extractedText: `Candidate Resume parsed for: ${file.name}`,
          uploadTimestamp: new Date().toISOString()
        };

        try {
          localStorage.setItem(`hiresmart_resume_file_${resumeId}`, fileDataUrl);
          localStorage.setItem('hiresmart_latest_resume_url', fileDataUrl);
          localStorage.setItem('hiresmart_latest_resume_name', file.name);
          const existing = JSON.parse(localStorage.getItem('hiresmart_resumes') || '[]');
          localStorage.setItem('hiresmart_resumes', JSON.stringify([newResume, ...existing.filter((r: any) => r.originalFilename !== file.name)]));
        } catch (storageErr) {}

        setAttachedFile(file);
        setAttachedResume(newResume);
        setSelectedResumeId(newResume.id);
      } catch (err) {
        console.error("Error reading PDF resume:", err);
      } finally {
        setIsAttaching(false);
      }
    }
  };

  const handleApplyClick = () => {
    if (selectedJob) {
      onApply(selectedJob, selectedResumeId, attachedResume || undefined);
      setHasApplied(true);
      setTimeout(() => {
        setSelectedJob(null);
        setHasApplied(false);
        setAttachedFile(null);
        setAttachedResume(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Search Header (Facebook/YouTube clean white style with comfortable medium text) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-2 border border-blue-100">
          <ShieldCheck className="w-4 h-4 text-blue-600" /> Verified Opportunities
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Explore Job Vacancies
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Browse open positions across top engineering companies. Apply directly with your uploaded resume and automated AI matching.
        </p>

        {/* Search Input */}
        <div className="mt-5 relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, skill (Java, Spring Boot, React), location..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder-slate-400 transition-all shadow-sm"
          />
        </div>

        {/* Skill Pills (YouTube style filter pills) */}
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_SKILLS.map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                selectedSkill === sk
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between px-2 text-sm text-slate-600">
        <div>
          Showing <strong className="text-slate-900">{filteredJobs.length}</strong> active job vacancies
          {selectedSkill !== 'All' && <span> for <strong>{selectedSkill}</strong></span>}
        </div>
        <span className="text-xs text-slate-500 font-medium">All Compensation in Indian Rupee (₹ INR)</span>
      </div>

      {/* Jobs Feed Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No Job Postings Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or skill filter to discover matching opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-blue-600 flex items-center gap-1.5 mb-1">
                      <Building className="w-4 h-4 text-blue-600 shrink-0" />
                      {job.companyName}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold whitespace-nowrap">
                    {job.employmentType.replace('_', ' ')}
                  </span>
                </div>

                {/* Location and Salary (Indian Rupee ₹) */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0" /> {formatSalaryInr(job.minSalary, job.maxSalary)}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">{job.experienceLevel}</span>
                <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Details & Apply <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details & Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" /> {selectedJob.companyName}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {selectedJob.title}
              </h2>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
                <span>📍 {selectedJob.location}</span>
                <span>💼 {selectedJob.employmentType.replace('_', ' ')}</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5" /> {formatSalaryInr(selectedJob.minSalary, selectedJob.maxSalary)}
                </span>
              </div>
            </div>

            {/* Verification Banner */}
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Verified Employer
              </span>
              <span className="text-xs text-slate-500">Applications dispatched directly to hiring manager</span>
            </div>

            <div className="mt-6 space-y-5 text-sm text-slate-700">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs mb-2">
                  Job Description & Scope:
                </h4>
                <p className="leading-relaxed whitespace-pre-line text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs mb-2">
                  Target Technical & Core Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Selector & Direct PDF Upload */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs">
                    Attach or Select PDF Resume:
                  </h4>
                  <label className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>+ Upload New PDF File</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {isAttaching ? (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Processing and securing PDF resume...</span>
                  </div>
                ) : attachedFile ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{attachedFile.name}</span>
                        <span className="text-xs text-slate-500">{(attachedFile.size / 1024).toFixed(1)} KB • Attached for this application</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                      </span>
                      <label className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                        Change
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : resumes.length > 0 ? (
                  <div className="space-y-2">
                    {resumes.map((res) => (
                      <label
                        key={res.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedResumeId === res.id
                            ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="resumeSelection"
                            checked={selectedResumeId === res.id}
                            onChange={() => {
                              setSelectedResumeId(res.id);
                              setAttachedFile(null);
                              setAttachedResume(null);
                            }}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <span className="font-bold text-sm block">{res.originalFilename}</span>
                            <span className="text-xs text-slate-500">{(res.fileSize / 1024).toFixed(1)} KB • Verified PDF</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">✓ Ready</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <label className="p-6 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center transition-all group">
                    <UploadCloud className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-sm font-bold text-slate-900">Choose your Resume PDF to apply</span>
                    <span className="text-xs text-slate-500 mt-1">Supports PDF, DOC, DOCX up to 10MB</span>
                    <span className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">
                      Browse PDF File
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedJob(null);
                  setAttachedFile(null);
                  setAttachedResume(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleApplyClick}
                disabled={(!attachedFile && resumes.length === 0) || hasApplied}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" /> Application Submitted!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Submit Application with Verified Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
