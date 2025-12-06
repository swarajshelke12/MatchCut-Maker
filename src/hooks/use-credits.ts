import { useState, useEffect, useCallback } from 'react';
import {
  CreditData,
  CreditCost,
  loadCreditData,
  saveCreditData,
  isInTrial,
  getTrialDaysRemaining,
  calculateRenderCost,
  getTotalAvailableCredits,
  getRemainingDailyCredits,
  canAffordRender,
  deductCredits,
  addPurchasedCredits,
  getCreditStatusColor,
  CREDIT_CONFIG,
} from '@/lib/credits';

export function useCredits() {
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load credit data on mount
  useEffect(() => {
    const data = loadCreditData();
    setCreditData(data);
    setIsLoading(false);
  }, []);

  // Check trial status
  const isTrial = creditData ? isInTrial(creditData) : false;
  const trialDaysLeft = creditData ? getTrialDaysRemaining(creditData) : 0;

  // Credit calculations
  const totalCredits = creditData ? getTotalAvailableCredits(creditData) : 0;
  const remainingDaily = creditData ? getRemainingDailyCredits(creditData) : 0;
  const monthlyCredits = creditData?.monthlyCredits ?? 0;
  const purchasedCredits = creditData?.purchasedCredits ?? 0;
  const dailyUsed = creditData?.dailyCreditsUsed ?? 0;

  // Status colors
  const monthlyColor = getCreditStatusColor(monthlyCredits, CREDIT_CONFIG.MONTHLY_CREDITS);
  const dailyColor = getCreditStatusColor(remainingDaily, CREDIT_CONFIG.DAILY_LIMIT);

  // Calculate render cost
  const getRenderCost = useCallback((
    numFonts: number,
    durationSeconds: number,
    totalFrames: number
  ): CreditCost => {
    return calculateRenderCost(numFonts, durationSeconds, totalFrames);
  }, []);

  // Check if can render
  const checkCanRender = useCallback((cost: number): { canRender: boolean; reason?: string } => {
    if (!creditData) return { canRender: false, reason: 'Loading credits...' };
    const result = canAffordRender(creditData, cost);
    return { canRender: result.canAfford, reason: result.reason };
  }, [creditData]);

  // Deduct credits after render
  const deductRenderCredits = useCallback((cost: number): void => {
    if (!creditData) return;
    const updated = deductCredits(creditData, cost);
    setCreditData(updated);
  }, [creditData]);

  // Refund credits on failed render
  const refundCredits = useCallback((cost: number): void => {
    if (!creditData || isTrial) return;
    // Simply add credits back
    const updated = {
      ...creditData,
      monthlyCredits: Math.min(
        CREDIT_CONFIG.MONTHLY_CREDITS,
        creditData.monthlyCredits + cost
      ),
      dailyCreditsUsed: Math.max(0, creditData.dailyCreditsUsed - cost),
    };
    saveCreditData(updated);
    setCreditData(updated);
  }, [creditData, isTrial]);

  // Add purchased credits
  const purchaseCredits = useCallback((amount: number): void => {
    if (!creditData) return;
    const updated = addPurchasedCredits(creditData, amount);
    setCreditData(updated);
  }, [creditData]);

  // Open payment link
  const openPaymentLink = useCallback((pack: 'PACK_200' | 'PACK_500'): void => {
    const url = CREDIT_CONFIG.PAYMENT_LINKS[pack];
    window.open(url, '_blank');
  }, []);

  return {
    isLoading,
    creditData,
    isTrial,
    trialDaysLeft,
    totalCredits,
    remainingDaily,
    monthlyCredits,
    purchasedCredits,
    dailyUsed,
    monthlyColor,
    dailyColor,
    getRenderCost,
    checkCanRender,
    deductRenderCredits,
    refundCredits,
    purchaseCredits,
    openPaymentLink,
    config: CREDIT_CONFIG,
  };
}
