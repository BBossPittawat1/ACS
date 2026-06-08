'use client';

import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen selection:bg-primary/30">
      <div className="mx-auto flex h-screen max-w-7xl overflow-hidden">
        <Sidebar />

        <main className="relative z-0 h-full min-w-0 flex-1 overflow-y-auto px-4 pb-24 pt-6 md:px-8 md:pb-6">
          <div className="mb-6 flex items-center justify-between px-2 md:hidden">
            <div className="flex items-center gap-2 text-primary">
              <div className="rounded-xl bg-gradient-to-tr from-primary/80 to-secondary p-2 shadow-sm">
                <Sparkles className="h-5 w-5 text-primary-content" />
              </div>
              <h1 className="text-xl font-bold">ห้องเรียนครูเก้า</h1>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-base-100 text-lg shadow-sm">
              👩🏻‍🏫
            </div>
          </div>

          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
