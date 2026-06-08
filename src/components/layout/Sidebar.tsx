'use client';

import { CheckSquare, Home, Settings, Sparkles, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/components/layout/NavItems';
import { isActiveRoute, routeLabel, type AppRoute } from '@/lib/routes';

const NAV_ITEMS: { route: AppRoute; icon: React.ReactNode }[] = [
  { route: 'dashboard', icon: <Home size={20} /> },
  { route: 'attendance', icon: <CheckSquare size={20} /> },
  { route: 'finance', icon: <Wallet size={20} /> },
  { route: 'settings', icon: <Settings size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel relative z-20 hidden w-64 shrink-0 flex-col border-r border-primary/10 p-6 shadow-[4px_0_24px_rgba(200,160,160,0.05)] md:flex">
      <div className="mb-10 flex items-center gap-3 text-primary">
        <div className="rounded-2xl bg-gradient-to-tr from-primary/80 to-secondary p-2.5 shadow-sm">
          <Sparkles className="h-6 w-6 text-primary-content" />
        </div>
        <h1 className="text-xl font-bold tracking-wide">ห้องเรียนครูเก้า</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.route}
            route={item.route}
            icon={item.icon}
            label={routeLabel(item.route)}
            isActive={isActiveRoute(pathname, item.route)}
          />
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/20 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-100 text-xl shadow-sm">
          👩🏻‍🏫
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">ครูเก้า</p>
          <p className="text-xs text-primary/60">Admin</p>
        </div>
      </div>
    </aside>
  );
}
