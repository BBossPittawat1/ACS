import type { Metadata, Viewport } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';
import { AntdProvider } from '@/providers/AntdProvider';
import { AppProvider } from '@/providers/AppProvider';
const prompt = Prompt({
  variable: '--font-prompt',
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ห้องเรียนครูเก้า | ระบบเช็คชื่อนักเรียน',
  description: 'ระบบเช็คชื่อและจัดการข้อมูลนักเรียน สำหรับครูประจำชั้น',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ห้องเรียนครูเก้า',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#e879a9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full antialiased">
        <AntdProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
