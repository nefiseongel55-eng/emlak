"use client";

import Link from 'next/link';
import { Building2, Users, Wallet, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Dashboard() {
  const { properties, tenants, leases } = useStore();

  const activeLeases = leases.filter(l => l.status === 'ACTIVE');
  const totalRent = activeLeases.reduce((sum, l) => sum + (Number(l.rentAmount) || 0), 0);

  const stats = [
    { 
      title: 'Toplam Mülk', 
      value: properties.length.toString(), 
      trend: '+1', 
      trendUp: true,
      icon: Building2,
      colorClass: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Aktif Kiracı', 
      value: tenants.length.toString(), 
      trend: '+1', 
      trendUp: true,
      icon: Users,
      colorClass: 'bg-indigo-100 text-indigo-600'
    },
    { 
      title: 'Aylık Gelir (Beklenen)', 
      value: `₺${totalRent.toLocaleString('tr-TR')}`, 
      trend: '%100', 
      trendUp: true,
      icon: Wallet,
      colorClass: 'bg-emerald-100 text-emerald-600'
    },
    { 
      title: 'Geciken Ödeme', 
      value: '0', 
      trend: '0', 
      trendUp: false,
      icon: AlertCircle,
      colorClass: 'bg-rose-100 text-rose-600'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Genel Bakış</h1>
        <p className="text-slate-500 mt-1">Hoş geldiniz, işte portföyünüzün güncel durumu.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 hover-lift border border-slate-200/60 shadow-sm shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.colorClass}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.trend}
              </span>
              <span className="text-slate-400 ml-2">geçen aya göre</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-200/60 shadow-sm shadow-slate-200/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800">Gelir Analizi</h2>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1.5 outline-none hover:border-blue-300 transition-colors">
              <option>Bu Yıl</option>
              <option>Geçen Yıl</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 mt-auto">
            {/* Dummy Bar Chart */}
            {[40, 60, 45, 80, 55, 90, 70, 100, 65, 85, 75, 95].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-3 group">
                <div className="w-full bg-blue-50 rounded-t-md overflow-hidden relative" style={{ height: '200px' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-blue-500 group-hover:bg-blue-600 transition-all duration-300 rounded-t-md" 
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                  {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6 border border-slate-200/60 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Aktif Sözleşmeler</h2>
            <Link href="/leases" className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">Tümü</Link>
          </div>
          <div className="space-y-4">
            {activeLeases.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Henüz aktif sözleşme bulunmuyor.</p>
            ) : (
              activeLeases.slice(0, 5).map((lease, i) => {
                const tenant = tenants.find(t => t.id === lease.tenantId);
                const prop = properties.find(p => p.id === lease.propertyId);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                        {tenant?.name.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{tenant?.name || 'Bilinmeyen Kiracı'}</p>
                        <p className="text-xs text-slate-500">{prop?.name || 'Bilinmeyen Mülk'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">₺{lease.rentAmount.toLocaleString('tr-TR')}</p>
                      <p className="text-xs text-emerald-500 font-medium">Aktif</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
