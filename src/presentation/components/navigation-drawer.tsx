'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardTextIcon, TagIcon } from '@phosphor-icons/react/dist/ssr';
import { CirclesFourIcon, SquaresFourIcon } from '@phosphor-icons/react';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <SquaresFourIcon className='w-5 h-5' />,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    hoverColor: 'hover:bg-slate-100',
  },
  {
    href: '/entries',
    label: 'Ver Entradas',
    icon: <ClipboardTextIcon className='w-5 h-5' />,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    hoverColor: 'hover:bg-slate-100',
  },
  {
    href: '/categories',
    label: 'Categorias',
    icon: <TagIcon className='w-5 h-5' />,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    hoverColor: 'hover:bg-slate-100',
  },
];

export const NavigationDrawer: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar - Fixed Left Drawer */}
      <div className='hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r rounded-xl border-slate-200 z-40'>
        <div className='p-6'>
          <CirclesFourIcon className='w-8 h-8 mb-6' />

          <nav className='space-y-3'>
            {navigationItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 ${item.bgColor} ${item.color} rounded-lg ${item.hoverColor} transition-colors`}
              >
                {item.icon}
                <span className='ml-3 font-medium'>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-pb'>
        <div className='grid grid-cols-3 gap-1 p-2'>
          {navigationItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 px-2 ${
                  active ? 'bg-slate-100' : 'bg-transparent'
                } ${item.color} rounded-lg ${item.hoverColor} transition-colors min-h-[60px]`}
              >
                {item.icon}
                {active && (
                  <span className='text-xs font-medium mt-1 text-center'>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
