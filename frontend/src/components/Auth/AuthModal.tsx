import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  KeyRound
} from 'lucide-react';
import { UserRole } from '../../types';
import { api } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'candidate' | 'recruiter' | 'admin';
  defaultMode?: 'login' | 'register';
  onLoginSuccess: (data: { token: string; user: any }) => void;
  onQuickDemoLogin: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'candidate',
  defaultMode = 'login',
  onLoginSuccess,
  onQuickDemoLogin
}) => {
  // Tabs: 'candidate' | 'recruiter' | 'admin'
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | 'admin'>(defaultRole);
  const [isRegisterMode, setIsRegisterMode] = useState(defaultMode === 'register');

  // Common Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Job Seeker Educational Fields
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [cgpa, setCgpa] = useState('');

  // Recruiter Specific Fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [vacanciesCount, setVacanciesCount] = useState('');

  // OTP Verification Step
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  // Forgot Password Flow
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');

  // Loading & Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync defaultRole / defaultMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole);
      setIsRegisterMode(defaultMode === 'register');
      setIsOtpStep(false);
      setIsForgotPassword(false);
      setErrorMsg('');
      setSuccessMsg('');
      setOtpCode('');
      setOtpError('');
      setForgotOtp('');
      setNewPassword('');
      setForgotStep('email');
    }
  }, [isOpen, defaultRole, defaultMode]);

  if (!isOpen) return null;

  // ============================================================
  // SUBMIT: Login or Register
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const role = selectedRole === 'admin' ? 'ADMIN' : selectedRole === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';

    if (isRegisterMode) {
      // ---- REGISTER ----
      const payload = {
        email,
        password,
        firstName: firstName || 'User',
        lastName: lastName || '',
        phone,
        role,
        degree: selectedRole === 'candidate' ? degree : undefined,
        institution: selectedRole === 'candidate' ? institution : undefined,
        graduationYear: selectedRole === 'candidate' ? graduationYear : undefined,
        cgpa: selectedRole === 'candidate' ? cgpa : undefined,
        companyName: selectedRole === 'recruiter' ? companyName : undefined,
        companyWebsite: selectedRole === 'recruiter' ? companyWebsite : undefined,
        industry: selectedRole === 'recruiter' ? industry : undefined,
        vacanciesCount: selectedRole === 'recruiter' ? parseInt(vacanciesCount) || 1 : undefined
      };

      try {
        await api.register(payload);
        setPendingEmail(email);
        setIsOtpStep(true);
        setSuccessMsg('Registration successful! Check your email for the 6-digit OTP code.');
      } catch (err: any) {
        setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } else {
      // ---- LOGIN ----
      try {
        const res = await api.login({ email, password });
        const data = res.data;
        // Backend returns { token, user } or { token, id, email, fullName, role, ... }
        if (data.token) {
          const user = data.user || {
            id: data.id,
            email: data.email,
            fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
            isVerified: data.isVerified ?? true,
            status: data.status || 'ACTIVE'
          };
          onLoginSuccess({ token: data.token, user });
          onClose();
        } else {
          setErrorMsg('Unexpected response from server.');
        }
      } catch (err: any) {
        const msg = err.response?.data?.error || err.response?.data?.message || '';
        if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('otp')) {
          // User exists but not verified — send to OTP step
          setPendingEmail(email);
          setIsOtpStep(true);
          setSuccessMsg('Your account is not yet verified. Enter the OTP code sent to your email.');
        } else {
          setErrorMsg(msg || 'Login failed. Check your credentials.');
        }
      }
    }
    setIsLoading(false);
  };

  // ============================================================
  // VERIFY OTP
  // ============================================================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsLoading(true);

    try {
      const res = await api.verifyOtp({
        email: pendingEmail || email,
        otpCode,
        purpose: 'REGISTRATION'
      });
      const data = res.data;
      if (data.token) {
        const user = data.user || {
          id: data.id, email: data.email,
          fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          role: data.role, isVerified: true, status: data.status || 'ACTIVE'
        };
        onLoginSuccess({ token: data.token, user });
        onClose();
      } else {
        // OTP verified but no auto-login — show success and go to login
        setIsOtpStep(false);
        setIsRegisterMode(false);
        setSuccessMsg('Email verified! You can now sign in.');
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.error || 'Invalid OTP. For demo, enter 123456.');
    }
    setIsLoading(false);
  };

  // ============================================================
  // RESEND OTP
  // ============================================================
  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      await api.resendOtp(pendingEmail || email, 'REGISTRATION');
      setSuccessMsg('New OTP code sent to your email!');
    } catch (err: any) {
      setOtpError(err.response?.data?.error || 'Failed to resend OTP.');
    }
    setIsLoading(false);
  };

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================
  const handleForgotSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await api.forgotPassword(email);
      setForgotStep('reset');
      setSuccessMsg('Password reset code sent to your email!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Could not send reset code. Check your email.');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await api.resetPassword({ email, otpCode: forgotOtp, newPassword });
      setIsForgotPassword(false);
      setForgotStep('email');
      setSuccessMsg('Password reset successfully! You can now sign in with your new password.');
      setIsRegisterMode(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Password reset failed. Check OTP code.');
    }
    setIsLoading(false);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 text-white font-black text-xl shadow-lg shadow-indigo-500/25">
            🎯
          </div>
          <h2 className="text-2xl font-black text-white">
            HireSmart AI Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your account type to continue with role-specific access
          </p>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Logins for Hackathon Judges */}
        <div className="mb-5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-2">
            ⚡ 1-Click Instant Demo Access (No typing needed)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onQuickDemoLogin('CANDIDATE')}
              className="py-1.5 px-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold shadow-sm"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => onQuickDemoLogin('RECRUITER')}
              className="py-1.5 px-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-[11px] font-bold shadow-sm"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => onQuickDemoLogin('ADMIN')}
              className="py-1.5 px-2 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-white text-[11px] font-bold shadow-sm"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FORGOT PASSWORD FLOW                                        */}
        {/* ============================================================ */}
        {isForgotPassword ? (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {forgotStep === 'email' ? 'Reset Your Password' : 'Enter New Password'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {forgotStep === 'email'
                  ? 'Enter your registered email to receive a reset code.'
                  : 'Enter the code sent to your email and your new password.'}
              </p>
            </div>

            {forgotStep === 'email' ? (
              <form onSubmit={handleForgotSendCode} className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 text-xs">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button type="button" onClick={() => { setIsForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">
                    Back to Login
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md disabled:opacity-50 flex items-center gap-2">
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Send Reset Code
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 text-xs">Reset Code (OTP) *</label>
                  <input
                    type="text" maxLength={6} required value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter 6-digit code (demo: 123456)"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 text-xs">New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password" required minLength={6} value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button type="button" onClick={() => setForgotStep('email')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md disabled:opacity-50 flex items-center gap-2">
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : isOtpStep ? (
          /* ============================================================ */
          /* OTP VERIFICATION STEP                                       */
          /* ============================================================ */
          <div className="space-y-4 animate-fade-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
              <Mail className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white">Verify Your Email (Brevo OTP)</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We dispatched a 6-digit verification code to <strong>{pendingEmail || email}</strong> via Brevo SMTP.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
              <div className="max-w-xs mx-auto">
                <input
                  type="text" maxLength={6} required
                  placeholder="Enter 6-digit OTP (e.g. 123456)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-3 rounded-xl bg-slate-950 border border-slate-700 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {otpError && (
                  <p className="text-xs text-red-400 mt-2 font-medium">{otpError}</p>
                )}
                <p className="text-[11px] text-slate-500 mt-2">
                  Please check your email inbox and spam folder for the code.
                </p>
              </div>

              {selectedRole === 'recruiter' && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Admin Verification Policy:</strong> After OTP verification, your company credentials and job vacancies will be reviewed by the HireSmart Admin before your posts become visible to job seekers.
                  </span>
                </div>
              )}

              <div className="flex gap-2 justify-center pt-2">
                <button type="button" onClick={() => { setIsOtpStep(false); setOtpError(''); setSuccessMsg(''); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">
                  Back
                </button>
                <button type="button" onClick={handleResendOtp} disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50">
                  Resend OTP
                </button>
                <button type="submit" disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-2">
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm & Complete Registration
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================ */
          /* ROLE SELECTOR & LOGIN/REGISTER FORM                         */
          /* ============================================================ */
          <div>
            {/* Account Type Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-5 text-xs font-bold">
              <button type="button" onClick={() => setSelectedRole('candidate')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'candidate' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}>
                <User className="w-3.5 h-3.5" /> Job Seeker
              </button>
              <button type="button" onClick={() => setSelectedRole('recruiter')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'recruiter' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}>
                <Briefcase className="w-3.5 h-3.5" /> Recruiter
              </button>
              <button type="button" onClick={() => { setSelectedRole('admin'); setIsRegisterMode(false); }}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'admin' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}>
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            </div>

            {/* Login vs Register Toggle (Not shown for Admin) */}
            {selectedRole !== 'admin' && (
              <div className="flex justify-center gap-4 mb-4 text-xs font-bold">
                <button type="button" onClick={() => { setIsRegisterMode(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`pb-1 border-b-2 transition-all ${
                    !isRegisterMode ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'
                  }`}>
                  Sign In to Account
                </button>
                <button type="button" onClick={() => { setIsRegisterMode(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`pb-1 border-b-2 transition-all ${
                    isRegisterMode ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'
                  }`}>
                  Create New Account
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {/* ======================================================== */}
              {/* 1. JOB SEEKER (CANDIDATE) REGISTRATION FIELDS             */}
              {/* ======================================================== */}
              {selectedRole === 'candidate' && isRegisterMode && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">First Name *</label>
                      <input type="text" required placeholder="e.g. Alex" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Last Name *</label>
                      <input type="text" required placeholder="e.g. Johnson" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="tel" required placeholder="+1 (555) 234-5678" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  {/* Educational Details Section */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-400" /> Educational Qualifications
                    </span>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-0.5">Degree / Branch</label>
                        <input type="text" required placeholder="e.g. B.Tech / B.S. CS" value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-0.5">Graduation Year</label>
                        <input type="text" required placeholder="2025" value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-0.5">College / University</label>
                        <input type="text" required placeholder="e.g. UC Berkeley" value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-0.5">CGPA / Score</label>
                        <input type="text" placeholder="e.g. 8.8 / 10 or 3.8 / 4.0" value={cgpa}
                          onChange={(e) => setCgpa(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* 2. RECRUITER REGISTRATION FIELDS                          */}
              {/* ======================================================== */}
              {selectedRole === 'recruiter' && isRegisterMode && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">First Name *</label>
                      <input type="text" required placeholder="e.g. Sarah" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Last Name *</label>
                      <input type="text" required placeholder="e.g. Jenkins" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Work Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="tel" required placeholder="+1 (555) 876-5432" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>

                  {/* Company & Hiring Details */}
                  <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-purple-400" /> Company & Hiring Vacancy Requirements
                    </span>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-0.5">Company Name *</label>
                        <input type="text" required placeholder="e.g. Acme Tech" value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-0.5">Planned Vacancies</label>
                        <input type="number" min="1" required placeholder="e.g. 5" value={vacanciesCount}
                          onChange={(e) => setVacanciesCount(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] mb-0.5">Company Website *</label>
                      <input type="url" required placeholder="https://company.com" value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs" />
                    </div>
                  </div>

                  {/* Notice about privacy & admin approval */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p className="text-purple-300 font-semibold flex items-center gap-1">
                      🛡️ Privacy & Approval Policy:
                    </p>
                    <p>
                      1. Your personal name/phone will <strong>never</strong> be displayed to job seekers. They only see your company profile.
                    </p>
                    <p>
                      2. Job postings will enter a <strong>Pending Admin Approval</strong> state until verified.
                    </p>
                  </div>
                </>
              )}

              {/* Email & Password (Common to all roles) */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  {selectedRole === 'recruiter' ? 'Official Work Email *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email" required
                    placeholder={selectedRole === 'admin' ? 'admin@hiresmart.ai' : (selectedRole === 'recruiter' ? 'recruiter@company.com' : 'candidate@email.com')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password" required placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {/* Forgot Password Link */}
                {!isRegisterMode && (
                  <button type="button" onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                    className="mt-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold">
                    Forgot Password?
                  </button>
                )}
              </div>

              {selectedRole === 'admin' && (
                <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/20 text-pink-300 text-[11px]">
                  🔒 <strong>SuperAdmin Portal:</strong> Use verified master credentials to review recruiters, approve job vacancies, and manage platform security.
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-transform active:scale-98 mt-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {isRegisterMode 
                    ? `Register as ${selectedRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'}` 
                    : `Sign In as ${selectedRole === 'admin' ? 'SuperAdmin' : (selectedRole === 'recruiter' ? 'Recruiter' : 'Job Seeker')}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
