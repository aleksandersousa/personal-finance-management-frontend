import { NavigationDrawer, TopBar } from '@/presentation/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <NavigationDrawer />
      {children}
    </>
  );
}
