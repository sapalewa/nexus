import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Send, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Copy, 
  Check, 
  Code2, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { ChatLog, SystemConfig } from '../types/crm';

interface WhatsAppInboxProps {
  chatLogs: ChatLog[];
  config: SystemConfig;
  onRefreshLogs: () => void;
  onOrderCreatedTriggered?: () => void;
}

export const WhatsAppInbox: React.FC<WhatsAppInboxProps> = ({
  chatLogs,
  config,
  onRefreshLogs,
  onOrderCreatedTriggered
}) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Form payload untuk pengujian webhook live
  const [testPayload, setTestPayload] = useState({
    senderPhone: '6281298765432',
    senderName: 'Budi Santoso',
    messageText: 'Halo admin, saya mau pesan Paket Bisnis Suite 1 unit sekarang, tolong diproses ya.'
  });

  const webhookEndpoint = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/whatsapp`;

  const sampleMetaPayload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: config.whatsapp_waba_id || '987654321098765',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '6281234567890',
                phone_number_id: config.whatsapp_phone_number_id || '109876543210987'
              },
              contacts: [
                {
                  profile: { name: testPayload.senderName },
                  wa_id: testPayload.senderPhone
                }
              ],
              messages: [
                {
                  from: testPayload.senderPhone,
                  id: `wamid.HBgM${Date.now()}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: { body: testPayload.messageText },
                  type: 'text'
                }
              ]
            },
            field: 'messages'
          }
        ]
      }
    ]
  };

  const curlCommand = `curl -X POST "${webhookEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleMetaPayload, null, 2)}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  // Kirim POST nyata ke endpoint backend /api/webhook/whatsapp
  const handleExecuteLiveWebhook = async () => {
    setIsSendingWebhook(true);
    setTestResult(null);

    const startTime = Date.now();
    try {
      const response = await fetch('/api/webhook/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleMetaPayload)
      });

      const latency = Date.now() - startTime;
      const data = await response.json();

      setTestResult({
        ok: response.ok,
        status: response.status,
        latency,
        data
      });

      onRefreshLogs();
      if (data.orderCreated && onOrderCreatedTriggered) {
        onOrderCreatedTriggered();
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        status: 500,
        latency: Date.now() - startTime,
        error: err.message
      });
    } finally {
      setIsSendingWebhook(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Inbox className="w-8 h-8 text-emerald-400" />
            WhatsApp Webhook Inbound & Message Feed
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Memantau riwayat pesan masuk asli dari WhatsApp Cloud API dan menguji eksekusi endpoint webhook secara nyata.
          </p>
        </div>

        <button
          onClick={onRefreshLogs}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Segarkan Pesan</span>
        </button>
      </div>

      {/* Two-Column: Left (Live Webhook Tester), Right (Live Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Real Webhook HTTP Dispatcher */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Uji HTTP POST ke Endpoint Webhook</h2>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              POST /api/webhook/whatsapp
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Kirimkan payload JSON berstandar Meta Cloud API langsung ke server backend Anda untuk memverifikasi pemrosesan intent AI, penyimpanan order di database, dan pengiriman notifikasi WhatsApp ke Admin.
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Pelanggan (Meta Profile)</label>
                <input
                  type="text"
                  value={testPayload.senderName}
                  onChange={e => setTestPayload({ ...testPayload, senderName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nomor WA Pengirim (Internasional)</label>
                <input
                  type="text"
                  value={testPayload.senderPhone}
                  onChange={e => setTestPayload({ ...testPayload, senderPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Isi Pesan WhatsApp Pelanggan</label>
              <textarea
                rows={3}
                value={testPayload.messageText}
                onChange={e => setTestPayload({ ...testPayload, messageText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleExecuteLiveWebhook}
              disabled={isSendingWebhook || !testPayload.messageText.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSendingWebhook ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengirim ke Webhook Backend...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim HTTP POST Nyata ke Webhook</span>
                </>
              )}
            </button>
          </div>

          {/* Test Result Inspection */}
          {testResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              testResult.ok 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {testResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  <span>Status: HTTP {testResult.status} {testResult.ok ? 'OK' : 'Error'}</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">Latency: {testResult.latency}ms</span>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] overflow-x-auto text-slate-300">
                {JSON.stringify(testResult.data || testResult.error, null, 2)}
              </pre>
            </div>
          )}

          {/* cURL Instruction */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Uji Menggunakan Terminal (cURL)
              </span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Tersalin' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto">
              {curlCommand}
            </pre>
          </div>
        </div>

        {/* Right: Real Inbound Message Feed */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col h-[680px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-emerald-400" />
                Live Inbound Messages Log
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar pesan yang diterima server dari Meta WhatsApp Cloud API
              </p>
            </div>
            <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              {chatLogs.length} Pesan
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <Inbox className="w-10 h-10 text-slate-600" />
                <p className="text-sm font-medium">Belum ada pesan yang masuk.</p>
                <p className="text-xs">Gunakan panel di sebelah kiri untuk menguji pengiriman pesan ke webhook backend.</p>
              </div>
            ) : (
              chatLogs.slice().reverse().map(log => {
                const isUser = log.sender_role === 'user';
                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                      isUser
                        ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                        : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-800/60 pb-1.5">
                      <span className={isUser ? 'text-emerald-400' : 'text-indigo-400'}>
                        {isUser ? '📥 Pelanggan (WhatsApp Inbound)' : '🤖 Respon Otomatis Sistem AI'}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{log.content}</p>

                    {log.metadata?.intent && (
                      <div className="pt-1 text-[10px] font-mono flex items-center justify-between text-slate-400">
                        <span>Intent: <strong className="text-amber-300">{log.metadata.intent}</strong></span>
                        {log.metadata.wa_message_id && (
                          <span className="truncate max-w-[150px]">ID: {log.metadata.wa_message_id}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
