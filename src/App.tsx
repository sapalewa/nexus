/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { WhatsAppInbox } from './components/WhatsAppInbox';
import { OrdersManagement } from './components/OrdersManagement';
import { CustomersView } from './components/CustomersView';
import { AdminNotificationsView } from './components/AdminNotificationsView';
import { SettingsView } from './components/SettingsView';
import { ArchitectureView } from './components/ArchitectureView';
import { InfrastructureMonitor } from './components/InfrastructureMonitor';
import { LoginPage } from './components/LoginPage';

import { 
  Customer, 
  Order, 
  ChatLog, 
  AdminNotification, 
  SystemConfig, 
  OrderStatus 
} from './types/crm';
import { 
  INITIAL_CONFIG, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_CHAT_LOGS, 
  INITIAL_ADMIN_NOTIFICATIONS 
} from './data/mockInitialData';

interface UserSession {
  email: string;
  name: string;
  role: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Supabase Authenticated User Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const savedUser = localStorage.getItem('nexus_crm_user');
      if (savedUser) return JSON.parse(savedUser);
      return {
        email: 'cs.sapalewa@gmail.com',
        name: 'CS Sapalewa',
        role: 'Super Admin & Cloud Operator'
      };
    } catch {
      return {
        email: 'cs.sapalewa@gmail.com',
        name: 'CS Sapalewa',
        role: 'Super Admin & Cloud Operator'
      };
    }
  });

  // App State initialized with initial data
  const [config, setConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem('nexus_crm_config');
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_crm_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_crm_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [chatLogs, setChatLogs] = useState<ChatLog[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_crm_chats');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_LOGS;
    } catch {
      return INITIAL_CHAT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_crm_notifs');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_NOTIFICATIONS;
    } catch {
      return INITIAL_ADMIN_NOTIFICATIONS;
    }
  });

  // Fetch real data from backend
  const fetchBackendData = useCallback(async () => {
    try {
      const [ordersRes, logsRes, notifsRes, custRes, configRes] = await Promise.all([
        fetch('/api/orders').catch(() => null),
        fetch('/api/chat-logs').catch(() => null),
        fetch('/api/admin-notifications').catch(() => null),
        fetch('/api/customers').catch(() => null),
        fetch('/api/configs').catch(() => null)
      ]);

      if (ordersRes?.ok) {
        const d = await ordersRes.json();
        if (d.orders && d.orders.length > 0) setOrders(d.orders);
      }
      if (logsRes?.ok) {
        const d = await logsRes.json();
        if (d.logs && d.logs.length > 0) setChatLogs(d.logs);
      }
      if (notifsRes?.ok) {
        const d = await notifsRes.json();
        if (d.notifications && d.notifications.length > 0) setNotifications(d.notifications);
      }
      if (custRes?.ok) {
        const d = await custRes.json();
        if (d.customers && d.customers.length > 0) setCustomers(d.customers);
      }
      if (configRes?.ok) {
        const d = await configRes.json();
        if (d.configs) setConfig(prev => ({ ...prev, ...d.configs }));
      }
    } catch (err) {
      console.warn('Backend sync notice:', err);
    }
  }, []);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nexus_crm_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('nexus_crm_user');
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_crm_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_crm_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_crm_chats', JSON.stringify(chatLogs));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [chatLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_crm_notifs', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [notifications]);

  // Auth Handlers
  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Order Handlers with real backend calls
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, order_status: newStatus, updated_at: new Date().toISOString() } : o))
    );

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Error updating order status on backend:', e);
    }
  };

  const handleSendAdminAlertManual = async (order: Order) => {
    const formattedItems = order.items.map(i => `${i.name} (${i.quantity}x)`).join(', ');
    const adminMsg = `🚨 *ORDER BARU MASUK!* 🚨\n\nNama: ${order.customer_name}\nNo. WA: ${order.customer_phone}\nItem: ${formattedItems}\nTotal: Rp ${order.total_amount.toLocaleString('id-ID')}\nStatus: ${order.order_status.toUpperCase()}\n\nOrder ID: #${order.id}\nSilakan cek dashboard CRM untuk verifikasi pesanan.`;

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      recipient_phone: config.admin_phone_number,
      order_id: order.id,
      message: adminMsg,
      status: 'sent',
      whatsapp_message_id: `wamid.manual.${Date.now()}`,
      created_at: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);

    try {
      const res = await fetch(`/api/orders/${order.id}/notify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        fetchBackendData();
      }
    } catch (e) {
      console.error('Error triggering manual admin alert:', e);
    }
  };

  const handleSaveConfig = async (newConfig: SystemConfig) => {
    setConfig(newConfig);
    try {
      await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (e) {
      console.error('Error saving config to backend:', e);
    }
  };

  // Jika belum login, tampilkan halaman Login Supabase Authentic
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingOrdersCount = orders.filter(o => o.order_status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        unreadNotifsCount={notifications.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          config={config}
          onOpenInbox={() => setActiveTab('inbox')}
          onOpenSettings={() => setActiveTab('settings')}
          onOpenInfra={() => setActiveTab('infra')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* View Routing */}
        <main className="flex-1 pb-16">
          {activeTab === 'overview' && (
            <DashboardOverview
              orders={orders}
              customers={customers}
              chatLogs={chatLogs}
              notifications={notifications}
              config={config}
              onNavigateTab={(tab: ActiveTab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'inbox' && (
            <WhatsAppInbox
              chatLogs={chatLogs}
              config={config}
              onRefreshLogs={fetchBackendData}
              onOrderCreatedTriggered={fetchBackendData}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersManagement
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onSendAdminAlertManual={handleSendAdminAlertManual}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView customers={customers} />
          )}

          {activeTab === 'notifications' && (
            <AdminNotificationsView notifications={notifications} />
          )}

          {activeTab === 'infra' && (
            <InfrastructureMonitor 
              config={config} 
              onOpenSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView config={config} onSaveConfig={handleSaveConfig} />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView />
          )}
        </main>
      </div>
    </div>
  );
}
