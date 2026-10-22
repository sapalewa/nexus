/**
 * @file src/services/healthVerifier.ts
 * @description Robust, resilient multi-mode health & connectivity verifier.
 * Handles both backend proxy tests and direct browser-to-cloud fallback with safe JSON parsing.
 */

import { SystemConfig } from '../types/crm';

export interface HealthCheckResult {
  status: 'connected' | 'disconnected';
  latencyMs: number;
  httpStatus?: number;
  message: string;
  errorDetail?: string;
  solutions?: string[];
  metadata?: Record<string, any>;
}

// Helper safe JSON parser that never crashes on HTML 404 / 500 error pages
async function safeParseResponse(res: Response): Promise<{ isJson: boolean; data: any; text: string }> {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return { isJson: true, data, text };
  } catch {
    return { isJson: false, data: null, text };
  }
}

/**
 * 1. Test Supabase Database & Auth
 */
export async function verifySupabaseConnection(config: SystemConfig): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const url = (config.supabase_url || '').trim().replace(/\/+$/, '');
  const key = (config.supabase_service_role_key || config.supabase_anon_key || '').trim();

  if (!url || url.includes('your-project') || !url.startsWith('http') || !key) {
    return {
      status: 'disconnected',
      latencyMs: 0,
      message: 'Supabase URL atau Key belum diisi di menu Settings.',
      errorDetail: 'NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY kosong.',
      solutions: [
        'Buka Supabase Dashboard > Project Settings > API.',
        'Salin Project URL dan masukkan ke menu Settings > Supabase Project URL.',
        'Salin service_role key (secret) dan masukkan ke menu Settings.'
      ]
    };
  }

  // Coba via Backend Proxy dulu
  try {
    const backendRes = await fetch('/api/test/supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });

    const parsed = await safeParseResponse(backendRes);
    if (parsed.isJson && parsed.data) {
      return {
        status: parsed.data.status === 'connected' ? 'connected' : 'disconnected',
        latencyMs: parsed.data.latencyMs || (Date.now() - startTime),
        httpStatus: backendRes.status,
        message: parsed.data.details || parsed.data.error || 'Uji Supabase selesai.',
        errorDetail: parsed.data.error
      };
    }
  } catch {
    // Fallback ke direct fetch jika backend proxy 404 / offline
  }

  // Fallback: Direct Client-to-Supabase REST Verification
  try {
    const restEndpoint = `${url}/rest/v1/`;
    const res = await fetch(restEndpoint, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    const latencyMs = Date.now() - startTime;
    if (res.ok || res.status === 200 || res.status === 404) {
      return {
        status: 'connected',
        latencyMs,
        httpStatus: res.status,
        message: `Koneksi Supabase PostgreSQL Terhubung Langsung (${res.status} OK). Latency: ${latencyMs}ms.`
      };
    } else {
      const errText = await res.text().catch(() => '');
      return {
        status: 'disconnected',
        latencyMs,
        httpStatus: res.status,
        message: `Supabase menolak koneksi (HTTP ${res.status}).`,
        errorDetail: errText.slice(0, 150)
      };
    }
  } catch (err: any) {
    return {
      status: 'disconnected',
      latencyMs: Date.now() - startTime,
      message: 'Gagal menghubungi server Supabase.',
      errorDetail: err.message
    };
  }
}

/**
 * 2. Test Meta WhatsApp Cloud API v18.0+
 */
export async function verifyMetaWhatsAppConnection(config: SystemConfig): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const phoneId = (config.whatsapp_phone_number_id || '').trim();
  const token = (config.whatsapp_access_token || '').trim().replace(/^Bearer\s+/i, '');

  if (!phoneId || !token || token.includes('EAAxxxxxx') || token.length < 20) {
    return {
      status: 'disconnected',
      latencyMs: 0,
      message: 'Meta WhatsApp Access Token atau Phone Number ID belum dikonfigurasi.',
      errorDetail: 'Kredensial WhatsApp Cloud API masih kosong atau bernilai placeholder.',
      solutions: [
        'Buka Meta for Developers > WhatsApp > API Setup.',
        'Salin Phone Number ID dan masukkan ke Settings > Phone Number ID.',
        'Dapatkan Permanent System User Access Token dan masukkan ke Settings.'
      ]
    };
  }

  // Coba via Backend Proxy
  try {
    const backendRes = await fetch('/api/test/meta-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number_id: phoneId, access_token: token })
    });

    const parsed = await safeParseResponse(backendRes);
    if (parsed.isJson && parsed.data) {
      return {
        status: parsed.data.status === 'connected' ? 'connected' : 'disconnected',
        latencyMs: parsed.data.latencyMs || (Date.now() - startTime),
        httpStatus: backendRes.status,
        message: parsed.data.details || parsed.data.error,
        errorDetail: parsed.data.error
      };
    }
  } catch {}

  // Fallback: Direct Client-to-Meta Graph API Verification
  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const latencyMs = Date.now() - startTime;
    const parsed = await safeParseResponse(res);

    if (res.ok && parsed.isJson && !parsed.data?.error) {
      const name = parsed.data.verified_name || parsed.data.display_phone_number || 'Nomor WhatsApp Bisnis';
      return {
        status: 'connected',
        latencyMs,
        httpStatus: res.status,
        message: `Meta Cloud API Terverifikasi (HTTP 200 OK). Nomor: ${name}. Latency: ${latencyMs}ms.`
      };
    } else {
      const errMsg = parsed.data?.error?.message || `Meta API merespon dengan status HTTP ${res.status}`;
      return {
        status: 'disconnected',
        latencyMs,
        httpStatus: res.status,
        message: `Meta Cloud API Gagal (HTTP ${res.status}).`,
        errorDetail: errMsg,
        solutions: [
          'Pastikan Access Token belum kedaluwarsa (gunakan System User Token permanen).',
          'Pastikan Phone Number ID benar sesuai di Meta Developer Dashboard.'
        ]
      };
    }
  } catch (err: any) {
    return {
      status: 'disconnected',
      latencyMs: Date.now() - startTime,
      message: 'Gagal menghubungi Graph API Meta.',
      errorDetail: err.message
    };
  }
}

