'use client';

import React, { useEffect, useState } from 'react';
import {
  SunIcon,
  MoonIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from '@/presentation/components/ui/button';
import { makeCookieStorageAdapter } from '@/main/factories/storage';
import type { UserModel } from '@/domain';
import { logoutAction } from '../actions/logout-action';
import { DashboardFilters } from './ui';
import { BellIcon } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/presentation/hooks';

export interface TopBarProps {
  currentMonth?: string;
  currentForecastMonths?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentMonth,
  currentForecastMonths,
}) => {
  const getLocalStorage = makeCookieStorageAdapter();
  const navigate = useRouter();
  const { isDarkMode, isMounted, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = (await getLocalStorage.get('user')) as UserModel;
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
      navigate.push('/login');
    }
  };

  const handleSettings = () => {
    navigate.push('/settings');
  };

  const handleNotifications = () => {
    navigate.push('/notifications');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-30 bg-background-secondary lg:left-64'>
      <div className='flex items-center justify-end px-4 sm:px-8 py-2 h-16'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-foreground'
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <SunIcon className='h-6 w-6' weight='bold' />
            ) : (
              <MoonIcon className='h-6 w-6' weight='bold' />
            )}
          </Button>
        </div>

        {currentMonth && currentForecastMonths && (
          <div className='ml-4'>
            <DashboardFilters
              currentMonth={currentMonth}
              currentForecastMonths={currentForecastMonths}
            />
          </div>
        )}

        <div className='ml-4 flex items-center space-x-3 lg:hidden'>
          <div className='hidden sm:block'>
            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
              {user?.name ?? ''}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              {user?.email ?? ''}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-800 flex items-center justify-center'
              >
                <UserIcon className='h-6 w-6 text-neutral-0' weight='bold' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='start'
              className='w-48 mr-4 bg-neutral-0 border border-border-foreground'
            >
              <div className='px-3 py-2 border-b border-border-foreground'>
                <p className='text-sm font-medium text-neutral-900'>
                  {user?.name ?? ''}
                </p>
                <p className='text-xs text-neutral-900 '>{user?.email ?? ''}</p>
              </div>

              <DropdownMenuItem
                onClick={handleNotifications}
                className='text-neutral-900 cursor-pointer'
              >
                <BellIcon className='mr-2 h-4 w-4' weight='bold' />
                Notificações
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleSignOut}
                className='text-neutral-900 cursor-pointer'
              >
                <SignOutIcon className='mr-2 h-4 w-4' weight='bold' />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
