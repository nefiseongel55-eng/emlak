"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Calendar, Wallet, Trash2, Download, Printer } from 'lucide-react';
import { useStore } from '@/store/useStore';
import jsPDF from 'jspdf';

export default function LeasesPage() {
  const { leases, properties, tenants, deleteLease } = useStore();
  const [search, setSearch] = useState("");

  const filteredLeases = leases.filter(l => {
    const prop = properties.find(p => p.id === l.propertyId);
    const tenant = tenants.find(t => t.id === l.tenantId);
    const matchProp = prop?.name.toLowerCase().includes(search.toLowerCase());
    const matchTenant = tenant?.name.toLowerCase().includes(search.toLowerCase());
    return matchProp || matchTenant;
  });

  const downloadPDF = (leaseId: string) => {
    const lease = leases.find(l => l.id === leaseId);
    if (!lease) return;
    const prop = properties.find(p => p.id === lease.propertyId);
    const tenant = tenants.find(t => t.id === lease.tenantId);

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("KIRA SOZLESMESI", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. TARAFLAR", 20, 40);

    doc.setFont("helvetica", "normal");
    doc.text(`Kiraci Ad Soyad: ${tenant?.name || '-'}`, 20, 50);
    doc.text(`Kiraci TC No: ${tenant?.tcNo || '-'}`, 20, 60);
    doc.text(`Kiraci Telefon: ${tenant?.phone || '-'}`, 20, 70);

    doc.setFont("helvetica", "bold");
    doc.text("2. KIRALANAN MULK", 20, 90);

    doc.setFont("helvetica", "normal");
    doc.text(`Mulk Adi: ${prop?.name || '-'}`, 20, 100);
    doc.text(`Adres: ${prop?.address || '-'}, ${prop?.district || '-'}/${prop?.city || '-'}`, 20, 110);
    doc.text(`Mulk Tipi: ${prop?.type || '-'}`, 20, 120);

    doc.setFont("helvetica", "bold");
    doc.text("3. SOZLESME SARTLARI", 20, 140);

    doc.setFont("helvetica", "normal");
    doc.text(`Baslangic Tarihi: ${lease.startDate}`, 20, 150);
    doc.text(`Bitis Tarihi: ${lease.endDate}`, 20, 160);
    doc.text(`Aylik Kira Bedeli: ${lease.rentAmount} ${lease.currency}`, 20, 170);
    doc.text(`Odeme Gunu: Her ayin ${lease.dueDay || 1}. gunu`, 20, 180);
    doc.text(`Artis Tipi: ${lease.increaseType || '-'}`, 20, 190);

    doc.setFont("helvetica", "bold");
    doc.text("IMZALAR", 20, 230);

    doc.setFont("helvetica", "normal");
    doc.text("KIRAYA VEREN", 40, 250);
    doc.text("KIRACI", 140, 250);

    doc.save(`Kira_Sozlesmesi_${tenant?.name?.replace(/\s+/g, '_') || 'sozlesme'}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kira Kontratları</h1>
          <p className="text-slate-500 mt-1">Sözleşmeleri oluşturun, görüntüleyin ve yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/leases/contract"
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Kontrat Yazdırıcı
          </Link>
          <Link
            href="/leases/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            Yeni Kontrat Oluştur
          </Link>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm shadow-slate-200/50 flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="relative w-72 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Mülk veya kiracı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {filteredLeases.length === 0 ? (
          <div className="flex-1 p-16 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-amber-100">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Henüz kontrat bulunmuyor</h3>
            <p className="text-slate-500 mb-8 max-w-md">Sisteme kayıtlı bir kira sözleşmesi yok. Sağ üstteki butonu kullanarak yeni bir kontrat oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredLeases.map(lease => {
                const prop = properties.find(p => p.id === lease.propertyId);
                const tenant = tenants.find(t => t.id === lease.tenantId);
                return (
                  <div key={lease.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-300 transition-colors shadow-sm flex flex-col sm:flex-row gap-4 relative group">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">
                          Aktif Kontrat
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => downloadPDF(lease.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="PDF İndir"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLease(lease.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Kontratı Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <h3 className="font-bold text-lg text-slate-800">{prop?.name || 'Bilinmeyen Mülk'}</h3>
                        <p className="text-sm text-slate-600">Kiracı: <span className="font-medium text-slate-800">{tenant?.name || 'Bilinmeyen Kiracı'}</span></p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Bitiş Tarihi</p>
                            <p className="text-sm font-semibold text-slate-700">{new Date(lease.endDate).toLocaleDateString('tr-TR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Aylık Kira</p>
                            <p className="text-sm font-semibold text-slate-700">{lease.rentAmount.toLocaleString('tr-TR')} {lease.currency}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
