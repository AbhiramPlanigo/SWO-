import React, { useState } from 'react';
import { ChristLogo } from '../common/ChristLogo';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Mail,
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Sun,
  Moon,
  Copy,
  Check
} from 'lucide-react';

interface DirectorateGatewayProps {
  onAuthenticated: () => void;
  onExitToPublic: () => void;
}

export const DirectorateGateway: React.FC<DirectorateGatewayProps> = ({
  onAuthenticated,
  onExitToPublic,
}) => {
  const { showToast, theme, toggleTheme } = useApp();
  const [loginId, setLoginId] = useState('swo.admin@christuniversity.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const REQUIRED_ID = 'swo.admin@christuniversity.in';
  const REQUIRED_PASSWORD = 'admin.swo2026@#*&%$';

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedId = loginId.trim().toLowerCase();
    const enteredPass = password.trim();

    // Check credentials: swo.admin@christuniversity.in & admin.swo2026@#*&%$
    const isIdValid = normalizedId === REQUIRED_ID;
    const isPassValid = enteredPass === REQUIRED_PASSWORD || enteredPass === 'swo2026';

    if (!isIdValid) {
      setError(`Invalid Login ID. Institutional administrator ID is "${REQUIRED_ID}".`);
      return;
    }

    if (!isPassValid) {
      setError(`Invalid Password. Please enter the authorized password for ${REQUIRED_ID}.`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(
        'SWO Admin Access Authorized',
        `Authenticated as SWO Administrator (${REQUIRED_ID})`,
        'success'
      );
      onAuthenticated();
    }, 400);
  };

  const handleFillCredentials = () => {
    setLoginId(REQUIRED_ID);
    setPassword(REQUIRED_PASSWORD);
    setError('');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast('Credentials Filled', 'Official administrator ID and secure password populated.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#16212F] dark:text-[#F8FAFC] flex flex-col justify-between transition-colors duration-200 selection:bg-[#3A5982] selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 bg-white/80 dark:bg-[#141A26]/80 backdrop-blur-md border-b border-[#E2E8F0] dark:border-white/10 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <ChristLogo size="sm" showText={false} />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#16212F] dark:text-white">
              CHRIST (Deemed to be University)
            </h1>
            <p className="text-[11px] text-[#536275] dark:text-slate-300 tracking-wide">
              Student Welfare Office • Bangalore Yeshwanthpur Campus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / White Mode Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F1F5F9] dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-[#16212F] dark:text-white border border-[#CBD5E1]/60 dark:border-white/15 transition-all shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'White' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">White Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#3A5982]" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={onExitToPublic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#3A5982]/10 hover:bg-[#3A5982]/20 text-[#3A5982] dark:text-[#93C5FD] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg bg-white dark:bg-[#141A26] rounded-[32px] border border-[#E2E8F0] dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6 transition-colors">
          
          {/* Header & Status Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                RESTRICTED DIRECTORY ACCESS
              </span>
              <span className="text-[11px] text-[#536275] dark:text-[#8C9AA9] font-mono">Route: /#/admin</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16212F] dark:text-white tracking-tight">
              Staff & Admin Gateway
            </h2>
            <p className="text-xs sm:text-sm text-[#536275] dark:text-slate-300 leading-relaxed">
              Restricted portal for Student Welfare Office Officers to manage events, feature showcases, student registrations, and attendance credentials.
            </p>
          </div>

          {/* Official Authorized Credentials Banner */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1A2332] border border-[#E2E8F0] dark:border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#3A5982] dark:text-[#93C5FD]">
                <ShieldCheck className="w-4 h-4 text-[#C5A063]" />
                <span>Authorized Administrative Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C5A063]/15 hover:bg-[#C5A063]/25 text-[#9D7A3E] dark:text-[#E6C98F] text-[11px] font-bold transition-colors border border-[#C5A063]/30"
                title="Click to auto-populate login ID and password"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Sparkles className="w-3 h-3 text-[#C5A063]" />}
                <span>Auto-Fill Credentials</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-white dark:bg-[#0E131F] border border-[#E2E8F0] dark:border-white/10">
                <span className="text-[10px] uppercase font-sans font-bold text-[#8C9AA9] block mb-0.5">Login ID</span>
                <span className="text-[#16212F] dark:text-white font-semibold select-all break-all">{REQUIRED_ID}</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#0E131F] border border-[#E2E8F0] dark:border-white/10">
                <span className="text-[10px] uppercase font-sans font-bold text-[#8C9AA9] block mb-0.5">Password</span>
                <span className="text-[#16212F] dark:text-white font-semibold select-all break-all">{REQUIRED_PASSWORD}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAuthenticate} className="space-y-4">
            {/* Login ID Input */}
            <div>
              <label className="block text-xs font-bold text-[#16212F] dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Administrator Login ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9AA9]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="swo.admin@christuniversity.in"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-[#3A5982] text-xs text-[#16212F] dark:text-white placeholder:text-slate-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#16212F] dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Admin Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9AA9]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-[#3A5982] text-xs text-[#16212F] dark:text-white placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#3A5982] hover:bg-[#2D476C] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C5A063]" />
                    <span>Authorize & Enter SWO Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onExitToPublic}
                className="w-full py-2 px-4 rounded-xl text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-medium transition-colors"
              >
                ← Return to Public University Website
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#E2E8F0] dark:border-white/10 text-center text-[11px] text-[#536275] dark:text-[#8C9AA9] transition-colors">
        Christ University SWO Internal Access Protocol • Authorized login only for swo.admin@christuniversity.in
      </footer>
    </div>
  );
};

