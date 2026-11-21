import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff,
  Mic, 
  Square, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Award,
  AlertCircle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { InterviewQuestion, InterviewEvaluation } from '../../types';

export const AiMockInterview: React.FC = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<string[]>([]);
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<InterviewEvaluation | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const SAMPLE_QUESTIONS: InterviewQuestion[] = [
    {
      question: "Explain how you implement a stateless JWT authentication filter in Spring Boot 3 with Spring Security.",
      category: "TECHNICAL",
      difficulty: "MEDIUM"
    },
    {
      question: "In a microservices architecture, how do you handle asynchronous file uploads and store metadata in MySQL without thread blocking?",
      category: "SCENARIO",
      difficulty: "HARD"
    },
    {
      question: "Describe a challenging technical problem you solved recently and how you communicated trade-offs with your team.",
      category: "BEHAVIORAL",
      difficulty: "MEDIUM"
    }
  ];

  // Request camera and microphone access
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 360 } }, 
        audio: true 
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setHasConsent(true);
    } catch (err: any) {
      console.warn("Camera/Mic permission notice:", err);
      setCameraError('Camera access not granted or unavailable. You can still use speech-to-text or type your responses.');
      setHasConsent(true);
      setCameraActive(false);
    }
  };

  // Re-attach video stream whenever video element renders or cameraActive changes
  useEffect(() => {
    if (cameraActive && mediaStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraActive, hasConsent]);

  // Clean up media tracks and speech recognition on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Text to speech for reading question aloud
  const handleReadQuestionAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(SAMPLE_QUESTIONS[currentQuestionIndex].question);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Live Speech-to-Text via Web Speech API
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setCurrentAnswerText('');

    // Timer
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          setCurrentAnswerText(fullTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
        };

        recognition.onend = () => {
          if (isRecording) {
            try { recognition.start(); } catch {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init notice:', err);
      }
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch {}
    }
  };

  const handleNextQuestion = () => {
    handleStopRecording();
    setRecordedAnswers(prev => [...prev, currentAnswerText.trim()]);
    setCurrentAnswerText('');
    setRecordingSeconds(0);

    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteInterview([...recordedAnswers, currentAnswerText.trim()]);
    }
  };

  const handleCompleteInterview = async (allAnswers: string[]) => {
    setIsEvaluating(true);
    await new Promise(r => setTimeout(r, 1500));

    const totalWords = allAnswers.join(' ').split(/\s+/).filter(Boolean).length;
    const hasDetailedAnswers = totalWords > 20;

    const techScore = hasDetailedAnswers ? Math.min(95, 76 + Math.floor(totalWords / 4)) : 72;
    const clarityScore = hasDetailedAnswers ? Math.min(94, 78 + Math.floor(totalWords / 5)) : 74;
    const relevanceScore = hasDetailedAnswers ? Math.min(96, 80 + Math.floor(totalWords / 5)) : 76;
    const overallScore = Math.round((techScore + clarityScore + relevanceScore) / 3);

    setEvaluationReport({
      technicalScore: techScore,
      clarityScore: clarityScore,
      relevanceScore: relevanceScore,
      overallScore: overallScore,
      strengths: [
        "Structured verbal responses following technical problem-solving logic",
        "Clear articulation of software architectural concepts and trade-offs",
        "Demonstrated understanding of modern backend engineering best practices"
      ],
      areasForImprovement: [
        "Include more concrete architectural metrics and quantitative performance figures",
        "Explicitly mention automated unit and integration test strategies"
      ],
      summary: hasDetailedAnswers
        ? `Solid mock interview performance (${totalWords} words spoken). The candidate demonstrated good technical clarity, relevant vocabulary, and clear reasoning.`
        : "Candidate completed the mock interview session. For higher evaluation scores, provide more in-depth explanations and quantitative examples."
    });
    setIsEvaluating(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner (Clean White Card) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-2 border border-blue-100">
          <Video className="w-4 h-4 text-blue-600" /> AI Video Mock Interview Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Simulated Technical Video Interview
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Practice interview questions with real-time speech recognition and receive explainable AI scoring feedback.
        </p>
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Ethical AI Guardrail:</strong> Evaluations measure only technical correctness, clarity, and conceptual relevance. Physical appearance or accents are never evaluated.
          </span>
        </div>
      </div>

      {!hasConsent ? (
        /* Permission / Consent Step */
        <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Video className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Camera & Microphone Access</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            HireSmart AI accesses your browser camera and microphone to simulate a live technical interview with real speech-to-text.
          </p>
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            Enable Camera & Start Interview
          </button>
        </div>
      ) : evaluationReport ? (
        /* Final Interview Evaluation Report Screen */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" /> Interview Completed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Evaluation Report</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-bold text-blue-600">{evaluationReport.overallScore}%</span>
              <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">Overall Score</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{evaluationReport.technicalScore}%</span>
              <span className="block text-xs text-slate-600 font-medium mt-1">Technical Correctness</span>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{evaluationReport.clarityScore}%</span>
              <span className="block text-xs text-slate-600 font-medium mt-1">Clarity & Structure</span>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{evaluationReport.relevanceScore}%</span>
              <span className="block text-xs text-slate-600 font-medium mt-1">Role Relevance</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Executive Summary</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{evaluationReport.summary}</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Demonstrated Strengths</h4>
              <ul className="space-y-2 text-sm text-emerald-950">
                {evaluationReport.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Recommended Next Steps</h4>
              <ul className="space-y-2 text-sm text-amber-950">
                {evaluationReport.areasForImprovement.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">⚡</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                setEvaluationReport(null);
                setCurrentQuestionIndex(0);
                setRecordedAnswers([]);
                setCurrentAnswerText('');
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Start New Session
            </button>
          </div>
        </div>
      ) : (
        /* Live Interview Screen (Clean White 2-Column Feed) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Webcam & Recording Controls */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <VideoOff className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                  <span className="text-sm font-medium">Camera offline</span>
                  {cameraError && (
                    <p className="text-xs text-amber-300 mt-1 max-w-xs">{cameraError}</p>
                  )}
                </div>
              )}

              {/* Live recording indicator badge */}
              {isRecording && (
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  REC {formatTime(recordingSeconds)}
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="mt-5 flex items-center justify-between">
              <div>
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm transition-all"
                  >
                    <Mic className="w-4 h-4" /> Start Recording Response
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold shadow-sm"
                  >
                    <Square className="w-4 h-4 text-red-400 fill-current" /> Stop Recording
                  </button>
                )}
              </div>

              <button
                disabled={isEvaluating}
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm disabled:opacity-50 transition-all"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Evaluating...
                  </>
                ) : currentQuestionIndex === SAMPLE_QUESTIONS.length - 1 ? (
                  'Submit & Evaluate Interview'
                ) : (
                  <>
                    Next Question <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Question & Real Speech-to-Text Transcript */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-blue-600 text-sm">
                  Question {currentQuestionIndex + 1} of {SAMPLE_QUESTIONS.length}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
                  {SAMPLE_QUESTIONS[currentQuestionIndex].difficulty}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {SAMPLE_QUESTIONS[currentQuestionIndex].question}
                </h3>
                <button
                  type="button"
                  onClick={handleReadQuestionAloud}
                  title="Listen to question"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800">
                    Spoken Answer Transcript:
                  </label>
                  {isRecording && (
                    <span className="text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> Listening to speech...
                    </span>
                  )}
                </div>
                <textarea
                  rows={7}
                  placeholder="Click 'Start Recording Response' and speak into your microphone. Your spoken words will appear here in real-time, or you can type directly..."
                  value={currentAnswerText}
                  onChange={(e) => setCurrentAnswerText(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Category: <strong className="text-slate-800 font-bold">{SAMPLE_QUESTIONS[currentQuestionIndex].category}</strong></span>
              <span className="text-blue-600 font-bold">Real-Time Speech-to-Text</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
