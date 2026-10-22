import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Send, 
  FileText,
  DollarSign,
  ArrowUpDown,
  Plus
} from 'lucide-react';
import { Order, OrderStatus } from '../types/crm';

interface OrdersManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onSendAdminAlertManual: (order: Order) => void;
}

export const OrdersManagement: React.FC<OrdersManagementProps> = ({
  orders,
  onUpdateOrderStatus,
  onSendAdminAlertManual
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [alertSuccessId, setAlertSuccessId] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.order_status === filterStatus;
    const matchSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleManualAlert = (order: Order) => {
    onSendAdminAlertManual(order);
    setAlertSuccessId(order.id);
    setTimeout(() => setAlertSuccessId(null), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Canceled
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-indigo-400" />
            CRM Orders & Pipeline Real-time
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Daftar seluruh pesanan pelanggan yang dieksekusi oleh AI Agent via percakapan WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama, no. WA, atau order ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-750 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'confirmed', 'shipped', 'canceled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID & Waktu</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Item & Qty</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status Order</th>
                <th className="px-6 py-4 text-right">Aksi & Notif WA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Tidak ada order yang cocok dengan filter atau kata kunci pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-850/40 transition">
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>#{order.id}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WIB
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{order.customer_name}</div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>+{order.customer_phone}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-indigo-400 font-bold">{item.quantity}x</span>{' '}
                            <span className="text-slate-200">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-extrabold text-white text-sm">
                        Rp {order.total_amount.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {order.payment_method || 'Transfer Bank'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(order.order_status)}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <div className="inline-flex items-center gap-2">
                        {/* Status Select */}
                        <select
                          value={order.order_status}
                          onChange={e => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-slate-950 border border-slate-750 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="canceled">Canceled</option>
                        </select>

                        {/* Send WA Alert button */}
                        <button
                          onClick={() => handleManualAlert(order)}
                          className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition text-xs font-semibold flex items-center gap-1"
                          title="Kirim Ulang Notifikasi WhatsApp ke Admin"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">
                            {alertSuccessId === order.id ? 'Terkirim!' : 'Alert Admin'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
