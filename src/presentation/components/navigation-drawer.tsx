'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardTextIcon,
  TagIcon,
  UserIcon,
  GearIcon,
  BellIcon,
  SignOutIcon,
  WalletIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react/dist/ssr';
import {
  CirclesFourIcon,
  SquaresFourIcon,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { UserModel } from '@/domain/models';
import { logoutAction } from '../actions';
import { makeCookieStorageAdapter } from '@/main/factories/storage';
import { cva } from 'class-variance-authority';

interface NavigationItem {
  href?: string;
  label: string;
  icon: PhosphorIcon;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: SquaresFourIcon,
  },
  {
    href: '/entries',
    label: 'Transações',
    icon: ClipboardTextIcon,
  },
  {
    href: '/ai',
    label: 'Assistente AI',
    icon: CirclesFourIcon,
  },
  {
    href: '/categories',
    label: 'Categorias',
    icon: TagIcon,
  },
  {
    href: '/settings',
    label: 'Configurações',
    icon: GearIcon,
  },
];

const secondaryItems: NavigationItem[] = [
  {
    href: '/settings',
    label: 'Configurações',
    icon: GearIcon,
  },
  {
    href: '/notifications',
    label: 'Notificações',
    icon: BellIcon,
    badge: 3,
  },
];

const buttonVariants = cva('', {
  variants: {
    variant: {
      active:
        'bg-gradient-to-br from-primary to-primary-800 text-neutral-100 shadow-sm',
      inactive: 'text-foreground',
    },
  },
});

