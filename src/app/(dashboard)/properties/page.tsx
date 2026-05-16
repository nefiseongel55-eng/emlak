"use client";

import { useState } from 'react';
import { Plus, Search, Building2, MapPin, X, Trash2, Pencil, User, History, Calendar } from 'lucide-react';
import { useStore, Property } from '@/store/useStore';

export default function PropertiesPage() {
  const { properties, landlords, leases, tenants, addProperty, updateProperty, deleteProperty } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingProperty(null); setIsModalOpen(true); };
  const openEdit = (property: Property) => { setEditingProperty(property); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingProperty(null); };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      landlordId: (formData.get('landlordId') as string) || undefined,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      district: formData.get('district') as string,
      status: formData.get('status') as string,
    };
    if (editingProperty) {
      await updateProperty(editingProperty.id, data);
    } else {
      await addProperty(data);
    }
    closeModal();
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const propertyLeases = leases.filter(l => l.propertyId === selectedPropertyId);
  const currentLease = propertyLeases.find(l => l.status === 'ACTIVE');
  const pastLeases = propertyLeases.filter(l => l.status !== 'ACTIVE');
  const propertyLandlord = landlords.find(l => l.id === selectedProperty?.landlordId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mülk Yönetimi</h1>
          <p className="text-slate-500 mt-1">Portföyünüzdeki tüm mülkleri yönetin ve kiralama geçmişini takip edin.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Yeni Mülk Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties List */}
        <div className={`${selectedPropertyId ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-4 transition-all duration-300`}>
          <div className="glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm bg-white/50">
            <div className="p-4 border-b border-slate-100">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="Mülk ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
              </div>
            </div>

            <div className={`p-4 ${selectedPropertyId ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              {filteredProperties.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400">Mülk bulunamadı.</div>
              ) : (
                filteredProperties.map(property => (
                  <div
                    key={property.id}
                    onClick={() => setSelectedPropertyId(property.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      selectedPropertyId === property.id
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                    }`}
                  >
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(property); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProperty(property.id); if (selectedPropertyId === property.id) setSelectedPropertyId(null); }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedPropertyId === property.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-800 truncate pr-16">{property.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{property.type}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{property.city}, {property.district}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        property.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {property.status === 'AVAILABLE' ? 'Müsait' : 'Kirada'}
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Property Detail Side Panel */}
        {selectedPropertyId && selectedProperty && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 border border-slate-200/60 shadow-sm bg-white/50 relative">
              <button
                onClick={() => setSelectedPropertyId(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedProperty.name}</h2>
                  <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4" />
                    {selectedProperty.address}, {selectedProperty.district}/{selectedProperty.city}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mülk Sahibi</p>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <User className="w-4 h-4 text-blue-500" />
                    {propertyLandlord ? propertyLandlord.name : 'Sahip atanmamış'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Durum</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                    selectedProperty.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${selectedProperty.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {selectedProperty.status === 'AVAILABLE' ? 'Kiralık / Boş' : 'Kirada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Lease */}
            <div className="glass rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden bg-white/50">
              <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Güncel Kiracı Bilgileri
                </h3>
                {currentLease && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">AKTİF KONTRAT</span>
                )}
              </div>
              <div className="p-6">
                {!currentLease ? (
                  <div className="text-center py-6">
                    <p className="text-slate-400 text-sm italic">Şu an aktif bir kiralama kaydı bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {tenants.find(t => t.id === currentLease.tenantId)?.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{tenants.find(t => t.id === currentLease.tenantId)?.name}</h4>
                        <p className="text-xs text-slate-500">{tenants.find(t => t.id === currentLease.tenantId)?.phone}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Kira Bedeli</p>
                        <p className="text-lg font-black text-slate-800">₺{currentLease.rentAmount.toLocaleString('tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bitiş Tarihi</p>
                        <p className="text-sm font-bold text-slate-700">{new Date(currentLease.endDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className="glass rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden bg-white/50">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-800">Geçmiş Kiracılar</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {pastLeases.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Geçmiş kiralama kaydı bulunmuyor.</div>
                ) : (
                  pastLeases.map(lease => {
                    const tenant = tenants.find(t => t.id === lease.tenantId);
                    return (
                      <div key={lease.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                            {tenant?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{tenant?.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(lease.startDate).toLocaleDateString('tr-TR')} - {new Date(lease.endDate).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-600">₺{lease.rentAmount.toLocaleString('tr-TR')}</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lease.status}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingProperty ? 'Mülkü Düzenle' : 'Yeni Mülk Ekle'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mülk Sahibi</label>
                  <select name="landlordId" defaultValue={editingProperty?.landlordId || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all">
                    <option value="">Sahip Seçin (Opsiyonel)</option>
                    {landlords.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mülk Adı / Referans</label>
                  <input required name="name" type="text" defaultValue={editingProperty?.name} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Örn: Nilüfer 3+1 Daire" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tip</label>
                  <select name="type" defaultValue={editingProperty?.type || 'Konut'} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all">
                    <option value="Konut">Konut</option>
                    <option value="İşyeri">İşyeri</option>
                    <option value="Arsa">Arsa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Durum</label>
                  <select name="status" defaultValue={editingProperty?.status || 'AVAILABLE'} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all">
                    <option value="AVAILABLE">Boş / Kiralık</option>
                    <option value="RENTED">Kirada</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">İl</label>
                  <input required name="city" type="text" defaultValue={editingProperty?.city} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Bursa" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">İlçe</label>
                  <input required name="district" type="text" defaultValue={editingProperty?.district} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Nilüfer" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Açık Adres</label>
                <textarea required name="address" rows={2} defaultValue={editingProperty?.address} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all" placeholder="Tam adres giriniz..." />
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors">İptal</button>
                <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                  {editingProperty ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
