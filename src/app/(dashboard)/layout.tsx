'use client';

import { NavigationDrawer, TopBar } from '@/presentation/components';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';

  if (isDashboard) {
    return (
      <>
        <NavigationDrawer />
        {children}
      </>
    );
  }

  return (
    <>
      <TopBar />
      <NavigationDrawer />
      {children}
    </>
  );
}
