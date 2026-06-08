export const ROUTES = {
  dashboard: '/',
  attendance: '/attendance',
  finance: '/finance',
  settings: '/settings',
} as const;

export type AppRoute = keyof typeof ROUTES;

export function isActiveRoute(pathname: string, route: AppRoute): boolean {
  if (route === 'dashboard') return pathname === '/';
  return pathname === ROUTES[route] || pathname.startsWith(`${ROUTES[route]}/`);
}

export function routeLabel(route: AppRoute): string {
  switch (route) {
    case 'dashboard':
      return 'สรุปข้อมูล (Dashboard)';
    case 'attendance':
      return 'เช็คชื่อ (Attendance)';
    case 'finance':
      return 'ฝากเงิน (Banking)';
    case 'settings':
      return 'ตั้งค่า';
  }
}

export function routeShortLabel(route: AppRoute): string {
  switch (route) {
    case 'dashboard':
      return 'หน้าแรก';
    case 'attendance':
      return 'เช็คชื่อ';
    case 'finance':
      return 'ฝากเงิน';
    case 'settings':
      return 'ตั้งค่า';
  }
}
