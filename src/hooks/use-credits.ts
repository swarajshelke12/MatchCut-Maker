import { useState, useEffect, useCallback } from 'react';
import {
  CreditData,
  CreditCost,
  loadCreditData,
  saveCreditData,
  calculateRenderCost,
  getTotalAvailableCredits,
  getRemainingDailyCredits,
  canAffordRender,
  deductCredits,
  addPurchasedCredits,
  markOnboardingComplete,
  getCreditStatusColor,
  getBonusCreditStatusColor,
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

  // Credit values
  const bonusCredits = creditData?.bonusCredits ?? 0;
  const monthlyCredits = creditData?.monthlyCredits ?? 0;
  const dailyCredits = creditData?.dailyCredits ?? CREDIT_CONFIG.DAILY_LIMIT;
  const dailyUsed = creditData?.dailyCreditsUsed ?? 0;
  const purchasedCredits = creditData?.purchasedCredits ?? 0;
  const remainingDaily = creditData ? getRemainingDailyCredits(creditData) : 0;
  const totalCredits = creditData ? getTotalAvailableCredits(creditData) : 0;
  const isNewUser = creditData?.isNewUser ?? false;

  // Status colors - bonus uses special function since it depletes permanently
  const bonusColor = getBonusCreditStatusColor(bonusCredits);
  const monthlyColor = getCreditStatusColor(monthlyCredits, CREDIT_CONFIG.MONTHLY_CREDITS);
  const dailyColor = getCreditStatusColor(remainingDaily, CREDIT_CONFIG.DAILY_LIMIT);

  // Calculate render cost
  const getRenderCost = useCallback((
    numFonts: number,
    durationSeconds: number,
    fps: number
  ): CreditCost => {
    return calculateRenderCost(numFonts, durationSeconds, fps);
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
    if (!creditData) return;
    // Add credits back to bonus (simplest approach)
    const updated = {
      ...creditData,
      bonusCredits: creditData.bonusCredits + cost,
      dailyCreditsUsed: Math.max(0, creditData.dailyCreditsUsed - cost),
    };
    saveCreditData(updated);
    setCreditData(updated);
  }, [creditData]);

  // Add purchased credits
  const purchaseCredits = useCallback((amount: number): void => {
    if (!creditData) return;
    const updated = addPurchasedCredits(creditData, amount);
    setCreditData(updated);
  }, [creditData]);

  // Complete onboarding
  const completeOnboarding = useCallback((): void => {
    if (!creditData) return;
    const updated = markOnboardingComplete(creditData);
    setCreditData(updated);
  }, [creditData]);

  // Check if credits are running low (below 20%)
  const isBonusLow = bonusCredits > 0 && bonusCredits < CREDIT_CONFIG.BONUS_CREDITS * CREDIT_CONFIG.LOW_CREDIT_THRESHOLD;
  const isMonthlyLow = monthlyCredits < CREDIT_CONFIG.MONTHLY_CREDITS * CREDIT_CONFIG.LOW_CREDIT_THRESHOLD;

  return {
    isLoading,
    creditData,
    isNewUser,
    totalCredits,
    bonusCredits,
    monthlyCredits,
    dailyCredits,
    remainingDaily,
    purchasedCredits,
    dailyUsed,
    bonusColor,
    monthlyColor,
    dailyColor,
    isBonusLow,
    isMonthlyLow,
    getRenderCost,
    checkCanRender,
    deductRenderCredits,
    refundCredits,
    purchaseCredits,
    completeOnboarding,
    config: CREDIT_CONFIG,
  };
}
