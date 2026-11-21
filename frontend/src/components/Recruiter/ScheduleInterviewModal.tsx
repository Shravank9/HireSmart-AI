import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Mail, CheckCircle2 } from 'lucide-react';
import { Application } from '../../types';

interface ScheduleInterviewModalProps {
  application: Application | null;
  onClose: () => void;
  onScheduleConfirm: (application: Application, scheduledTime: string, meetingLink: string) => Promise<void> | void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  application,
  onClose,
  onScheduleConfirm
}) => {
  if (!application) return null;

  const [date, setDate] = useState('2026-11-25');
  const [time, setTime] = useState('14:00');
  const [interviewType, setInterviewType] = useState('TECHNICAL');
  const [meetingLink, setMeetingLink] = useState(`https://meet.google.com/hms-${Date.now().toString().slice(-6)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullTimestamp = `${date}T${time}:00`;
    try {
      await onScheduleConfirm(application, fullTimestamp, meetingLink);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error scheduling interview:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Talent Pipeline
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Schedule Interview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Candidate: <strong className="text-slate-800">{application.candidateName}</strong> ({application.candidateEmail}) • Position: <strong>{application.jobTitle}</strong>
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900">Interview Invitation Dispatched!</h3>
            <p className="text-xs text-slate-500">
              Notification email sent to {application.candidateEmail} with calendar invite and meeting details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interview Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Interview Stage / Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              >
                <option value="TECHNICAL">Technical Architecture Round</option>
                <option value="SYSTEM_DESIGN">System Design & Scalability</option>
                <option value="BEHAVIORAL">Behavioral & Cultural Fit</option>
                <option value="FINAL_EXECUTIVE">Final Executive Discussion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meeting Room Link
              </label>
              <input
                type="url"
                required
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>An automated branded email invitation will be dispatched to <strong>{application.candidateEmail}</strong>.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Dispatching Invitation...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" /> Send Invitation & Schedule
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
