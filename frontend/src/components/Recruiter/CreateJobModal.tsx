import React, { useState } from 'react';
import { X, PlusCircle, Briefcase, IndianRupee, MapPin, Sparkles } from 'lucide-react';
import { Job } from '../../types';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (job: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Engineering');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bengaluru, Karnataka / Remote');
  const [employmentType, setEmploymentType] = useState<Job['employmentType']>('FULL_TIME');
  const [experienceLevel, setExperienceLevel] = useState('Senior (4+ years)');
  const [minSalary, setMinSalary] = useState('1200000');
  const [maxSalary, setMaxSalary] = useState('2000000');
  const [skillsInput, setSkillsInput] = useState('Java, Spring Boot, MySQL, Docker, REST APIs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const newJob: Job = {
      id: Date.now(),
      title,
      department,
      description,
      location,
      employmentType,
      experienceLevel,
      minSalary: parseFloat(minSalary) || 1000000,
      maxSalary: parseFloat(maxSalary) || 1800000,
      currency: 'INR',
      requiredSkills: skills.length > 0 ? skills : ['Java', 'Spring Boot', 'REST APIs'],
      status: 'ACTIVE',
      approvalStatus: 'APPROVED',
      companyId: 1,
      companyName: 'TechCorp Innovations',
      postedAt: new Date().toISOString()
    };

    onJobCreated(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <PlusCircle className="w-4 h-4 text-blue-600" /> Recruiter Studio
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            Create New Job Posting
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Post a new vacancy. It will immediately be published live for all Job Seekers to view and apply.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Java Spring Boot Microservices Architect"
              className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              >
                <option value="FULL_TIME">Full-Time</option>
                <option value="PART_TIME">Part-Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Experience Level
              </label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" /> Min Annual Salary (₹ INR)
              </label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="e.g. 1200000 (12 LPA)"
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                Approx: ₹{(parseFloat(minSalary || '0') / 100000).toFixed(1)} LPA
              </span>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" /> Max Annual Salary (₹ INR)
              </label>
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="e.g. 2000000 (20 LPA)"
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                Approx: ₹{(parseFloat(maxSalary || '0') / 100000).toFixed(1)} LPA
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Java, Spring Boot, MySQL, Docker, React"
              className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Job Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail responsibilities, team tech stack, key deliverables, and requirements..."
              className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Publish Job Vacancy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
