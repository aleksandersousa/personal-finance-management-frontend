import { NavigationDrawer } from '@/presentation/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationDrawer />
      {children}
    </>
  );
}
