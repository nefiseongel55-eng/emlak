"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';

const DEFAULT_GENEL_KOSULLAR = `1. Kiracı, kiralananı özenle kullanmak ve komşulara saygı göstermekle yükümlüdür.
2. Kiralanan, yalnızca yukarıda belirtilen amaç doğrultusunda kullanılacak olup bu amaç dışında kullanılamaz.
3. Kiracı, kiraya verenin yazılı izni olmaksızın kiralananı başkasına kiralayamaz, devredemez veya kullandıramaz.
4. Kira bedeli her yıl, bir önceki kira yılında Türkiye İstatistik Kurumu'nca yayımlanan üretici fiyat endeksindeki artış oranını geçmemek koşuluyla artırılabilir.
5. Kiracı, kira bedelini her ayın belirtilen gününde ödemekle yükümlüdür. Gecikmesi hâlinde yasal faiz işletilir.
6. Kiracı, sözleşme süresi boyunca kiralananın bakımını yapmak, olağan kullanım dışında oluşan hasarları gidermekle yükümlüdür.
7. Sözleşme süresi sonunda kiracı, kiralananı teslim aldığı şekilde, temiz ve hasarsız olarak kiraya verene teslim etmekle yükümlüdür.
8. Depozito olarak yatırılan tutar, sözleşme bitiminde kiralananda hasar tespit edilmemesi hâlinde kiraya veren tarafından kiracıya eksiksiz iade edilir.
9. Kira bedelinin ödenmemesi hâlinde kiraya veren, yazılı ihtar göndererek 30 gün süre verir; bu süre içinde ödeme yapılmaması hâlinde sözleşmeyi feshedebilir.
10. Bu sözleşmeden doğabilecek her türlü anlaşmazlıkta kiralanan taşınmazın bulunduğu yer Mahkemeleri ve İcra Daireleri yetkili olup Türk hukuku uygulanır.`;

interface ContractData {
  kv_name: string; kv_tc: string; kv_address: string; kv_phone: string;
  ki_name: string; ki_tc: string; ki_address: string; ki_phone: string;
  il: string; ilce: string; mahalle: string; sokak: string;
  dis_kapi: string; ic_kapi: string; kat: string;
  ada: string; parsel: string; cinsi: string;
  aylik_kira: string; para_birimi: string; depozito: string;
  odeme_gunu: string; baslangic: string; bitis: string;
  genel_kosullar: string;
  imza_kv_unvan: string; imza_ki_unvan: string; imza_tanik_unvan: string;
}

const empty: ContractData = {
  kv_name: '', kv_tc: '', kv_address: '', kv_phone: '',
  ki_name: '', ki_tc: '', ki_address: '', ki_phone: '',
  il: '', ilce: '', mahalle: '', sokak: '',
  dis_kapi: '', ic_kapi: '', kat: '',
  ada: '', parsel: '', cinsi: 'Konut',
  aylik_kira: '', para_birimi: 'TL', depozito: '',
  odeme_gunu: '1', baslangic: '', bitis: '',
  genel_kosullar: DEFAULT_GENEL_KOSULLAR,
  imza_kv_unvan: 'Kiraya Veren', imza_ki_unvan: 'Kiracı', imza_tanik_unvan: 'Tanık',
};

function Field({
  value, onChange, placeholder = '___________', className = '', multiline = false, type = 'text'
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; className?: string; multiline?: boolean; type?: string;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className={`field-input w-full bg-transparent resize-none outline-none border-b border-dotted border-slate-400 focus:border-blue-500 placeholder-slate-300 print:border-slate-300 ${className}`}
      />
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`field-input bg-transparent outline-none border-b border-dotted border-slate-400 focus:border-blue-500 placeholder-slate-300 print:border-slate-300 ${className}`}
    />
  );
}

