import { Customer, Order, ChatLog, AdminNotification, SystemConfig } from '../types/crm';

export const INITIAL_CONFIG: SystemConfig = {
  whatsapp_verify_token: 'NEXUS_WA_SECURE_TOKEN_2026',
  whatsapp_access_token: 'EAAG9xxxxxxxxxxxxxxxxxxxxxxxxxxxxMetaSystemUserToken',
  whatsapp_phone_number_id: '109876543210987',
  whatsapp_waba_id: '987654321098765',
  admin_phone_number: '6281234567890',
  
  elevenlabs_api_key: 'sk_elevenlabs_7a8bc92d19ef84210a',
  elevenlabs_agent_id: 'agent_elevenlabs_sales_pro',
  elevenlabs_voice_id: '21m00Tcm4TlvDq8ikWAM',
  elevenlabs_model: 'eleven_multilingual_v2',
  elevenlabs_temperature: 0.7,
  system_prompt: 'Anda adalah Asisten Penjualan & Layanan Pelanggan AI pintar dan ramah. Tugas Anda membantu pelanggan memilih paket produk dan melakukan pemesanan dengan cepat dan akurat.',

  supabase_url: 'https://hxyqpzkvmbrtnuwo.supabase.co',
  supabase_anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eXFwemt2bWJydG51d28iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ',
  supabase_service_role_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eXFwemt2bWJydG51d28iLCJyb2xlIjoic2VydmljZV9yb2xlIn0',

  app_url: 'https://nexus-crm-enterprise.vercel.app',
  auto_notify_admin: true,
  voice_response_enabled: true
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    wa_number: '6281298765432',
    name: 'Budi Santoso (PT Maju Jaya)',
    tags: ['VIP Client', 'Inbound WhatsApp', 'High Value'],
    total_spent: 4250000,
    total_orders: 3,
    metadata: { company: 'PT Maju Jaya Tech', city: 'Jakarta Selatan' },
    created_at: '2026-10-18T09:20:00Z'
  },
  {
    id: 'cust-02',
    wa_number: '6285712348899',
    name: 'Siti Rahmawati',
    tags: ['E-commerce Lead', 'Repeat Buyer'],
    total_spent: 1500000,
    total_orders: 2,
    metadata: { city: 'Surabaya', preference: 'Paket Bisnis' },
    created_at: '2026-10-19T14:10:00Z'
  },
  {
    id: 'cust-03',
    wa_number: '6287890123456',
    name: 'Hendro Prasetyo',
    tags: ['New Prospect'],
    total_spent: 1350000,
    total_orders: 1,
    metadata: { city: 'Bandung' },
    created_at: '2026-10-21T11:05:00Z'
  },
  {
    id: 'cust-04',
    wa_number: '6282133445566',
    name: 'Dewi Lestari',
    tags: ['Support', 'Inquiry'],
    total_spent: 0,
    total_orders: 0,
    metadata: { city: 'Yogyakarta' },
    created_at: '2026-10-22T03:40:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98214',
    customer_id: 'cust-01',
    customer_name: 'Budi Santoso (PT Maju Jaya)',
    customer_phone: '6281298765432',
    items: [
      { id: 'item-1', name: 'Paket Enterprise Pro AI Agent', quantity: 2, price: 1250000 },
      { id: 'item-2', name: 'Add-on Voice Cloning Studio', quantity: 1, price: 500000 }
    ],
    total_amount: 3000000,
    order_status: 'pending',
    delivery_address: 'Gedung Menara Cyber Lt 12, Kuningan Barat, Jakarta Selatan',
    payment_method: 'Transfer Virtual Account BCA',
    notes: 'Dipesan otomatis via ElevenLabs Conversational AI Agent.',
    created_at: '2026-10-22T08:12:00Z',
    updated_at: '2026-10-22T08:12:00Z'
  },
  {
    id: 'ORD-98210',
    customer_id: 'cust-02',
    customer_name: 'Siti Rahmawati',
    customer_phone: '6285712348899',
    items: [
      { id: 'item-3', name: 'Paket Bisnis Suite', quantity: 1, price: 750000 }
    ],
    total_amount: 750000,
    order_status: 'confirmed',
    delivery_address: 'Jl. Darmo Permai No. 45, Dukuh Pakis, Surabaya',
    payment_method: 'QRIS Dinamis',
    notes: 'Pembayaran telah diverifikasi di Mutasi Bank.',
    created_at: '2026-10-22T06:45:00Z',
    updated_at: '2026-10-22T07:10:00Z'
  },
  {
    id: 'ORD-98188',
    customer_id: 'cust-03',
    customer_name: 'Hendro Prasetyo',
    customer_phone: '6287890123456',
    items: [
      { id: 'item-4', name: 'Paket Starter AI Agent', quantity: 3, price: 450000 }
    ],
    total_amount: 1350000,
    order_status: 'shipped',
    delivery_address: 'Jl. Riau No. 88, Citarum, Bandung Wetan',
    payment_method: 'Transfer Mandiri',
    notes: 'Resi Pengiriman JNE YES: JNE8891002391',
    created_at: '2026-10-21T15:20:00Z',
    updated_at: '2026-10-21T18:00:00Z'
  }
];

