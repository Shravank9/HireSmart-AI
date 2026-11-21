import React from 'react';
import { X, Sparkles, Check, ArrowRight, Lightbulb, FileText } from 'lucide-react';

interface AiResumeImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiResumeImprovementModal: React.FC<AiResumeImprovementModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Resume Assistant
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Actionable ATS Resume Enhancements
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare original content with AI-optimized, impact-driven bullet points designed to pass ATS filters.
          </p>
        </div>

        {/* Section 1: Executive Summary Comparison */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            1. Professional Summary Enhancement
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-rose-200 rounded-lg">
              <span className="text-rose-600 font-bold block mb-1">Original Draft:</span>
              <p className="text-slate-600">
                "Experienced backend Java developer with experience in Spring Boot, MySQL, and React building web applications."
              </p>
            </div>
            <div className="p-3 bg-white border border-emerald-200 rounded-lg">
              <span className="text-emerald-600 font-bold block mb-1">AI-Optimized (Higher ATS Match):</span>
              <p className="text-slate-700 font-medium">
                "Results-driven Senior Java 21 Engineer with 5+ years architecting microservices with Spring Boot 3, Spring Security stateless JWT authentication, and MySQL handling 10k req/s."
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Experience Bullets */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            2. Impact & Metrics Optimization
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
              <span className="text-slate-400 line-through block">
                • Built microservices in Java and handled database queries.
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Architected 6 Spring Boot microservices with Spring Data JPA and connection pooling, reducing p99 latency by 38%.
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
              <span className="text-slate-400 line-through block">
                • Handled file uploads in backend services.
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Engineered asynchronous document ingestion pipeline with Apache PDFBox text extraction and automated AI keyword indexing.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
