'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
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

export const TopBar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Hide top bar on auth pages
  if (pathname.startsWith('/login')) {
    return null;
  }

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
    // TODO: Implementar mudança de tema
  };

  const handleSignOut = () => {
    // TODO: Implementar logout
    console.log('Sign out clicked');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-slate-50 lg:left-64'>
      <div className='flex items-center justify-end px-4 py-2 h-16'>
        <div className='flex items-center space-x-2 mr-6'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleThemeToggle}
            className='h-9 w-9 p-0 hover:bg-slate-100'
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
            <p className='text-sm font-medium text-slate-900'>Usuário</p>
            <p className='text-xs text-slate-500'>usuario@email.com</p>
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
                <p className='text-sm font-medium text-slate-900'>Usuário</p>
                <p className='text-xs text-slate-500'>usuario@email.com</p>
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
