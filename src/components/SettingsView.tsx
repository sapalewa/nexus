import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Bot, 
  Database, 
  Save, 
  CheckCircle, 
  Copy, 
  RefreshCw, 
  Globe, 
  Key, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Zap,
  Info
} from 'lucide-react';
import { SystemConfig } from '../types/crm';

interface SettingsViewProps {
  config: SystemConfig;
  onSaveConfig: (newConfig: SystemConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ config, onSaveConfig }) => {
  const [form, setForm] = useState<SystemConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedVerify, setCopiedVerify] = useState(false);

  // Test states
  const [metaTest, setMetaTest] = useState<{ loading: boolean; result?: any }>({ loading: false });
  const [elevenTest, setElevenTest] = useState<{ loading: boolean; result?: any }>({ loading: false });
  const [supabaseTest, setSupabaseTest] = useState<{ loading: boolean; result?: any }>({ loading: false });

  const webhookUrl = `${form.app_url}/api/webhook/whatsapp`;

  const handleCopy = (text: string, type: 'webhook' | 'verify') => {
    navigator.clipboard.writeText(text);
    if (type === 'webhook') {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedVerify(true);
      setTimeout(() => setCopiedVerify(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSaveConfig(form);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  // Real Test Handlers
  const testMetaApi = async () => {
    setMetaTest({ loading: true });
    try {
      const res = await fetch('/api/test/meta-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number_id: form.whatsapp_phone_number_id,
          access_token: form.whatsapp_access_token
        })
      });
      const data = await res.json();
      setMetaTest({ loading: false, result: data });
    } catch (e: any) {
      setMetaTest({ loading: false, result: { status: 'disconnected', error: e.message } });
    }
  };

  const testElevenLabsApi = async () => {
    setElevenTest({ loading: true });
    try {
      const res = await fetch('/api/test/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: form.elevenlabs_api_key,
          agent_id: form.elevenlabs_agent_id
        })
      });
      const data = await res.json();
      setElevenTest({ loading: false, result: data });
    } catch (e: any) {
      setElevenTest({ loading: false, result: { status: 'disconnected', error: e.message } });
    }
  };

  const testSupabaseApi = async () => {
    setSupabaseTest({ loading: true });
    try {
      const res = await fetch('/api/test/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: form.supabase_url,
          key: form.supabase_service_role_key || form.supabase_anon_key
        })
      });
      const data = await res.json();
      setSupabaseTest({ loading: false, result: data });
    } catch (e: any) {
      setSupabaseTest({ loading: false, result: { status: 'disconnected', error: e.message } });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          System & API Integrations Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Kelola seluruh kredensial Meta WhatsApp Cloud API v18.0+, ElevenLabs Conversational AI, dan Supabase Database tanpa perlu hardcoding.
        </p>
      </div>

      {/* Webhook Meta URL Generator Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Globe className="w-4 h-4" /> Meta Cloud API Webhook URL Generator
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Callback URL untuk Meta App Dashboard</h3>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Vercel Ready
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Salin URL & Token verifikasi berikut ke <strong>Meta for Developers</strong> &gt; <strong>WhatsApp</strong> &gt; <strong>Configuration</strong> &gt; <strong>Webhook</strong>:
        </p>

        <div className="space-y-3">
          {/* Callback URL */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Callback URL</span>
              <code className="text-emerald-400 font-mono text-xs font-semibold">{webhookUrl}</code>
            </div>
            <button
              onClick={() => handleCopy(webhookUrl, 'webhook')}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shrink-0 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedWebhook ? 'Tersalin!' : 'Copy URL'}</span>
            </button>
          </div>

          {/* Verify Token */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Verify Token (Meta Handshake)</span>
              <code className="text-indigo-300 font-mono text-xs font-semibold">{form.whatsapp_verify_token}</code>
            </div>
            <button
              onClick={() => handleCopy(form.whatsapp_verify_token, 'verify')}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedVerify ? 'Tersalin!' : 'Copy Token'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: WhatsApp Business API */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Phone className="w-5 h-5" /> Meta WhatsApp Business API v18.0+
            </div>
            <button
              type="button"
              onClick={testMetaApi}
              disabled={metaTest.loading}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${metaTest.loading ? 'animate-spin' : ''}`} />
              <span>{metaTest.loading ? 'Menguji...' : 'Uji Kredensial Meta'}</span>
            </button>
          </div>

          {metaTest.result && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              metaTest.result.status === 'connected'
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}>
              {metaTest.result.status === 'connected' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>
                <div className="font-bold">{metaTest.result.status === 'connected' ? 'Meta API Terhubung (200 OK)' : 'Meta API Gagal'}</div>
                <div className="text-[11px] text-slate-300">{metaTest.result.details || metaTest.result.error}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Verify Token (Meta Handshake)</label>
              <input
                type="text"
                value={form.whatsapp_verify_token}
                onChange={e => setForm({ ...form, whatsapp_verify_token: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number ID</label>
              <input
                type="text"
                value={form.whatsapp_phone_number_id}
                onChange={e => setForm({ ...form, whatsapp_phone_number_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Meta Permanent System User Access Token</label>
            <input
              type="password"
              value={form.whatsapp_access_token}
              onChange={e => setForm({ ...form, whatsapp_access_token: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Admin Target Phone */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide">
              🚨 Target Nomor WhatsApp Admin (Menerima Notifikasi Order Baru)
            </label>
            <p className="text-xs text-slate-300 leading-relaxed">
              Format nomor internasional tanpa tanda + (contoh: <code>6281234567890</code>). Setiap order yang dihasilkan AI akan langsung mengirim pesan WhatsApp ke nomor ini secara instan.
            </p>
            <input
              type="text"
              placeholder="Contoh: 6281234567890"
              value={form.admin_phone_number}
              onChange={e => setForm({ ...form, admin_phone_number: e.target.value })}
              className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-2.5 text-amber-200 font-mono text-sm focus:border-amber-400 focus:outline-none font-bold"
            />
          </div>
        </div>

        {/* Section 2: ElevenLabs Conversational AI */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Bot className="w-5 h-5" /> ElevenLabs Voice & Conversational AI
            </div>
            <button
              type="button"
              onClick={testElevenLabsApi}
              disabled={elevenTest.loading}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${elevenTest.loading ? 'animate-spin' : ''}`} />
              <span>{elevenTest.loading ? 'Menguji...' : 'Uji API Key ElevenLabs'}</span>
            </button>
          </div>

          {elevenTest.result && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              elevenTest.result.status === 'connected'
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}>
              {elevenTest.result.status === 'connected' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>
                <div className="font-bold">{elevenTest.result.status === 'connected' ? 'ElevenLabs API Terhubung (200 OK)' : 'ElevenLabs API Gagal'}</div>
                <div className="text-[11px] text-slate-300">{elevenTest.result.details || elevenTest.result.error}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">ElevenLabs API Key</label>
              <input
                type="password"
                value={form.elevenlabs_api_key}
                onChange={e => setForm({ ...form, elevenlabs_api_key: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Agent ID</label>
              <input
                type="text"
                value={form.elevenlabs_agent_id}
                onChange={e => setForm({ ...form, elevenlabs_agent_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Voice ID (Indo Voice/Rachel)</label>
              <input
                type="text"
                value={form.elevenlabs_voice_id}
                onChange={e => setForm({ ...form, elevenlabs_voice_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">System Prompt untuk AI Agent</label>
            <textarea
              rows={3}
              value={form.system_prompt}
              onChange={e => setForm({ ...form, system_prompt: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Supabase Database */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <Database className="w-5 h-5" /> Supabase PostgreSQL & Auth Credentials
            </div>
            <button
              type="button"
              onClick={testSupabaseApi}
              disabled={supabaseTest.loading}
              className="px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${supabaseTest.loading ? 'animate-spin' : ''}`} />
              <span>{supabaseTest.loading ? 'Menguji...' : 'Uji Koneksi Supabase'}</span>
            </button>
          </div>

          {supabaseTest.result && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              supabaseTest.result.status === 'connected'
                ? 'bg-teal-950/30 border-teal-500/30 text-teal-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}>
              {supabaseTest.result.status === 'connected' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>
                <div className="font-bold">{supabaseTest.result.status === 'connected' ? 'Supabase Terhubung (200 OK)' : 'Supabase Gagal Terhubung'}</div>
                <div className="text-[11px] text-slate-300">{supabaseTest.result.details || supabaseTest.result.error}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={form.supabase_url}
                onChange={e => setForm({ ...form, supabase_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Service Role Key (Bypass RLS untuk Webhook)</label>
              <input
                type="password"
                value={form.supabase_service_role_key}
                onChange={e => setForm({ ...form, supabase_service_role_key: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold animate-fade-in">
              <CheckCircle className="w-4 h-4" /> Pengaturan berhasil disimpan ke backend!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-950/40 transition disabled:opacity-50 active:scale-95"
          >
            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
