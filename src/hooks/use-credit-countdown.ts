import { useState, useEffect } from 'react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

interface CreditCountdown {
  dailyCountdown: CountdownTime;
  monthlyCountdown: CountdownTime & { days: number };
}

function formatTime(hours: number, minutes: number, seconds: number): string {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatMonthlyTime(days: number, hours: number, minutes: number): string {
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

function getTimeUntilMidnight(): CountdownTime {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    hours,
    minutes,
    seconds,
    formatted: formatTime(hours, minutes, seconds),
  };
}

function getTimeUntilDate(targetDate: string): CountdownTime & { days: number } {
  const now = new Date();
  const target = new Date(targetDate);
  
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    formatted: formatMonthlyTime(days, hours, minutes),
  };
}

export function useCreditCountdown(creditResetDate?: string): CreditCountdown {
  const [dailyCountdown, setDailyCountdown] = useState<CountdownTime>(getTimeUntilMidnight);
  const [monthlyCountdown, setMonthlyCountdown] = useState<CountdownTime & { days: number }>(
    () => getTimeUntilDate(creditResetDate || new Date().toISOString())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyCountdown(getTimeUntilMidnight());
      if (creditResetDate) {
        setMonthlyCountdown(getTimeUntilDate(creditResetDate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [creditResetDate]);

  return {
    dailyCountdown,
    monthlyCountdown,
  };
}
