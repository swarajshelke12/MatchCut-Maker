import { useState, useEffect, useCallback } from 'react';
import { getRemainingCooldown, setRenderCooldown, CREDIT_CONFIG } from '@/lib/credits';

export function useCooldown() {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Update cooldown every second
  useEffect(() => {
    const updateCooldown = () => {
      setRemainingSeconds(getRemainingCooldown());
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, []);

  const startCooldown = useCallback(() => {
    setRenderCooldown();
    setRemainingSeconds(CREDIT_CONFIG.RENDER_COOLDOWN_SECONDS);
  }, []);

  const isOnCooldown = remainingSeconds > 0;

  const formatCooldown = useCallback((seconds: number): string => {
    if (seconds <= 0) return '';
    return `${seconds}s`;
  }, []);

  return {
    remainingSeconds,
    isOnCooldown,
    startCooldown,
    formatCooldown: formatCooldown(remainingSeconds),
    cooldownDuration: CREDIT_CONFIG.RENDER_COOLDOWN_SECONDS,
  };
}
