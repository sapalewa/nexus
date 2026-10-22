import React, { useState } from 'react';
import { Users, Phone, Search, Tag, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { Customer } from '../types/crm';

interface CustomersViewProps {
  customers: Customer[];
  onSelectCustomerForChat?: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, onSelectCustomerForChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.wa_number.includes(searchTerm) ||
    c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-teal-400" />
          WhatsApp Customers Directory
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Daftar kontak pelanggan yang tersinkronisasi otomatis dari Meta Cloud API & Supabase.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Cari nama, no. WhatsApp, atau label..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-750 pl-10 pr-4 py-2.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Nomor WhatsApp</th>
                <th className="px-6 py-4">Tags / Kategori</th>
                <th className="px-6 py-4">Total Pesanan</th>
                <th className="px-6 py-4">Lifetime Value</th>
                <th className="px-6 py-4">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-850/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{customer.name}</div>
                    {customer.metadata?.city && (
                      <span className="text-xs text-slate-400">{customer.metadata.city}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Phone className="w-3.5 h-3.5" />
                      +{customer.wa_number}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {customer.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-white font-bold">{customer.total_orders}</span> pesanan
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">
                    Rp {customer.total_spent.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(customer.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
