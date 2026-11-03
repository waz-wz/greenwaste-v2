import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GreenWaste - Smart Waste Sorting Dashboard',
  description:
    'IoT Monitoring and Control Dashboard for Smart Waste Sorting System',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#0a0f18] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
