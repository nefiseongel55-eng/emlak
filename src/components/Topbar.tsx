"use client";

import { Bell, Search, User } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-20 px-8 flex items-center justify-between glass sticky top-0 z-30 bg-white/70 border-b border-slate-200/60">
      <div className="relative w-96 group">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Mülk, kiracı veya kontrat ara..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">Yönetici</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
