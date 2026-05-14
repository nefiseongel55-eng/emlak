"use client";

import { Bell, Search, User, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between bg-white/70 backdrop-blur-sm sticky top-0 z-30 border-b border-slate-200/60">
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative group flex-1 max-w-sm md:max-w-md">
          <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Mülk, kiracı veya kontrat ara..."
            className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-3">
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="hidden sm:block h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shrink-0">
            <User className="w-4 h-4 md:w-5 md:h-5" />
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
