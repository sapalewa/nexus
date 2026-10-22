import React from 'react';
import { BellRing, CheckCheck, Phone, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { AdminNotification } from '../types/crm';

interface AdminNotificationsViewProps {
  notifications: AdminNotification[];
}

export const AdminNotificationsView: React.FC<AdminNotificationsViewProps> = ({ notifications }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <BellRing className="w-8 h-8 text-amber-400" />
          WhatsApp Admin Notification Audit Log
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Rekap seluruh log pengiriman pesan WhatsApp otomatis ke nomor Admin saat order baru terdeteksi oleh sistem AI.
        </p>
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-3xl border border-slate-800">
            Belum ada notifikasi yang dikirim ke nomor Admin.
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white">Target Admin: +{notif.recipient_phone}</span>
                  {notif.order_id && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                      Ref: #{notif.order_id}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCheck className="w-4 h-4" /> Delivered via Meta API
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {new Date(notif.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Message Payload Render */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {notif.message}
              </div>

              {notif.whatsapp_message_id && (
                <div className="text-[11px] text-slate-500 font-mono">
                  Meta WAMID: <span className="text-slate-400">{notif.whatsapp_message_id}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
