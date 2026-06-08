'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { AppRoute } from '@/lib/routes';
import { ROUTES } from '@/lib/routes';

interface NavItemProps {
  route: AppRoute;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

export function NavItem({ route, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={ROUTES[route]}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left font-medium transition-all duration-300 ${
        isActive
          ? 'bg-primary/15 text-primary shadow-inner'
          : 'text-base-content/60 hover:bg-primary/5 hover:text-primary'
      }`}
    >
      <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

interface BottomNavItemProps {
  route: AppRoute;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isCenter?: boolean;
}

export function BottomNavItem({
  route,
  icon,
  label,
  isActive,
  isCenter,
}: BottomNavItemProps) {
  if (isCenter) {
    return (
      <Link
        href={ROUTES[route]}
        className="group relative -top-5 flex flex-col items-center gap-1"
      >
        <div
          className={`rounded-full p-4 shadow-xl transition-transform duration-300 group-hover:scale-105 ${
            isActive
              ? 'bg-gradient-to-tr from-primary to-accent text-primary-content shadow-primary/30'
              : 'border border-primary/20 bg-base-100 text-primary shadow-primary/10'
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-primary/50'}`}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link href={ROUTES[route]} className="flex w-16 flex-col items-center gap-1 p-2">
      <div
        className={`transition-all duration-300 ${isActive ? 'scale-110 text-primary' : 'text-primary/40'}`}
      >
        {icon}
      </div>
      <span
        className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-primary/40'}`}
      >
        {label}
      </span>
    </Link>
  );
}
