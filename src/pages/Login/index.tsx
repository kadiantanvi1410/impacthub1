import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  ArrowLeft,
  RotateCcw,
  Fingerprint,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Button } from '../../components/ui/Button';

export function Login() {
  const navigate = useNavigate();
  const { service, organization } = useImpactData();

  // Mode: 'credentials' -> 'email_otp' -> 'success'
  const [step, setStep] = useState<'credentials' | 'email_otp' | 'success'>('credentials');

  // Credentials State
  const [email, setEmail] = useState('tanvi@hopefoundation.org');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['8', '4', '9', '2', '0', '1']);
  const [demoCode, setDemoCode] = useState('849201');
  const [resendTimer, setResendTimer] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'email_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle Credentials Submit
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your administrator email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = service.requestAdminOtp(email);
      setDemoCode(res.demoCode);
      setIsLoading(false);
      setStep('email_otp');
      setResendTimer(45);
    }, 700);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasted string
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(5, pasted.length - 1)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill demo OTP
  const handleAutoFillDemoCode = () => {
    setOtp(['8', '4', '9', '2', '0', '1']);
    setErrorMsg('');
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const verified = service.verifyAdminEmailOtp(email, fullCode);
      setIsLoading(false);

      if (verified) {
        setStep('success');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });

        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setErrorMsg('Invalid verification code. Please try again or use the demo code.');
      }
    }, 800);
  };

  // One-click demo login as Admin Tanvi
  const handleOneClickAdminLogin = () => {
    setEmail('tanvi@hopefoundation.org');
    setPassword('adminSecurePass2026!');
    setIsLoading(true);
    setTimeout(() => {
      service.verifyAdminEmailOtp('tanvi@hopefoundation.org', '849201');
      setIsLoading(false);
      setStep('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center relative overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      {/* Background Graphic Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* LEFT COLUMN: Visual Brand Showcase (Desktop) */}
          <div className="lg:col-span-6 p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
            <div>
              {/* Logo & Platform Tag */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-brand-900/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    ImpactHub
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Admin
                    </span>
                  </span>
                  <p className="text-xs text-slate-400">
                    {organization.name} • Executive Workspace
                  </p>
                </div>
              </div>

              {/* Title & Narrative */}
              <div className="mt-10 space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  High-Security Governance & Impact Management
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Unified administrative control for non-profit operations, real-time donor ledgers, 80G tax exemptions, and verified field milestones.
                </p>
              </div>

              {/* Verified Trust Stats Floating Cards */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audited Funds</span>
                  </div>
                  <p className="text-lg font-bold text-white">₹12.8L Raised</p>
                  <p className="text-[11px] text-slate-400">Section 80G & 12A Certified</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>2-Factor Auth</span>
                  </div>
                  <p className="text-lg font-bold text-white">Email Verified</p>
                  <p className="text-[11px] text-slate-400">Encrypted Admin Token</p>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Tanvi"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/40"
                />
                <div>
                  <p className="text-xs font-bold text-white">Tanvi</p>
                  <p className="text-[11px] text-slate-400">
                    Executive Director & Lead Administrator
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic mt-2.5 leading-relaxed">
                &ldquo;ImpactHub brings our donors, projects, and field teams into one transparent, beautifully governed workspace.&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Authentication Box */}
          <div className="lg:col-span-6 p-8 sm:p-12 bg-white text-slate-900 flex flex-col justify-between">
            <div>
              {/* Step 1: Credentials Form */}
              {step === 'credentials' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                        Admin Credentials
                      </span>
                      <button
                        type="button"
                        onClick={handleOneClickAdminLogin}
                        className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 bg-brand-50 hover:bg-brand-100/70 border border-brand-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Click to instantly sign in as Admin Tanvi"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                        <span>1-Click Login (Tanvi)</span>
                      </button>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
                      Sign in to ImpactHub
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your administrator credentials to proceed to two-step email verification.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Administrator Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tanvi@hopefoundation.org"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors font-medium text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password *
                        </label>
                        <span className="text-xs text-brand-700 font-semibold cursor-pointer hover:underline">
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors text-slate-900"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember me checkbox */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <span>Remember this device for 30 days</span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full font-bold shadow-md shadow-brand-600/20 py-3"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continue to Email Verification
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: 2-Step Email Verification (OTP) */}
              {step === 'email_otp' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <button
                      onClick={() => setStep('credentials')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-3 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to credentials</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-emerald-600" />
                        Step 2: Email Verification
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                      Enter 6-Digit Email Code
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      We sent a secure single-use authentication code to:
                      <br />
                      <strong className="text-slate-900 font-semibold">{email}</strong>
                    </p>
                  </div>

                  {/* Demo Code Banner Helper */}
                  <div className="p-3 bg-brand-50/80 border border-brand-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-800 block">
                        Verified Admin Access Code
                      </span>
                      <span className="font-mono font-bold text-brand-900 text-sm tracking-wider">
                        {demoCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillDemoCode}
                      className="px-2.5 py-1 bg-white hover:bg-brand-100/60 text-brand-700 font-bold rounded-lg border border-brand-200 text-[11px] transition-colors shadow-2xs cursor-pointer"
                    >
                      Auto-Fill Code
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {/* 6 Digit Input Grid */}
                    <div className="flex justify-between gap-2 sm:gap-2.5">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-2 border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-xl focus:outline-none transition-all text-slate-900"
                        />
                      ))}
                    </div>

                    {/* Resend Timer */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Didn&apos;t receive code?</span>
                      {resendTimer > 0 ? (
                        <span className="font-medium text-slate-400">
                          Resend code in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setResendTimer(45);
                            service.requestAdminOtp(email);
                            alert(`New authentication code sent to ${email}`);
                          }}
                          className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resend Code</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full font-bold shadow-md shadow-brand-600/20 py-3"
                      >
                        Verify Email & Launch Workspace
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Success Screen */}
              {step === 'success' && (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Authenticated as Admin Tanvi
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Identity verified via two-factor cryptographic token. Redirecting to your executive operations dashboard...
                  </p>
                  <div className="flex justify-center pt-2">
                    <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Security Footer */}
            <div className="pt-6 mt-8 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                256-bit TLS Encryption
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                Hope Foundation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
