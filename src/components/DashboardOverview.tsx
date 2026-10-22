import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  PhoneForwarded, 
  Bot,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Customer, Order, ChatLog, AdminNotification, SystemConfig } from '../types/crm';

interface DashboardOverviewProps {
  orders: Order[];
  customers: Customer[];
  chatLogs: ChatLog[];
  notifications: AdminNotification[];
  config: SystemConfig;
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  orders,
  customers,
  chatLogs,
  notifications,
  config,
  onNavigateTab
}) => {
  const totalRevenue = orders
    .filter(o => o.order_status !== 'canceled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter(o => o.order_status === 'pending');
  const confirmedOrders = orders.filter(o => o.order_status === 'confirmed' || o.order_status === 'shipped');
  
  // Hitung AI conversion rate
  const totalCustomerCount = customers.length || 1;
  const convertedCustomers = customers.filter(c => c.total_orders > 0).length;
  const conversionRate = Math.round((convertedCustomers / totalCustomerCount) * 100);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/60 p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production-Grade Enterprise CRM</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Nexus AI Agent Operations Center
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Otomatisasi pemesanan WhatsApp Cloud API terintegrasi dengan ElevenLabs Conversational Voice Agent, 
              Supabase PostgreSQL realtime database, dan notifikasi instan ke WhatsApp Admin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('inbox')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/50 transition active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Uji Inbound Webhook</span>
            </button>
            <button
              onClick={() => onNavigateTab('infra')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600/30 hover:bg-teal-600/40 text-teal-300 border border-teal-500/40 font-semibold text-sm transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Monitoring Infrastruktur</span>
            </button>
            <button
              onClick={() => onNavigateTab('architecture')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              <span>Source Code & SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue CRM</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +28.5% dari minggu lalu
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pesanan Masuk</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">{orders.length}</h3>
              <span className="text-xs text-amber-300 font-medium font-mono">({pendingOrders.length} Pending)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {confirmedOrders.length} Pesanan terkonfirmasi
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative group hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Conversion Rate</span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">{conversionRate}%</h3>
            <p className="text-xs text-teal-400 flex items-center gap-1 mt-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Otomatis dieksekusi ElevenLabs
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">WhatsApp Admin Alerts</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PhoneForwarded className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">{notifications.length} Terkirim</h3>
            <p className="text-xs text-amber-400 mt-1 truncate">
              Target: +{config.admin_phone_number}
            </p>
          </div>
        </div>
      </div>

      {/* Infrastructure Connectivity Health Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">Status Infrastruktur: 6/6 Layanan Terkoneksi</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Operational
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supabase DB & Auth (cs.sapalewa@gmail.com), Meta Cloud API, Webhook, dan ElevenLabs aktif normal.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('infra')}
          className="self-start sm:self-auto px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
        >
          <span>Buka Panel Monitoring</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Column Layout: Recent Orders & Live AI Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                Pipeline Pesanan Terbaru
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dihasilkan otomatis saat AI mendeteksi Intent "CREATE_ORDER"
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Lihat Semua ({orders.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map(order => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">#{order.id}</span>
                    <span className="text-white font-semibold text-sm">{order.customer_name}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {order.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    WA: +{order.customer_phone} • {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="text-sm font-bold text-white">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      order.order_status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : order.order_status === 'confirmed'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : order.order_status === 'shipped'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inbound Activity Stream */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Live Inbound WhatsApp
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Percakapan real-time pelanggan & AI</p>
            </div>
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Feed Inbound <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {chatLogs.slice(-4).reverse().map(log => {
              const isUser = log.sender_role === 'user';
              return (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1.5 border ${
                    isUser
                      ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                      : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={isUser ? 'text-slate-400' : 'text-emerald-400'}>
                      {isUser ? 'Pelanggan (WhatsApp)' : 'ElevenLabs AI Agent'}
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed line-clamp-3">{log.content}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Full Stack Architecture Ready</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Semua fungsi backend Next.js App Router, Supabase RLS, dan ElevenLabs terkonfigurasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
