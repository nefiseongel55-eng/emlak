"use client";

import { useState } from 'react';
import { Plus, Search, User, Phone, Mail, X, Trash2, Building } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function LandlordsPage() {
  const { landlords, properties, addLandlord, deleteLandlord } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLandlordId, setSelectedLandlordId] = useState<string | null>(null);

  const filteredLandlords = landlords.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addLandlord({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      tcNo: formData.get('tcNo') as string,
      iban: formData.get('iban') as string,
    });
    setIsModalOpen(false);
  };

  const selectedLandlord = landlords.find(l => l.id === selectedLandlordId);
  const landlordProperties = properties.filter(p => p.landlordId === selectedLandlordId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mülk Sahipleri</h1>
          <p className="text-slate-500 mt-1">Sistemdeki mülk sahiplerini yönetin ve portföylerini inceleyin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-indigo-500/30"
        >
          <Plus className="w-5 h-5" />
          Yeni Sahip Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Landlords List */}
        <div className="lg:col-span-1 glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-100 bg-white/50">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
              <input
                type="text"
                placeholder="Sahip adı veya telefon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredLandlords.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Sahip bulunamadı.</div>
            ) : (
              filteredLandlords.map(landlord => (
                <button
                  key={landlord.id}
                  onClick={() => setSelectedLandlordId(landlord.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedLandlordId === landlord.id
                    ? 'bg-indigo-50 border border-indigo-100 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    selectedLandlordId === landlord.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {landlord.name.charAt(0)}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className={`font-semibold text-sm truncate ${selectedLandlordId === landlord.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {landlord.name}
                    </p>
                    <p className="text-xs text-slate-500">{landlord.phone}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Details Area */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedLandlord ? (
            <div className="glass rounded-2xl border border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-500">Detayları görmek için bir mülk sahibi seçin</h3>
            </div>
          ) : (
            <>
              {/* Landlord Profile Card */}
              <div className="glass rounded-2xl p-6 border border-slate-200/60 shadow-sm bg-white/50 relative">
                <button
                  onClick={async () => {
                    await deleteLandlord(selectedLandlord.id);
                    setSelectedLandlordId(null);
                  }}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-200">
                    {selectedLandlord.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedLandlord.name}</h2>
                    <p className="text-slate-500">Kayıt Tarihi: {new Date(selectedLandlord.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-indigo-500" />
                    <span>{selectedLandlord.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span>{selectedLandlord.email || 'E-posta belirtilmemiş'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="text-xs font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded leading-none">TC</div>
                    <span>{selectedLandlord.tcNo || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="text-xs font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded leading-none">IBAN</div>
                    <span className="font-mono text-sm">{selectedLandlord.iban || 'Belirtilmemiş'}</span>
                  </div>
                </div>
              </div>

              {/* Owned Properties Card */}
              <div className="glass rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden bg-white/50">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-500" />
                    Sahip Olduğu Mülkler ({landlordProperties.length})
                  </h3>
                </div>

                <div className="p-6">
                  {landlordProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-400 italic">Henüz bu kişiye atanmış bir mülk bulunmuyor.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {landlordProperties.map(property => (
                        <div key={property.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-1">{property.name}</h4>
                          <p className="text-xs text-slate-500 mb-3 truncate">{property.address}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{property.type}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              property.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {property.status === 'AVAILABLE' ? 'Müsait' : 'Kirada'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Yeni Mülk Sahibi Ekle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ad Soyad / Firma Ünvanı</label>
                  <input required name="name" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Örn: Ahmet Yılmaz" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon</label>
                  <input required name="phone" type="tel" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="05xx xxx xx xx" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">T.C. / Vergi No</label>
                  <input name="tcNo" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="11 haneli numara" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
                  <input name="email" type="email" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="örnek@eposta.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">IBAN</label>
                <input name="iban" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono" placeholder="TR00 0000 0000..." />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors">İptal</button>
                <button type="submit" className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">Sahibi Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
