"use client";

import { useState } from 'react';
import { Plus, Search, CreditCard, X, Trash2, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function PaymentsPage() {
  const { payments, leases, properties, tenants, addPayment, deletePayment } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPayments = payments.filter(payment => {
    const lease = leases.find(l => l.id === payment.leaseId);
    const prop = lease ? properties.find(p => p.id === lease.propertyId) : null;
    const tenant = lease ? tenants.find(t => t.id === lease.tenantId) : null;
    const matchSearch = !search ||
      prop?.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant?.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const leaseId = formData.get('leaseId') as string;
    const lease = leases.find(l => l.id === leaseId);
    addPayment({
      leaseId,
      amount: Number(formData.get('amount')),
      currency: lease?.currency || 'TRY',
      paymentDate: formData.get('paymentDate') as string,
      method: formData.get('method') as string,
      note: formData.get('note') as string,
    });
    setIsModalOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ödemeler ve Tahsilatlar</h1>
          <p className="text-slate-500 mt-1">Tüm kira ödemelerini takip edin ve yeni ödeme girin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Ödeme Kaydet
        </button>
      </div>

      {/* Stats */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Toplam Tahsilat</p>
            <p className="text-2xl font-bold text-emerald-600">₺{totalCollected.toLocaleString('tr-TR')}</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Ödeme Sayısı</p>
            <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Aktif Kontrat</p>
            <p className="text-2xl font-bold text-blue-600">{leases.filter(l => l.status === 'ACTIVE').length}</p>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm shadow-slate-200/50">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50">
          <div className="relative w-72 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Kiracı veya mülk ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="all">Tüm Ödemeler</option>
              <option value="recent">Son 30 Gün</option>
            </select>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
              <CreditCard className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Tahsilat kaydı bulunmuyor</h3>
            <p className="text-slate-500 mb-8 max-w-md">
              {leases.length === 0
                ? "Önce bir kontrat oluşturmanız gerekiyor."
                : "Sağ üstteki butonu kullanarak ödeme kaydedebilirsiniz."}
            </p>
          </div>
        ) : (
          <div>
            {/* Masaüstü tablo */}
            <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kiracı / Mülk</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Yöntem</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tutar</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Not</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map(payment => {
                  const lease = leases.find(l => l.id === payment.leaseId);
                  const prop = lease ? properties.find(p => p.id === lease.propertyId) : null;
                  const tenant = lease ? tenants.find(t => t.id === lease.tenantId) : null;
                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                            {tenant?.name.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{tenant?.name || 'Bilinmeyen Kiracı'}</p>
                            <p className="text-xs text-slate-500">{prop?.name || 'Bilinmeyen Mülk'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {new Date(payment.paymentDate).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          ₺{payment.amount.toLocaleString('tr-TR')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500 max-w-[200px] truncate">{payment.note || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deletePayment(payment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>

            {/* Mobil kart görünümü */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredPayments.map(payment => {
                const lease = leases.find(l => l.id === payment.leaseId);
                const prop = lease ? properties.find(p => p.id === lease.propertyId) : null;
                const tenant = lease ? tenants.find(t => t.id === lease.tenantId) : null;
                return (
                  <div key={payment.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {tenant?.name.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{tenant?.name || 'Bilinmeyen'}</p>
                        <p className="text-xs text-slate-500 truncate">{prop?.name || '-'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">{new Date(payment.paymentDate).toLocaleDateString('tr-TR')}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">{payment.method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-sm font-bold text-slate-800">₺{payment.amount.toLocaleString('tr-TR')}</p>
                      <button
                        onClick={() => deletePayment(payment.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Ödeme Kaydet</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kontrat Seçin</label>
                <select required name="leaseId" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                  <option value="">-- Kontrat Seçin --</option>
                  {leases.map(lease => {
                    const prop = properties.find(p => p.id === lease.propertyId);
                    const tenant = tenants.find(t => t.id === lease.tenantId);
                    return (
                      <option key={lease.id} value={lease.id}>
                        {tenant?.name} - {prop?.name} ({lease.rentAmount.toLocaleString('tr-TR')} {lease.currency})
                      </option>
                    );
                  })}
                </select>
                {leases.length === 0 && <p className="text-xs text-rose-500 mt-1">Sistemde kayıtlı kontrat bulunmuyor.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ödeme Tutarı (₺)</label>
                <input required name="amount" type="number" min="1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Örn: 15000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ödeme Tarihi</label>
                <input required name="paymentDate" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ödeme Yöntemi</label>
                <select name="method" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                  <option value="Havale / EFT">Havale / EFT</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Çek">Çek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Not (Opsiyonel)</label>
                <input name="note" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Örn: Mayıs ayı kirası" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors">İptal</button>
                <button type="submit" disabled={leases.length === 0} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
