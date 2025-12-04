import { useEffect, useState, useRef } from 'react';

export interface UseCountdownTimerReturn {
  remainingSeconds: number;
  formattedTime: string;
  isActive: boolean;
}

export function useCountdownTimer(
  initialSeconds: number
): UseCountdownTimerReturn {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update remaining seconds when initialSeconds changes
  useEffect(() => {
    if (initialSeconds > 0 && initialSeconds !== remainingSeconds) {
      setRemainingSeconds(initialSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [remainingSeconds]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return {
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
    isActive: remainingSeconds > 0,
  };
}
