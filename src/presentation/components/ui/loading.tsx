import React from 'react';
import { CircleNotchIcon } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
}) => {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <CircleNotchIcon
        className={cn('animate-spin text-cyan-600', sizeClasses[size])}
        weight='bold'
      />
      {text && <p className='text-sm text-slate-600 font-medium'>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center'>
        {content}
      </div>
    );
  }

  return content;
};

export const PageLoading: React.FC<{ text?: string }> = ({
  text = 'Carregando...',
}) => {
  return (
    <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8 flex items-center justify-center'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-64 w-full'>
        <Loading size='xl' text={text} className='py-20' />
      </div>
    </div>
  );
};
