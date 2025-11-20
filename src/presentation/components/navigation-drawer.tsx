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
    href: '/categories',
    label: 'Categorias',
    icon: TagIcon,
  },
  {
    href: '/ai',
    label: 'Assistente AI',
    icon: CirclesFourIcon,
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

  const renderNavItem = (item: NavigationItem) => {
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
              'w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer relative',
              active
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            title={item.label}
          >
            <Icon className='w-5 h-5' weight={active ? 'fill' : 'regular'} />
            {item.badge && (
              <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-error text-white text-[10px] font-bold rounded-full border-2 border-white'>
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
            active
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-50'
          )}
        >
          <div className='flex items-center gap-3'>
            <Icon
              className='w-5 h-5 shrink-0'
              weight={active ? 'fill' : 'regular'}
            />
            <span>{item.label}</span>
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

  return (
    <>
      {/* Desktop Sidebar - Fixed Left Drawer */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 h-full bg-white z-50 flex-col shadow-lg transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={toggleCollapse}
          className={cn(
            'absolute top-6 w-5 h-5 bg-gray-400 hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-50',
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
            'border-b border-gray-100 transition-all',
            isCollapsed ? 'p-3' : 'p-6'
          )}
        >
          {!isCollapsed ? (
            <>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md'>
                  <WalletIcon className='w-6 h-6 text-white' weight='fill' />
                </div>
                <div>
                  <h2 className='text-base font-bold text-gray-900'>
                    Finanças
                  </h2>
                  <p className='text-xs text-gray-500'>Gestão Pessoal</p>
                </div>
              </div>

              {/* User Info */}
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center'>
                  <UserIcon className='w-5 h-5 text-white' weight='fill' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 truncate'>
                    {user?.name}
                  </p>
                  <p className='text-xs text-gray-500 truncate'>
                    {user?.email}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md'>
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
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  Menu Principal
                </p>
              </div>
            )}
            {navigationItems.map(item => renderNavItem(item))}
          </div>

          <div
            className={cn(isCollapsed ? 'mt-6 space-y-3' : 'mt-8 space-y-1')}
          >
            {!isCollapsed && (
              <div className='px-3 mb-2'>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  Sistema
                </p>
              </div>
            )}
            {secondaryItems.map(item => renderNavItem(item))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'border-t border-gray-100',
            isCollapsed ? 'p-3' : 'p-4'
          )}
        >
          {isCollapsed ? (
            <button
              className='w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-primary text-secondary-foreground transition-all cursor-pointer'
              onClick={handleSignOut}
              title='Sair'
            >
              <SignOutIcon className='w-5 h-5' weight='bold' />
            </button>
          ) : (
            <button
              className='w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm text-gray-400 hover:text-secondary-foreground hover:bg-primary-dark transition-all cursor-pointer'
              onClick={handleSignOut}
            >
              <SignOutIcon className='w-5 h-5 shrink-0' weight='bold' />
              <span>Sair</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className='lg:hidden fixed bottom-0 left-0 right-0 bg-white z-50'
        style={{
          borderRadius: '2rem 2rem 0 0',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className='grid grid-cols-4 gap-1 p-3 pb-safe'>
          {navigationItems.map(item => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href || '#'} className='block'>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all relative',
                    active
                      ? 'bg-primary text-white'
                      : 'text-gray-400 active:bg-gray-50'
                  )}
                >
                  {item.badge && (
                    <span className='absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-error text-white text-[10px] font-bold rounded-full'>
                      {item.badge}
                    </span>
                  )}
                  <Icon
                    className={cn('w-6 h-6', active ? 'mb-1' : '')}
                    weight={active ? 'fill' : 'regular'}
                  />
                  {active && (
                    <span className='text-[10px] font-semibold text-center leading-tight mt-0.5'>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