export default function ContractPage() {
  const { tenants, properties } = useStore();
  const [data, setData] = useState<ContractData>(empty);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof ContractData) => (val: string) =>
    setData(prev => ({ ...prev, [key]: val }));

  const fillTenant = (id: string) => {
    const t = tenants.find(x => x.id === id);
    if (!t) return;
    setData(prev => ({
      ...prev,
      ki_name: t.name,
      ki_tc: t.tcNo,
      ki_phone: t.phone,
      ki_address: prev.ki_address,
    }));
    setShowTenantMenu(false);
  };

  const fillProperty = (id: string) => {
    const p = properties.find(x => x.id === id);
    if (!p) return;
    setData(prev => ({
      ...prev,
      il: p.city,
      ilce: p.district,
      sokak: p.address,
      cinsi: p.type,
    }));
    setShowPropertyMenu(false);
  };

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #contract-print, #contract-print * { visibility: visible !important; }
          #contract-print { position: fixed; inset: 0; margin: 0; padding: 12mm 15mm; }
          .no-print { display: none !important; }
          .field-input { border-bottom: 1px solid #aaa !important; }
          textarea.field-input { border: none !important; border-bottom: none !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/leases" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kontrat Yazdırıcı</h1>
            <p className="text-slate-500 text-sm mt-0.5">Belge üzerinde doğrudan düzenleyin, ardından yazdırın.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Kiracı Seç */}
          <div className="relative">
            <button
              onClick={() => { setShowTenantMenu(v => !v); setShowPropertyMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-400 transition-colors shadow-sm"
            >
              Kiracı Seç <ChevronDown className="w-4 h-4" />
            </button>
            {showTenantMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-56 overflow-hidden">
                {tenants.length === 0
                  ? <p className="px-4 py-3 text-sm text-slate-400">Kayıtlı kiracı yok</p>
                  : tenants.map(t => (
                    <button key={t.id} onClick={() => fillTenant(t.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 border-b border-slate-100 last:border-0">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-slate-400 ml-2 text-xs">TC: {t.tcNo}</span>
                    </button>
                  ))
                }
              </div>
            )}
          </div>

          {/* Mülk Seç */}
          <div className="relative">
            <button
              onClick={() => { setShowPropertyMenu(v => !v); setShowTenantMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-400 transition-colors shadow-sm"
            >
              Mülk Seç <ChevronDown className="w-4 h-4" />
            </button>
            {showPropertyMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-56 overflow-hidden">
                {properties.length === 0
                  ? <p className="px-4 py-3 text-sm text-slate-400">Kayıtlı mülk yok</p>
                  : properties.map(p => (
                    <button key={p.id} onClick={() => fillProperty(p.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 border-b border-slate-100 last:border-0">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-slate-400 ml-2 text-xs">{p.district}</span>
                    </button>
                  ))
                }
              </div>
            )}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-500/30"
          >
            <Printer className="w-4 h-4" />
            Yazdır / PDF
          </button>
        </div>
      </div>

      {/* A4 Contract Document */}
      <div className="no-print max-w-5xl mx-auto pb-12">
        <div
          id="contract-print"
          ref={printRef}
          className="bg-white shadow-2xl rounded-sm mx-auto"
          style={{ width: '210mm', minHeight: '297mm', padding: '16mm 18mm', fontFamily: 'Times New Roman, serif', fontSize: '10.5pt', color: '#111', lineHeight: '1.5' }}
        >
          {/* Başlık */}
          <div style={{ textAlign: 'center', marginBottom: '10mm' }}>
            <div style={{ fontSize: '16pt', fontWeight: 'bold', letterSpacing: '2px', borderBottom: '2px solid #111', paddingBottom: '4mm', marginBottom: '2mm' }}>
              KİRA SÖZLEŞMESİ
            </div>
            <div style={{ fontSize: '9pt', color: '#555' }}>
              6098 Sayılı Türk Borçlar Kanunu Hükümlerine Göre Düzenlenmiştir
            </div>
          </div>

          {/* TARAFLAR */}
          <SectionTitle>1. TARAFLAR</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6mm' }}>
            <thead>
              <tr>
                <th style={thStyle}>KİRAYA VEREN (MÜLKİYET SAHİBİ)</th>
                <th style={thStyle}>KİRACI</th>
              </tr>
            </thead>
            <tbody>
              <TwoColRow label="Ad Soyad / Unvan">
                <Field value={data.kv_name} onChange={set('kv_name')} placeholder="Ad Soyad" className="w-full text-sm" />
                <Field value={data.ki_name} onChange={set('ki_name')} placeholder="Ad Soyad" className="w-full text-sm" />
              </TwoColRow>
              <TwoColRow label="T.C. Kimlik No">
                <Field value={data.kv_tc} onChange={set('kv_tc')} placeholder="_ _ _ _ _ _ _ _ _ _ _" className="w-full text-sm" />
                <Field value={data.ki_tc} onChange={set('ki_tc')} placeholder="_ _ _ _ _ _ _ _ _ _ _" className="w-full text-sm" />
              </TwoColRow>
              <TwoColRow label="Adres">
                <Field value={data.kv_address} onChange={set('kv_address')} placeholder="Açık adres" className="w-full text-sm" />
                <Field value={data.ki_address} onChange={set('ki_address')} placeholder="Açık adres" className="w-full text-sm" />
              </TwoColRow>
              <TwoColRow label="Telefon">
                <Field value={data.kv_phone} onChange={set('kv_phone')} placeholder="0___ ___ __ __" className="w-full text-sm" />
                <Field value={data.ki_phone} onChange={set('ki_phone')} placeholder="0___ ___ __ __" className="w-full text-sm" />
              </TwoColRow>
            </tbody>
          </table>

          {/* KİRALANAN YER */}
          <SectionTitle>2. KİRALANAN YER BİLGİLERİ</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6mm' }}>
            <tbody>
              <tr>
                <LabelCell>İl</LabelCell>
                <td style={tdStyle}><Field value={data.il} onChange={set('il')} placeholder="İl" className="w-full text-sm" /></td>
                <LabelCell>İlçe</LabelCell>
                <td style={tdStyle}><Field value={data.ilce} onChange={set('ilce')} placeholder="İlçe" className="w-full text-sm" /></td>
                <LabelCell>Mahalle</LabelCell>
                <td style={tdStyle}><Field value={data.mahalle} onChange={set('mahalle')} placeholder="Mahalle" className="w-full text-sm" /></td>
              </tr>
              <tr>
                <LabelCell>Sokak / Cadde</LabelCell>
                <td style={tdStyle} colSpan={3}><Field value={data.sokak} onChange={set('sokak')} placeholder="Sokak / Cadde adı" className="w-full text-sm" /></td>
                <LabelCell>Dış Kapı No</LabelCell>
                <td style={tdStyle}><Field value={data.dis_kapi} onChange={set('dis_kapi')} placeholder="No" className="w-full text-sm" /></td>
              </tr>
              <tr>
                <LabelCell>İç Kapı / Daire No</LabelCell>
                <td style={tdStyle}><Field value={data.ic_kapi} onChange={set('ic_kapi')} placeholder="Daire" className="w-full text-sm" /></td>
                <LabelCell>Kat</LabelCell>
                <td style={tdStyle}><Field value={data.kat} onChange={set('kat')} placeholder="Kat" className="w-full text-sm" /></td>
                <LabelCell>Ada</LabelCell>
                <td style={tdStyle}><Field value={data.ada} onChange={set('ada')} placeholder="Ada No" className="w-full text-sm" /></td>
              </tr>
              <tr>
                <LabelCell>Parsel</LabelCell>
                <td style={tdStyle}><Field value={data.parsel} onChange={set('parsel')} placeholder="Parsel No" className="w-full text-sm" /></td>
                <LabelCell>Kiralananın Cinsi</LabelCell>
                <td style={tdStyle} colSpan={3}>
                  <select
                    value={data.cinsi}
                    onChange={e => set('cinsi')(e.target.value)}
                    style={{ background: 'transparent', outline: 'none', borderBottom: '1px dotted #94a3b8', width: '100%', fontSize: '10.5pt' }}
                  >
                    <option>Konut</option>
                    <option>İşyeri</option>
                    <option>Depo</option>
                    <option>Arsa</option>
                    <option>Diğer</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          {/* KİRA KOŞULLARI */}
          <SectionTitle>3. KİRA BEDELİ VE ÖDEME KOŞULLARI</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6mm' }}>
            <tbody>
              <tr>
                <LabelCell>Aylık Kira Bedeli</LabelCell>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Field value={data.aylik_kira} onChange={set('aylik_kira')} placeholder="0,00" className="text-sm" style={{ width: '80px' }} />
                    <select
                      value={data.para_birimi}
                      onChange={e => set('para_birimi')(e.target.value)}
                      style={{ background: 'transparent', outline: 'none', borderBottom: '1px dotted #94a3b8', fontSize: '10.5pt' }}
                    >
                      <option>TL</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                </td>
                <LabelCell>Depozito / Teminat</LabelCell>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Field value={data.depozito} onChange={set('depozito')} placeholder="0,00" className="text-sm" />
                    <span style={{ fontSize: '9pt', color: '#555' }}>{data.para_birimi}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <LabelCell>Ödeme Günü</LabelCell>
                <td style={tdStyle}>
                  Her ayın <Field value={data.odeme_gunu} onChange={set('odeme_gunu')} placeholder="1" className="text-sm" style={{ width: '30px', textAlign: 'center' }} />. günü
                </td>
                <LabelCell>Ödeme Yöntemi</LabelCell>
                <td style={tdStyle}>
                  <select
                    defaultValue="Banka Havalesi / EFT"
                    style={{ background: 'transparent', outline: 'none', borderBottom: '1px dotted #94a3b8', width: '100%', fontSize: '10.5pt' }}
                  >
                    <option>Banka Havalesi / EFT</option>
                    <option>Nakit</option>
                    <option>Çek</option>
                  </select>
                </td>
              </tr>
              <tr>
                <LabelCell>Başlangıç Tarihi</LabelCell>
                <td style={tdStyle}>
                  <Field type="date" value={data.baslangic} onChange={set('baslangic')} className="text-sm" />
                </td>
                <LabelCell>Bitiş Tarihi</LabelCell>
                <td style={tdStyle}>
                  <Field type="date" value={data.bitis} onChange={set('bitis')} className="text-sm" />
                </td>
              </tr>
            </tbody>
          </table>

          {/* GENEL KOŞULLAR */}
          <SectionTitle>4. GENEL KOŞULLAR</SectionTitle>
          <div style={{ border: '1px solid #ccc', borderRadius: '2px', padding: '3mm 4mm', marginBottom: '6mm', minHeight: '42mm' }}>
            <Field
              multiline
              value={data.genel_kosullar}
              onChange={set('genel_kosullar')}
              placeholder="Genel koşulları buraya girin..."
              className="text-xs leading-relaxed w-full"
            />
          </div>

          {/* İMZALAR */}
          <SectionTitle>5. İMZALAR</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6mm', marginTop: '2mm' }}>
            {(['kv', 'ki', 'tanik'] as const).map((role, i) => {
              const unvanKey = `imza_${role}_unvan` as keyof ContractData;
              const labels = ['Kiraya Veren', 'Kiracı', 'Tanık'];
              const names = [data.kv_name, data.ki_name, ''];
              return (
                <div key={role} style={{ border: '1px solid #ccc', borderRadius: '2px', padding: '3mm', textAlign: 'center' }}>
                  <div style={{ fontSize: '8pt', fontWeight: 'bold', color: '#444', marginBottom: '1mm', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Field
                      value={data[unvanKey]}
                      onChange={set(unvanKey)}
                      className="text-center text-xs font-bold"
                      style={{ width: '100%', textTransform: 'uppercase' }}
                    />
                  </div>
                  {names[i] && (
                    <div style={{ fontSize: '9pt', color: '#333', marginBottom: '1mm' }}>{names[i]}</div>
                  )}
                  <div style={{ height: '18mm', borderBottom: '1px solid #aaa', marginTop: '2mm', marginBottom: '2mm' }} />
                  <div style={{ fontSize: '8pt', color: '#666' }}>Tarih: ___.___.______</div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '6mm', borderTop: '1px solid #ddd', paddingTop: '3mm', fontSize: '7.5pt', color: '#888', textAlign: 'center' }}>
            Bu sözleşme {new Date().toLocaleDateString('tr-TR')} tarihinde düzenlenmiş olup taraflarca okunarak imzalanmıştır.
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  background: '#1e3a5f', color: '#fff', padding: '3mm 4mm',
  fontWeight: 'bold', fontSize: '9pt', textAlign: 'center',
  border: '1px solid #1e3a5f', letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc', padding: '2mm 3mm', verticalAlign: 'middle',
};

const labelStyle: React.CSSProperties = {
  border: '1px solid #ccc', padding: '2mm 3mm',
  background: '#f1f5f9', fontWeight: 'bold', fontSize: '9pt',
  whiteSpace: 'nowrap', color: '#334155',
};

function LabelCell({ children }: { children: React.ReactNode }) {
  return <td style={labelStyle}>{children}</td>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#1e3a5f', color: '#fff', padding: '2mm 4mm',
      fontWeight: 'bold', fontSize: '10pt', letterSpacing: '0.5px',
      marginBottom: '2mm', marginTop: '1mm',
    }}>
      {children}
    </div>
  );
}

function TwoColRow({ label, children }: { label: string; children: [React.ReactNode, React.ReactNode] }) {
  return (
    <tr>
      <td style={labelStyle}>{label}</td>
      <td style={tdStyle}>{children[0]}</td>
      <td style={tdStyle}>{children[1]}</td>
    </tr>
  );
}
