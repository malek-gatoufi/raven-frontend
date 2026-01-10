'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

export function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 ${className}`}>
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Promotion expirée</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 ${className}`}>
      <Clock className="h-5 w-5 text-orange-400 animate-pulse" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Se termine dans:</span>
        <div className="flex items-center gap-1">
          {timeLeft.days > 0 && (
            <>
              <TimeUnit value={timeLeft.days} label="j" />
              <span className="text-orange-400">:</span>
            </>
          )}
          <TimeUnit value={timeLeft.hours} label="h" />
          <span className="text-orange-400">:</span>
          <TimeUnit value={timeLeft.minutes} label="m" />
          <span className="text-orange-400">:</span>
          <TimeUnit value={timeLeft.seconds} label="s" />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-lg font-bold text-white tabular-nums min-w-[1.5rem] text-center">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
