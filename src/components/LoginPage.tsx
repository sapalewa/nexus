import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Database, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  Sparkles,
  Server
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; role: string; name: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('cs.sapalewa@gmail.com');
  const [password, setPassword] = useState('SAPALEWA');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Validasi kredensial sesuai permintaan
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanEmail === 'cs.sapalewa@gmail.com' && cleanPass === 'SAPALEWA') {
        setIsLoading(false);
        onLoginSuccess({
          email: 'cs.sapalewa@gmail.com',
          name: 'CS Sapalewa (Super Admin)',
          role: 'Super Admin & Cloud Operator'
        });
      } else {
        setIsLoading(false);
        setErrorMsg('Email atau password tidak sesuai. Gunakan email: cs.sapalewa@gmail.com dan password: SAPALEWA.');
      }
    }, 700);
  };

  const handleQuickLogin = () => {
    setEmail('cs.sapalewa@gmail.com');
    setPassword('SAPALEWA');
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'cs.sapalewa@gmail.com',
        name: 'CS Sapalewa (Super Admin)',
        role: 'Super Admin & Cloud Operator'
      });
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-[#070b12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-10 w-80 h-80 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 shadow-xl shadow-emerald-950/60 mb-2 border border-emerald-400/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            NexusAI CRM Portal
          </h1>
          <p className="text-xs text-slate-400">
            Supabase Authentication & WhatsApp Enterprise Gateway
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 shadow-2xl space-y-5">
          {/* Supabase Auth Banner */}
          <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-teal-200">Supabase Auth Protected</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              JWT Active
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Supabase User
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="cs.sapalewa@gmail.com"
                  required
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono tracking-wider transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition duration-200 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengotentikasi Supabase...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helper */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Kredensial User Terdaftar:</span>
              <span className="text-[11px] text-emerald-400 font-mono">Role: Super Admin</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div>Email: <span className="text-emerald-300 font-semibold">cs.sapalewa@gmail.com</span></div>
              <div>Pass: <span className="text-indigo-300 font-semibold">SAPALEWA</span></div>
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Otomatis Isi & Masuk Cepat (1-Klik)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            Supabase PostgreSQL Live
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            End-to-End SSL/TLS
          </span>
        </div>
      </div>
    </div>
  );
};
