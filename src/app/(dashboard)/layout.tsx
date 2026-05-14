"use client";

import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useStore } from '@/store/useStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadAll, loading } = useStore();

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-8 animate-fade-in relative z-10">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
}
