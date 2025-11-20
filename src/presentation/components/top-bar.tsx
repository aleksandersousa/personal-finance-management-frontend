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

export const TopBar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const getLocalStorage = makeCookieStorageAdapter();

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

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
    // TODO: Implementar mudança de tema
  };

  const handleSignOut = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-slate-50 lg:left-64'>
      <div className='flex items-center justify-end px-4 sm:px-8 py-2 h-16'>
        <div className='flex items-center space-x-2 mr-6'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleThemeToggle}
            className='h-9 w-9 p-0 hover:bg-slate-100 cursor-pointer'
          >
            {isDarkMode ? (
              <SunIcon className='h-5 w-5 text-slate-600' weight='bold' />
            ) : (
              <MoonIcon className='h-5 w-5 text-slate-600' weight='bold' />
            )}
          </Button>
        </div>

        <div className='flex items-center space-x-3'>
          <div className='hidden sm:block'>
            <p className='text-sm font-medium text-slate-900'>
              {user?.name ?? ''}
            </p>
            <p className='text-xs text-slate-500'>{user?.email ?? ''}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='relative h-10 w-10 rounded-full p-0 hover:bg-slate-100'
              >
                <div className='h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center'>
                  <UserIcon className='h-6 w-6 text-white' weight='bold' />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='start' className='w-56 mr-4'>
              <div className='px-3 py-2 border-b border-slate-100'>
                <p className='text-sm font-medium text-slate-900'>
                  {user?.name ?? ''}
                </p>
                <p className='text-xs text-slate-500'>{user?.email ?? ''}</p>
              </div>

              <DropdownMenuItem
                onClick={handleSignOut}
                className='text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer'
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
