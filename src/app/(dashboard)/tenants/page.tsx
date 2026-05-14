"use client";

import { useState } from 'react';
import { Plus, Search, Users, Phone, Mail, X, Trash2, Pencil } from 'lucide-react';
import { useStore, Tenant } from '@/store/useStore';

export default function TenantsPage() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [search, setSearch] = useState("");

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tcNo.includes(search)
  );

  const openAdd = () => {
    setEditingTenant(null);
    setIsModalOpen(true);
  };

  const openEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      tcNo: formData.get('tcNo') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };
    if (editingTenant) {
      updateTenant(editingTenant.id, data);
    } else {
      addTenant(data);
    }
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kiracı Yönetimi</h1>
          <p className="text-slate-500 mt-1">Tüm kiracı bilgilerini ve iletişim detaylarını yönetin.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Yeni Kiracı Ekle
        </button>
      </div>

      <div className="glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm shadow-slate-200/50 flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="relative w-72 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Kiracı adı veya TC ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {filteredTenants.length === 0 ? (
          <div className="flex-1 p-16 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Kiracı Bulunamadı</h3>
            <p className="text-slate-500 mb-8 max-w-md">Sisteme kayıtlı bir kiracı yok. Sözleşme yapabilmek için önce kiracı eklemelisiniz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTenants.map(tenant => (
                <div key={tenant.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm relative group">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(tenant)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTenant(tenant.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 pr-16">{tenant.name}</h3>
                      <span className="text-xs text-slate-500">TC: {tenant.tcNo}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{tenant.phone}</span>
                    </div>
                    {tenant.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{tenant.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingTenant ? 'Kiracıyı Düzenle' : 'Yeni Kiracı Ekle'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                <input
                  required name="name" type="text"
                  defaultValue={editingTenant?.name}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">TC Kimlik No</label>
                <input
                  required name="tcNo" type="text" maxLength={11}
                  defaultValue={editingTenant?.tcNo}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="11 haneli TC no"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                <input
                  required name="phone" type="tel"
                  defaultValue={editingTenant?.phone}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="05XX XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta (Opsiyonel)</label>
                <input
                  name="email" type="email"
                  defaultValue={editingTenant?.email}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  {editingTenant ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