export const INITIAL_CHAT_LOGS: ChatLog[] = [
  {
    id: 'chat-01',
    customer_id: 'cust-01',
    sender_role: 'user',
    message_type: 'text',
    content: 'Halo admin, kami mau upgrade sistem ke Paket Enterprise Pro 2 unit untuk kantor pusat.',
    timestamp: '2026-10-22T08:10:20Z'
  },
  {
    id: 'chat-02',
    customer_id: 'cust-01',
    sender_role: 'agent',
    message_type: 'audio',
    content: 'Halo Kak Budi Santoso! Terima kasih, pesanan Anda untuk "Paket Enterprise Pro AI" sejumlah 2 unit (Total Rp 2.500.000) telah kami catat dalam antrian sistem. Tim admin kami segera menghubungi Kakak via nomor ini untuk konfirmasi pengiriman & pembayaran. Mohon ditunggu ya! 😊🙏',
    audio_url: 'https://cdn.elevenlabs.io/sample/voice_response_id.mp3',
    timestamp: '2026-10-22T08:11:05Z',
    metadata: { intent: 'CREATE_ORDER', confidence: 0.98, engine: 'ElevenLabs Conversational AI' }
  },
  {
    id: 'chat-03',
    customer_id: 'cust-02',
    sender_role: 'user',
    message_type: 'text',
    content: 'Bisa minta pricelist lengkap untuk Paket Bisnis?',
    timestamp: '2026-10-22T06:30:10Z'
  },
  {
    id: 'chat-04',
    customer_id: 'cust-02',
    sender_role: 'agent',
    message_type: 'text',
    content: 'Halo Kak Siti! Paket Bisnis Suite berharga Rp 750.000/bln mencakup 5.000 pesan WhatsApp otomatis, integrasi ElevenLabs suara natural, dan dashboard CRM lengkap. Ada yang ingin ditanyakan lagi Kak?',
    timestamp: '2026-10-22T06:31:00Z',
    metadata: { intent: 'PRODUCT_INFO', confidence: 0.95 }
  }
];

export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-01',
    recipient_phone: '6281234567890',
    order_id: 'ORD-98214',
    message: `🚨 *ORDER BARU MASUK!* 🚨\n\nNama: Budi Santoso (PT Maju Jaya)\nNo. WA: 6281298765432\nItem: Paket Enterprise Pro AI Agent (2x), Add-on Voice Cloning Studio (1x)\nTotal: Rp 3.000.000\nStatus: Pending\n\nOrder ID: #ORD-98214\nSilakan cek dashboard CRM untuk verifikasi pesanan.`,
    status: 'delivered',
    whatsapp_message_id: 'wamid.HBgMNjI4MTIzNDU2Nzg5MBVCMRIA',
    created_at: '2026-10-22T08:12:02Z'
  },
  {
    id: 'notif-02',
    recipient_phone: '6281234567890',
    order_id: 'ORD-98210',
    message: `🚨 *ORDER BARU MASUK!* 🚨\n\nNama: Siti Rahmawati\nNo. WA: 6285712348899\nItem: Paket Bisnis Suite (1x)\nTotal: Rp 750.000\nStatus: Pending\n\nOrder ID: #ORD-98210\nSilakan cek dashboard CRM untuk verifikasi pesanan.`,
    status: 'delivered',
    whatsapp_message_id: 'wamid.HBgMNjI4NTcxMjM0ODg5OQVCMRIA',
    created_at: '2026-10-22T06:45:03Z'
  }
];
