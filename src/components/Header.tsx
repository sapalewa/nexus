import React from 'react';
import { ShieldCheck, Phone, Activity, Sparkles, Radio, LogOut, UserCheck, Zap } from 'lucide-react';
import { SystemConfig } from '../types/crm';

interface HeaderProps {
  config: SystemConfig;
  onOpenInbox: () => void;
  onOpenSettings: () => void;
  onOpenInfra: () => void;
  currentUser: { email: string; name: string; role: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  config, 
  onOpenInbox, 
  onOpenSettings,
  onOpenInfra,
  currentUser,
  onLogout
}) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left indicator */}
      <div className="flex items-center gap-3">
        {/* Infra Status Button */}
        <button
          onClick={onOpenInfra}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-xs font-semibold text-teal-300 transition"
          title="Buka Panel Monitoring Infrastruktur"
        >
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Status Infrastruktur:</span>
          <span className="text-teal-300 font-mono text-[11px] font-semibold">
            Monitor Aktif
          </span>
        </button>

        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Webhook:</span>
          <span className="font-mono text-white text-[11px] font-semibold">/api/webhook/whatsapp</span>
        </div>

        <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin WA:</span>
          <span className="font-mono font-semibold text-amber-300">+{config.admin_phone_number}</span>
        </div>
      </div>

      {/* Right Quick Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenInbox}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition active:scale-95"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Uji Webhook & Pesan Masuk</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          title="Buka Pengaturan API & Webhook"
        >
          <ShieldCheck className="w-4 h-4 text-slate-300" />
        </button>

        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">{currentUser.email}</span>
              <span className="text-[10px] text-teal-400 font-mono">Super Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
              title="Logout / Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