/**
 * 3. Test Meta Webhook Handshake Listener
 */
export async function verifyWebhookHandshake(config: SystemConfig): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const challenge = `test_challenge_${Date.now()}`;
  const verifyToken = (config.whatsapp_verify_token || '').trim();

  try {
    const testUrl = `/api/webhook/whatsapp?hub.mode=subscribe&hub.challenge=${challenge}&hub.verify_token=${encodeURIComponent(verifyToken)}`;
    const res = await fetch(testUrl);
    const latencyMs = Date.now() - startTime;
    const text = await res.text();

    if (res.ok && text.trim() === challenge) {
      return {
        status: 'connected',
        latencyMs,
        httpStatus: res.status,
        message: `Handshake GET Meta Berhasil (HTTP 200). Server mengembalikan hub.challenge secara valid.`
      };
    } else if (res.status === 404) {
      return {
        status: 'disconnected',
        latencyMs,
        httpStatus: 404,
        message: 'Endpoint /api/webhook/whatsapp belum terpasang di server hosting Anda (HTTP 404).',
        errorDetail: text.includes('NOT_FOUND') ? 'Halaman route webhook tidak ditemukan pada hosting Vercel.' : text.slice(0, 100),
        solutions: [
          'Jika di Vercel: Pastikan file app/api/webhook/whatsapp/route.ts telah di-push dan dideploy ke Vercel.',
          'Jika di lokal: Pastikan dev server backend berjalan aktif di port 3000.'
        ]
      };
    } else {
      return {
        status: 'disconnected',
        latencyMs,
        httpStatus: res.status,
        message: `Handshake Verifikasi Gagal (HTTP ${res.status}).`,
        errorDetail: `Respon server: ${text.slice(0, 120)}`
      };
    }
  } catch (err: any) {
    return {
      status: 'disconnected',
      latencyMs: Date.now() - startTime,
      message: 'Gagal menghubungi endpoint webhook lokal.',
      errorDetail: err.message
    };
  }
}

/**
 * 4. Test ElevenLabs Conversational AI & Customer Service Agent
 */
