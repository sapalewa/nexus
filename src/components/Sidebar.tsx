import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  BellRing, 
  Settings, 
  Code2, 
  Zap, 
  Activity, 
  LogOut,
  ShieldCheck,
  Server
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'inbox' 
  | 'orders' 
  | 'customers' 
  | 'notifications' 
  | 'infra' 
  | 'settings' 
  | 'architecture';

interface UserSession {
  email: string;
  name: string;
  role: string;
}

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingOrdersCount: number;
  unreadNotifsCount: number;
  currentUser: UserSession | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  unreadNotifsCount,
  currentUser,
  onLogout
}) => {
  const coreNavItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbound WhatsApp Feed', icon: MessageSquare, badge: 'Live Hook' },
    { id: 'orders', label: 'CRM Orders & Pipeline', icon: ShoppingBag, count: pendingOrdersCount },
    { id: 'customers', label: 'Customers Directory', icon: Users },
    { id: 'notifications', label: 'Admin WhatsApp Logs', icon: BellRing, count: unreadNotifsCount },
  ];

  const devNavItems = [
    { id: 'infra', label: 'Monitoring Infrastruktur', icon: Activity, badge: 'Live Health' },
    { id: 'settings', label: 'API & Webhook Settings', icon: Settings },
    { id: 'architecture', label: 'Code & Architecture Hub', icon: Code2, badge: 'Full Code' },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen shrink-0 sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-base tracking-tight text-white">NexusAI CRM</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              v18.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
            Supabase + WhatsApp Suite
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        {coreNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-indigo-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}

              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-3 pt-6 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Infrastruktur & Developer
        </div>

        {devNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isInfra = item.id === 'infra';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-indigo-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-emerald-400' : isInfra ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>

              {isInfra ? (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  Live
                </span>
              ) : item.badge ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Supabase Authenticated User Profile */}
      {currentUser && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
                CS
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <span>{currentUser.email}</span>
                </div>
                <div className="text-[10px] text-teal-400 font-semibold font-mono truncate">
                  Supabase Authenticated
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition shrink-0"
              title="Keluar / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