const renderNavItem = (
  item: NavigationItem,
  isCollapsed: boolean,
  isActive: (href?: string) => boolean
) => {
  const active = isActive(item.href);
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <Link
        key={item.href || item.label}
        href={item.href || '#'}
        className='flex justify-center'
      >
        <button
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer relative hover:bg-button-hover',
            buttonVariants({
              variant: active ? 'active' : 'inactive',
            })
          )}
          title={item.label}
        >
          <Icon className='w-5 h-5' weight={active ? 'fill' : 'regular'} />
          {item.badge && (
            <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-error text-white text-[10px] font-bold rounded-full border-2 border-background'>
              {item.badge}
            </span>
          )}
        </button>
      </Link>
    );
  }

  return (
    <Link key={item.href || item.label} href={item.href || '#'}>
      <button
        className={cn(
          'w-full flex items-center justify-between gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all cursor-pointer relative',
          buttonVariants({
            variant: active ? 'active' : 'inactive',
          })
        )}
      >
        <div className='flex items-center gap-3'>
          <Icon
            className={cn(
              'w-5 h-5 shrink-0',
              active && 'text-primary-foreground'
            )}
            weight={active ? 'fill' : 'regular'}
          />
          <span
            className={cn(
              active ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            {item.label}
          </span>
        </div>
        {item.badge && (
          <span className='min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-error text-white text-xs font-semibold rounded-full'>
            {item.badge}
          </span>
        )}
      </button>
    </Link>
  );
};

export const NavigationDrawer: React.FC = () => {
  const pathname = usePathname();

  const getLocalStorage = makeCookieStorageAdapter();

  const [user, setUser] = useState<UserModel | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = (await getLocalStorage.get('user')) as UserModel;
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    window.dispatchEvent(new Event('sidebarToggle'));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar - Fixed Left Drawer */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 h-full bg-background-secondary z-50 flex-col shadow-lg transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={toggleCollapse}
          className={cn(
            'absolute top-6 w-5 h-5 bg-gray-300 dark:bg-gray-700 hover:bg-primary hover:text-primary-foreground text-foreground rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-50',
            isCollapsed ? '-right-3' : '-right-3'
          )}
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? (
            <CaretRightIcon className='w-3 h-3' weight='bold' />
          ) : (
            <CaretLeftIcon className='w-3 h-3' weight='bold' />
          )}
        </button>

        {/* Header with User Profile */}
        <div
          className={cn(
            'border-b border-border border-border-foreground transition-all',
            isCollapsed ? 'p-3' : 'p-6'
          )}
        >
          {!isCollapsed ? (
            <>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-800 rounded-xl flex items-center justify-center shadow-md'>
                  <WalletIcon
                    className='w-6 h-6 text-neutral-0'
                    weight='fill'
                  />
                </div>
                <div>
                  <h2 className='text-base font-bold text-foreground'>
                    Finanças
                  </h2>
                  <p className='text-xs text-foreground'>Gestão Pessoal</p>
                </div>
              </div>

              {/* User Info */}
              <div className='flex items-center gap-3 p-3 bg-card rounded-xl transition-colors'>
                <div className='w-10 h-10 bg-gradient-to-br from-gray-300 dark:from-gray-500 to-gray-400 dark:to-gray-600 rounded-full flex items-center justify-center'>
                  <UserIcon className='w-5 h-5 text-white' weight='fill' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-foreground truncate'>
                    {user?.name}
                  </p>
                  <p className='text-xs text-foreground truncate'>
                    {user?.email}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-800 rounded-xl flex items-center justify-center shadow-md'>
                <WalletIcon className='w-6 h-6 text-white' weight='fill' />
              </div>
              <div className='w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center'>
                <UserIcon className='w-5 h-5 text-white' weight='fill' />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div
          className={cn(
            'flex-1 overflow-y-auto transition-all',
            isCollapsed ? 'px-3 py-6' : 'px-4 py-6'
          )}
        >
          <div className={cn(isCollapsed ? 'space-y-3' : 'space-y-1')}>
            {!isCollapsed && (
              <div className='px-3 mb-2'>
                <p className='text-xs font-semibold text-foreground-secondary uppercase tracking-wider'>
                  Menu Principal
                </p>
              </div>
            )}
            {navigationItems.map(item =>
              renderNavItem(item, isCollapsed, isActive)
            )}
          </div>

          <div
            className={cn(isCollapsed ? 'mt-6 space-y-3' : 'mt-8 space-y-1')}
          >
            {!isCollapsed && (
              <div className='px-3 mb-2'>
                <p className='text-xs font-semibold text-foreground-secondary uppercase tracking-wider'>
                  Sistema
                </p>
              </div>
            )}
            {secondaryItems.map(item =>
              renderNavItem(item, isCollapsed, isActive)
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'border-t border-border border-border-foreground',
            isCollapsed ? 'p-3' : 'p-4'
          )}
        >
          {isCollapsed ? (
            <button
              className={cn(
                'w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer hover:bg-button-hover',
                buttonVariants({
                  variant: 'inactive',
                })
              )}
              onClick={handleSignOut}
              title='Sair'
            >
              <SignOutIcon className='w-5 h-5' />
            </button>
          ) : (
            <button
              className={cn(
                'w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all cursor-pointer',
                buttonVariants({
                  variant: 'inactive',
                })
              )}
              onClick={handleSignOut}
            >
              <SignOutIcon className='w-5 h-5 shrink-0' />
              <span>Sair</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className='lg:hidden fixed bottom-0 left-0 right-0 bg-background z-40'
        style={{
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className='grid grid-cols-5 gap-1 px-2 py-2 relative'>
          {navigationItems.map(item => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href || '#'} className='block'>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center rounded-xl transition-all relative duration-300 ease-in-out',
                    active ? 'pb-0' : 'py-2',
                    buttonVariants({
                      variant: 'inactive',
                    })
                  )}
                >
                  <div className='relative flex flex-col items-center justify-center'>
                    <div
                      className={cn(
                        'flex items-center justify-center transition-all duration-300 ease-in-out',
                        active
                          ? 'w-11 h-11 rounded-full bg-primary shadow-lg -translate-y-6'
                          : 'w-5 h-5 translate-y-0'
                      )}
                    >
                      <Icon
                        className={cn(
                          'transition-all duration-300 ease-in-out',
                          active
                            ? 'w-6 h-6 text-white'
                            : 'w-5 h-5 text-foreground-secondary'
                        )}
                        weight={active ? 'fill' : 'regular'}
                      />
                    </div>
                    <span
                      className={cn(
                        'absolute w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300 ease-in-out',
                        active
                          ? '-bottom-0.5 opacity-100'
                          : 'bottom-0 opacity-0'
                      )}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
