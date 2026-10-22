import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  RefreshCw, 
  Database, 
  Phone, 
  Bot, 
  Globe, 
  Radio, 
  Terminal, 
  Clock, 
  ShieldAlert, 
  Key, 
  ExternalLink,
  Zap,
  BookOpen
} from 'lucide-react';
import { SystemConfig } from '../types/crm';
import { 
  verifySupabaseConnection, 
  verifyMetaWhatsAppConnection, 
  verifyWebhookHandshake, 
  verifyElevenLabsConnection,
  HealthCheckResult 
} from '../services/healthVerifier';

export type RealServiceStatus = 'untested' | 'testing' | 'connected' | 'disconnected';

export interface ServiceCheckItem {
  id: string;
  name: string;
  category: 'database' | 'auth' | 'whatsapp' | 'webhook' | 'elevenlabs';
  targetEndpoint: string;
  status: RealServiceStatus;
  latencyMs: number;
  lastCheckedTime?: string;
  httpStatus?: number;
  message: string;
  errorDetail?: string;
  solutions?: string[];
  secretName: string;
}

interface InfrastructureMonitorProps {
  config: SystemConfig;
  onOpenSettings?: () => void;
}

export const InfrastructureMonitor: React.FC<InfrastructureMonitorProps> = ({ config, onOpenSettings }) => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeTabSecretGuide, setActiveTabSecretGuide] = useState(false);

  // Status awal: 'untested' (Tidak mengklaim terhubung sebelum diuji secara nyata!)
  const [services, setServices] = useState<ServiceCheckItem[]>([
    {
      id: 'supabase',
      name: 'Supabase PostgreSQL Database',
      category: 'database',
      targetEndpoint: config.supabase_url ? `${config.supabase_url}/rest/v1/` : 'Belum diisi',
      status: 'untested',
      latencyMs: 0,
      message: 'Belum diuji. Klik "Test Koneksi" untuk memverifikasi URL dan Service Role Key.',
      secretName: 'NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY'
    },
    {
      id: 'meta_whatsapp',
      name: 'Meta WhatsApp Cloud API v18.0+',
      category: 'whatsapp',
      targetEndpoint: config.whatsapp_phone_number_id ? `graph.facebook.com/v18.0/${config.whatsapp_phone_number_id}` : 'Belum diisi',
      status: 'untested',
      latencyMs: 0,
      message: 'Belum diuji. Klik "Test Koneksi" untuk memverifikasi Phone Number ID dan Access Token.',
      secretName: 'WHATSAPP_ACCESS_TOKEN & WHATSAPP_PHONE_NUMBER_ID'
    },
    {
      id: 'whatsapp_webhook',
      name: 'Meta Webhook Handshake Listener',
      category: 'webhook',
      targetEndpoint: '/api/webhook/whatsapp?hub.mode=subscribe',
      status: 'untested',
      latencyMs: 0,
      message: 'Belum diuji. Klik "Test Koneksi" untuk menjalankan simulasi handshake GET verifikasi Meta.',
      secretName: 'WHATSAPP_VERIFY_TOKEN'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs Conversational AI & Voice API',
      category: 'elevenlabs',
      targetEndpoint: 'https://api.elevenlabs.io/v1/user',
      status: 'untested',
      latencyMs: 0,
      message: 'Belum diuji. Tidak diklaim terhubung sebelum pengujian API Key berhasil ke ElevenLabs.',
      secretName: 'ELEVENLABS_API_KEY & ELEVENLABS_AGENT_ID'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString('id-ID')}] Infrastructure Monitor siap. Status awal: Menunggu inisiasi pengujian live.`
  ]);

  // Test satu layanan secara nyata via healthVerifier (dual-mode & safe JSON)
  const testSingleService = async (serviceId: string) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, status: 'testing', message: 'Sedang menguji konektivitas...' } : s))
    );

    const now = new Date().toLocaleTimeString('id-ID');
    let result: HealthCheckResult;

    if (serviceId === 'supabase') {
      result = await verifySupabaseConnection(config);
    } else if (serviceId === 'meta_whatsapp') {
      result = await verifyMetaWhatsAppConnection(config);
    } else if (serviceId === 'whatsapp_webhook') {
      result = await verifyWebhookHandshake(config);
    } else {
      result = await verifyElevenLabsConnection(config);
    }

    setServices(prev =>
      prev.map(s =>
        s.id === serviceId
          ? {
              ...s,
              status: result.status,
              latencyMs: result.latencyMs,
              httpStatus: result.httpStatus,
              lastCheckedTime: now,
              message: result.message,
              errorDetail: result.errorDetail,
              solutions: result.solutions
            }
          : s
      )
    );

    setAuditLogs(old => [
      ...old,
      `[${now}] [${serviceId.toUpperCase()}] ${result.status === 'connected' ? 'TERKONEKSI' : 'GAGAL'} - ${result.message}`
    ]);
  };

  // Uji semua layanan sekaligus secara nyata
  const testAllServices = async () => {
    setIsRunningAll(true);
    setAuditLogs(old => [...old, `[${new Date().toLocaleTimeString('id-ID')}] [BATCH] Menjalankan pengujian konektivitas seluruh layanan secara nyata...`]);

    await testSingleService('supabase');
    await testSingleService('meta_whatsapp');
    await testSingleService('whatsapp_webhook');
    await testSingleService('elevenlabs');

    setIsRunningAll(false);
  };

  const connectedCount = services.filter(s => s.status === 'connected').length;
  const disconnectedCount = services.filter(s => s.status === 'disconnected').length;
  const untestedCount = services.filter(s => s.status === 'untested').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Status */}
      <div className={`p-7 rounded-3xl border transition-all duration-300 shadow-2xl ${
        connectedCount === services.length
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border-emerald-500/40'
          : disconnectedCount > 0
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border-rose-500/40'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                connectedCount === services.length
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : disconnectedCount > 0
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {connectedCount === services.length ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Semua Infrastruktur Terkoneksi ({connectedCount}/{services.length})</span>
                  </>
                ) : disconnectedCount > 0 ? (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{disconnectedCount} Layanan Terputus / Belum Dikonfigurasi</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Menunggu Pengujian Nyata ({untestedCount} Belum Diuji)</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-teal-400" />
              Panel Monitoring Infrastruktur Terverifikasi
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Memverifikasi koneksi aktual ke Supabase, Meta Cloud API, dan ElevenLabs melalui panggilan API backend nyata. Status tidak diklaim terhubung sebelum pengujian berhasil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTabSecretGuide(!activeTabSecretGuide)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Petunjuk Konfigurasi Secret</span>
            </button>

            <button
              onClick={testAllServices}
              disabled={isRunningAll}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/50 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningAll ? 'animate-spin' : ''}`} />
              <span>{isRunningAll ? 'Sedang Menguji...' : 'Uji Semua Koneksi Sekarang'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secret Configuration Guide Drawer (If active) */}
      {activeTabSecretGuide && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Key className="w-5 h-5 text-amber-400" />
              <span>Panduan Kredensial & Secret Mandatory</span>
            </div>
            <button
              onClick={() => setActiveTabSecretGuide(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tutup Panduan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block uppercase">1. Meta WhatsApp Cloud API</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Dapatkan dari <strong>Meta for Developers</strong> &gt; WhatsApp &gt; API Setup:
              </p>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px] list-disc pl-4">
                <li><code>WHATSAPP_ACCESS_TOKEN</code></li>
                <li><code>WHATSAPP_PHONE_NUMBER_ID</code></li>
                <li><code>WHATSAPP_VERIFY_TOKEN</code></li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-400 block uppercase">2. ElevenLabs Conversational AI</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Dapatkan dari <strong>ElevenLabs Dashboard</strong> &gt; Profile &gt; API Keys:
              </p>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px] list-disc pl-4">
                <li><code>ELEVENLABS_API_KEY</code></li>
                <li><code>ELEVENLABS_AGENT_ID</code> (menu ConvAI)</li>
                <li><code>ELEVENLABS_VOICE_ID</code></li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-teal-400 block uppercase">3. Supabase Database</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Dapatkan dari <strong>Supabase Dashboard</strong> &gt; Project Settings &gt; API:
              </p>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px] list-disc pl-4">
                <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                <li><code>SUPABASE_SERVICE_ROLE_KEY</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => {
          const isConnected = service.status === 'connected';
          const isDisconnected = service.status === 'disconnected';
          const isTesting = service.status === 'testing';

          return (
            <div
              key={service.id}
              className={`p-6 rounded-3xl bg-slate-900 border transition-all shadow-xl space-y-4 flex flex-col justify-between ${
                isConnected
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : isDisconnected
                  ? 'border-rose-500/50 bg-rose-950/15'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      {service.name}
                    </h3>
                    <code className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {service.targetEndpoint}
                    </code>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 border ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : isDisconnected
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : isTesting
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Terkoneksi (200 OK)</span>
                      </>
                    ) : isDisconnected ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Gagal / Terputus</span>
                      </>
                    ) : isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Menguji...</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Belum Diuji</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Response / Message Detail */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                  isConnected
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : isDisconnected
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-medium">{service.message}</div>
                  {service.errorDetail && (
                    <div className="font-mono text-[10px] mt-1 text-rose-300 bg-rose-950/50 p-2 rounded-lg border border-rose-500/20">
                      Error: {service.errorDetail}
                    </div>
                  )}
                  {service.solutions && service.solutions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-rose-500/20 text-[10px] text-slate-300 space-y-1">
                      <div className="font-bold text-amber-300">Solusi Perbaikan:</div>
                      {service.solutions.map((sol, sIdx) => (
                        <div key={sIdx} className="leading-tight text-slate-300">• {sol}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Secret Requirement */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Secret: <code className="text-amber-300 font-mono text-[10px]">{service.secretName}</code></span>
                  {service.latencyMs > 0 && (
                    <span className="font-mono font-bold text-emerald-400">{service.latencyMs} ms</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-mono">
                  {service.lastCheckedTime ? `Dicek: ${service.lastCheckedTime}` : 'Belum pernah dicek'}
                </span>

                <div className="flex items-center gap-2">
                  {onOpenSettings && isDisconnected && (
                    <button
                      onClick={onOpenSettings}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                    >
                      Buka Settings
                    </button>
                  )}

                  <button
                    onClick={() => testSingleService(service.id)}
                    disabled={isTesting || isRunningAll}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>Uji Koneksi Ini</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Console Logs */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Live Network Handshake Audit Logs
            </h3>
          </div>
          <button
            onClick={() => setAuditLogs([`[${new Date().toLocaleTimeString('id-ID')}] Log dibersihkan.`])}
            className="text-[11px] text-slate-400 hover:text-white transition font-mono"
          >
            Clear Log
          </button>
        </div>

        <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto pr-2">
          {auditLogs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                log.includes('GAGAL') || log.includes('[ERROR]')
                  ? 'text-rose-400 font-semibold'
                  : log.includes('TERKONEKSI')
                  ? 'text-emerald-300'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
