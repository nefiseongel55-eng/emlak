"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Building2, label: 'Mülkler', href: '/properties' },
  { icon: Users, label: 'Kiracılar', href: '/tenants' },
  { icon: FileText, label: 'Kontratlar', href: '/leases' },
  { icon: CreditCard, label: 'Ödemeler', href: '/payments' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen glass border-r border-slate-200/60 flex flex-col fixed left-0 top-0 z-40 bg-white/80">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
          E
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">EmlakYönet</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menü</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
              {item.label}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto shadow-sm shadow-blue-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
