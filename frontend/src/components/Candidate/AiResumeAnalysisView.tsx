import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  FileText,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { ResumeAnalysis } from '../../types';

interface AiResumeAnalysisViewProps {
  analysis: ResumeAnalysis | null;
  onOpenImprovementModal: () => void;
  onOpenUpload: () => void;
}

export const AiResumeAnalysisView: React.FC<AiResumeAnalysisViewProps> = ({
  analysis,
  onOpenImprovementModal,
  onOpenUpload
}) => {
  if (!analysis) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
        <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No AI Resume Analysis Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
          Upload your PDF resume to generate an instant AI breakdown of technical competencies, strengths, missing credentials, and matched roles.
        </p>
        <button
          onClick={onOpenUpload}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          Upload Resume PDF
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Explainable AI Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Resume Analysis: {analysis.candidateName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            {analysis.contactInfo} • Apache PDFBox parsed plain text analyzed by HireSmart AI NLP Engine.
          </p>
        </div>

        <button
          onClick={onOpenImprovementModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors active:scale-95"
        >
          <Lightbulb className="w-4 h-4" /> View AI Optimization Recommendations
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Professional Executive Profile
        </h3>
        <p className="text-sm text-slate-800 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* 2-Column Grid: Technical Skills & Soft Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Extracted Technical Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.technicalSkills.map((sk, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Soft Skills & Leadership</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.softSkills.map((sk, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Missing Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {analysis.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Identified Gaps & Missing Info</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {analysis.gapsMissingInfo.map((gap, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Matched Roles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Recommended Job Roles</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {analysis.potentialJobRoles.map((role, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-xs text-slate-800">
              {role}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
