"use client";

import { useState } from 'react';
import { Plus, Search, Building2, MapPin, X, Trash2, Pencil } from 'lucide-react';
import { useStore, Property } from '@/store/useStore';

export default function PropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [search, setSearch] = useState("");

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const openEdit = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      district: formData.get('district') as string,
      status: formData.get('status') as string,
    };
    if (editingProperty) {
      updateProperty(editingProperty.id, data);
    } else {
      addProperty(data);
    }
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mülk Yönetimi</h1>
          <p className="text-slate-500 mt-1">Portföyünüzdeki tüm mülkleri buradan görüntüleyip yönetebilirsiniz.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Yeni Mülk Ekle
        </button>
      </div>

      <div className="glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm shadow-slate-200/50 flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="relative w-72 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Mülk adı veya adres ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="flex-1 p-16 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <Building2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Mülk Bulunamadı</h3>
            <p className="text-slate-500 mb-8 max-w-md">Henüz bu kriterlere uygun bir mülkünüz yok. Sağ üstten yeni bir mülk ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map(property => (
                <div key={property.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors shadow-sm relative group">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(property)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 pr-16">{property.name}</h3>
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{property.type}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{property.address}, {property.district}/{property.city}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Eklenme: {new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      property.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {property.status === 'AVAILABLE' ? 'Müsait' : 'Kirada'}
                    </span>
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
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingProperty ? 'Mülkü Düzenle' : 'Yeni Mülk Ekle'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mülk Adı / Referans</label>
                <input
                  required name="name" type="text"
                  defaultValue={editingProperty?.name}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="Örn: Nilüfer 3+1 Daire"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tip</label>
                  <select name="type" defaultValue={editingProperty?.type || 'Konut'} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                    <option value="Konut">Konut</option>
                    <option value="İşyeri">İşyeri</option>
                    <option value="Arsa">Arsa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                  <select name="status" defaultValue={editingProperty?.status || 'AVAILABLE'} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                    <option value="AVAILABLE">Boş / Kiralık</option>
                    <option value="RENTED">Kirada</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">İl</label>
                  <input
                    required name="city" type="text"
                    defaultValue={editingProperty?.city}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Bursa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">İlçe</label>
                  <input
                    required name="district" type="text"
                    defaultValue={editingProperty?.district}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Nilüfer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açık Adres</label>
                <textarea
                  required name="address" rows={2}
                  defaultValue={editingProperty?.address}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  placeholder="Tam adres giriniz..."
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
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
