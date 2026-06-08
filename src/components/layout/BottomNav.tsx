'use client';

import { CheckSquare, Home, Settings, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BottomNavItem } from '@/components/layout/NavItems';
import { isActiveRoute, routeShortLabel, type AppRoute } from '@/lib/routes';

const NAV_ITEMS: {
  route: AppRoute;
  icon: React.ReactNode;
  center?: boolean;
}[] = [
  { route: 'dashboard', icon: <Home /> },
  { route: 'attendance', icon: <CheckSquare /> },
  { route: 'finance', icon: <Wallet /> },
  { route: 'settings', icon: <Settings /> },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 pb-safe shadow-[0_-4px_24px_rgba(200,160,160,0.08)] md:hidden">
      <div className="flex items-center justify-around p-2">
        {NAV_ITEMS.map((item) => (
          <BottomNavItem
            key={item.route}
            route={item.route}
            icon={item.icon}
            label={routeShortLabel(item.route)}
            isActive={isActiveRoute(pathname, item.route)}
            isCenter={item.center}
          />
        ))}
      </div>
    </nav>
  );
}
