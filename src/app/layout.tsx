import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EmlakYönet',
  description: 'Emlak ve Kira Yönetim Sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
