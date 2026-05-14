"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ArrowLeft, FileSignature, Save } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';

export default function NewLeasePage() {
  const router = useRouter();
  const { properties, tenants, addLease } = useStore();
  
  // Available properties (not rented)
  const availableProperties = properties.filter(p => p.status === 'AVAILABLE');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const leaseData = {
      propertyId: formData.get('propertyId') as string,
      tenantId: formData.get('tenantId') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      rentAmount: Number(formData.get('rentAmount')),
      currency: formData.get('currency') as string,
      status: 'ACTIVE',
      increaseType: formData.get('increaseType') as string,
      increaseRate: Number(formData.get('increaseRate') || 0),
      dueDay: Number(formData.get('dueDay') || 1),
    };

    // Save to store
    addLease(leaseData);

    // Get details for PDF
    const prop = properties.find(p => p.id === leaseData.propertyId);
    const tenant = tenants.find(t => t.id === leaseData.tenantId);

    // Generate PDF
    generatePDF(prop, tenant, leaseData);

    // Return to leases list
    router.push('/leases');
  };

  const generatePDF = (prop: any, tenant: any, lease: any) => {
    const doc = new jsPDF();
    
    // Turkish characters might not render perfectly in base jsPDF font, using English-equivalent chars or basic text for MVP
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("KIRA SOZLESMESI", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. TARAFLAR", 20, 40);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Kiraci Ad Soyad: ${tenant?.name}`, 20, 50);
    doc.text(`Kiraci TC No: ${tenant?.tcNo}`, 20, 60);
    doc.text(`Kiraci Telefon: ${tenant?.phone}`, 20, 70);

    doc.setFont("helvetica", "bold");
    doc.text("2. KIRALANAN MULK", 20, 90);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Mulk Adi: ${prop?.name}`, 20, 100);
    doc.text(`Adres: ${prop?.address}, ${prop?.district}/${prop?.city}`, 20, 110);
    doc.text(`Mulk Tipi: ${prop?.type}`, 20, 120);

    doc.setFont("helvetica", "bold");
    doc.text("3. SOZLESME SARTLARI", 20, 140);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Baslangic Tarihi: ${lease.startDate}`, 20, 150);
    doc.text(`Bitis Tarihi: ${lease.endDate}`, 20, 160);
    doc.text(`Aylik Kira Bedeli: ${lease.rentAmount} ${lease.currency}`, 20, 170);
    doc.text(`Odeme Gunu: Her ayin ${lease.dueDay}. gunu`, 20, 180);
    doc.text(`Artis Orani Tipi: ${lease.increaseType}`, 20, 190);

    doc.setFont("helvetica", "bold");
    doc.text("IMZALAR", 20, 230);
    
    doc.setFont("helvetica", "normal");
    doc.text("KIRAYA VEREN", 40, 250);
    doc.text("KIRACI", 140, 250);

    doc.save(`Kira_Sozlesmesi_${tenant?.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leases" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Yeni Kontrat Oluştur</h1>
          <p className="text-slate-500 mt-1">Sisteme kayıtlı kiracı ve mülkü seçerek otomatik sözleşme PDF'i üretebilirsiniz.</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-200/60 p-8 shadow-sm shadow-slate-200/50">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Taraflar ve Mülk */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileSignature className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Taraflar ve Mülk</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kiracı Seçimi</label>
                <select required name="tenantId" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all shadow-sm">
                  <option value="">-- Kiracı Seçin --</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name} (TC: {t.tcNo})</option>
                  ))}
                </select>
                {tenants.length === 0 && <p className="text-xs text-rose-500 mt-1">Sistemde kayıtlı kiracı bulunmuyor. Lütfen önce kiracı ekleyin.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mülk Seçimi (Sadece Boş Mülkler)</label>
                <select required name="propertyId" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all shadow-sm">
                  <option value="">-- Mülk Seçin --</option>
                  {availableProperties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.district}</option>
                  ))}
                </select>
                {availableProperties.length === 0 && <p className="text-xs text-rose-500 mt-1">Sistemde boş/kiralık mülk bulunmuyor.</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Finansal Detaylar */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-800">Finansal Şartlar</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Aylık Kira Bedeli</label>
                <input required name="rentAmount" type="number" min="0" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Örn: 15000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Para Birimi</label>
                <select name="currency" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all shadow-sm">
                  <option value="TRY">TL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ödeme Günü</label>
                <input required name="dueDay" type="number" min="1" max="31" defaultValue="1" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" />
                <p className="text-xs text-slate-400 mt-1">Her ayın kaçıncı günü?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Artış Tipi</label>
                <select name="increaseType" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all shadow-sm">
                  <option value="TUFE">TÜFE (Yasal Sınır)</option>
                  <option value="SABIT">Sabit Oran</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sabit Artış Oranı (%)</label>
                <input name="increaseRate" type="number" min="0" defaultValue="0" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>

          {/* Section 3: Tarihler */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-800">Sözleşme Süresi</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Başlangıç Tarihi</label>
                <input required name="startDate" type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bitiş Tarihi</label>
                <input required name="endDate" type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm bg-white" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">Kaydettikten sonra PDF kontrat otomatik olarak bilgisayarınıza indirilecektir.</p>
            <button 
              type="submit" 
              disabled={tenants.length === 0 || availableProperties.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
            >
              <Save className="w-5 h-5" />
              Sözleşmeyi Kaydet & PDF İndir
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