export async function verifyElevenLabsConnection(config: SystemConfig): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const rawKey = (config.elevenlabs_api_key || '').trim();
  const rawAgent = (config.elevenlabs_agent_id || '').trim();

  const apiKey = rawKey.replace(/^['"]+|['"]+$/g, '').replace(/^Bearer\s+/i, '');
  const agentId = rawAgent.replace(/^['"]+|['"]+$/g, '');

  if (!apiKey || apiKey.length < 8 || apiKey.includes('sk_elevenlabs_xxxx')) {
    return {
      status: 'disconnected',
      latencyMs: 0,
      message: 'ELEVENLABS_API_KEY kosong atau belum dikonfigurasi.',
      errorDetail: 'API Key ElevenLabs belum diisi di menu Settings.',
      solutions: [
        'Buka ElevenLabs Dashboard > Profile Settings > API Keys.',
        'Salin API Key Anda dan tempel di menu Settings > ElevenLabs API Key.'
      ]
    };
  }

  // Coba via Backend Proxy
  try {
    const backendRes = await fetch('/api/test/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, agent_id: agentId })
    });

    const parsed = await safeParseResponse(backendRes);
    if (parsed.isJson && parsed.data) {
      return {
        status: parsed.data.status === 'connected' ? 'connected' : 'disconnected',
        latencyMs: parsed.data.latencyMs || (Date.now() - startTime),
        httpStatus: backendRes.status,
        message: parsed.data.details || parsed.data.error,
        errorDetail: parsed.data.error,
        solutions: parsed.data.solution
      };
    }
  } catch {}

  // Fallback: Direct Client-to-ElevenLabs API Verification
  const headers = { 'xi-api-key': apiKey, 'Content-Type': 'application/json' };

  // Tahap A: Jika ada Agent ID Customer Service, uji langsung endpoint agent ConvAI
  if (agentId && agentId !== 'agent_elevenlabs_sales_pro') {
    try {
      const agentRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, { headers });
      const latencyMs = Date.now() - startTime;
      const parsed = await safeParseResponse(agentRes);

      if (agentRes.ok && parsed.isJson && parsed.data) {
        const agentName = parsed.data.name || 'Customer Service Agent';
        return {
          status: 'connected',
          latencyMs,
          httpStatus: agentRes.status,
          message: `Customer Service Agent "${agentName}" Terverifikasi Aktif di ElevenLabs (HTTP 200). Latency: ${latencyMs}ms.`
        };
      }
    } catch {}
  }

  // Tahap B: Uji list Conversational Agents
  try {
    const convRes = await fetch('https://api.elevenlabs.io/v1/convai/agents', { headers });
    const latencyMs = Date.now() - startTime;
    const parsed = await safeParseResponse(convRes);

    if (convRes.ok && parsed.isJson && parsed.data) {
      const count = parsed.data.agents?.length || 0;
      return {
        status: 'connected',
        latencyMs,
        httpStatus: convRes.status,
        message: `ElevenLabs Conversational AI Terhubung (HTTP 200). Ditemukan ${count} agent.`
      };
    }
  } catch {}

  // Tahap C: Uji User Profile
  try {
    const userRes = await fetch('https://api.elevenlabs.io/v1/user', { headers });
    const latencyMs = Date.now() - startTime;
    const parsed = await safeParseResponse(userRes);

    if (userRes.ok && parsed.isJson && parsed.data) {
      return {
        status: 'connected',
        latencyMs,
        httpStatus: userRes.status,
        message: `API Key ElevenLabs Terverifikasi (HTTP 200). Tier: ${parsed.data.subscription?.tier || 'Active'}. Latency: ${latencyMs}ms.`
      };
    } else {
      const errDetail = parsed.data?.detail?.message || parsed.data?.detail || parsed.text.slice(0, 100);
      return {
        status: 'disconnected',
        latencyMs,
        httpStatus: userRes.status,
        message: `API Key ElevenLabs Ditolak (HTTP ${userRes.status}).`,
        errorDetail: errDetail || 'Unauthorized / Invalid Key',
        solutions: [
          'Pastikan API Key di-copy dari: ElevenLabs Dashboard > Profile Settings > API Keys.',
          'Jika Anda menggunakan Agen Customer Service, masukkan Agent ID dari menu Conversational AI > Buka Agen Anda > Salin Agent ID dari URL browser.',
          'Jika menggunakan Scoped Key, pastikan izin "Conversational AI" aktif.'
        ]
      };
    }
  } catch (err: any) {
    return {
      status: 'disconnected',
      latencyMs: Date.now() - startTime,
      message: 'Gagal menghubungi server ElevenLabs.',
      errorDetail: err.message
    };
  }
}
