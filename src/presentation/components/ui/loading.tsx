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
      {text && <p className='text-sm text-foreground font-medium'>{text}</p>}
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
    <div className='min-h-screen bg-background-secondary pt-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64 h-[calc(100vh-11.225rem)] lg:h-[calc(100vh-7rem)]'>
        <div className='w-full max-w-4xl flex items-center justify-center'>
          <Loading size='xl' text={text} />
        </div>
      </div>
    </div>
  );
};
