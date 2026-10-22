export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'canceled';
export type MessageRole = 'user' | 'agent' | 'admin' | 'system';
export type MessageType = 'text' | 'audio' | 'order_summary';

export interface Customer {
  id: string;
  wa_number: string;
  name: string;
  tags: string[];
  total_spent: number;
  total_orders: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatLog {
  id: string;
  customer_id: string;
  sender_role: MessageRole;
  message_type: MessageType;
  content: string;
  audio_url?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  order_status: OrderStatus;
  delivery_address?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminNotification {
  id: string;
  recipient_phone: string;
  message: string;
  order_id?: string;
  status: 'sent' | 'delivered' | 'failed';
  whatsapp_message_id?: string;
  created_at: string;
}

export interface SystemConfig {
  // WhatsApp Cloud API
  whatsapp_verify_token: string;
  whatsapp_access_token: string;
  whatsapp_phone_number_id: string;
  whatsapp_waba_id: string;
  admin_phone_number: string;
  
  // ElevenLabs
  elevenlabs_api_key: string;
  elevenlabs_agent_id: string;
  elevenlabs_voice_id: string;
  elevenlabs_model: string;
  elevenlabs_temperature: number;
  system_prompt: string;

  // Supabase
  supabase_url: string;
  supabase_anon_key: string;
  supabase_service_role_key: string;

  // App & Webhook
  app_url: string;
  auto_notify_admin: boolean;
  voice_response_enabled: boolean;
}
