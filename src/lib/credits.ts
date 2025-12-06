// Credit system configuration and utilities

export interface CreditData {
  userId: string;
  trialStartDate: string | null;
  monthlyCredits: number;
  dailyCreditsUsed: number;
  purchasedCredits: number;
  creditResetDate: string;
  dailyResetDate: string;
  createdAt: string;
}

export interface CreditCost {
  base: number;
  fonts: number;
  duration: number;
  frames: number;
  total: number;
}

// Configuration
export const CREDIT_CONFIG = {
  TRIAL_DAYS: 7,
  MONTHLY_CREDITS: 500,
  DAILY_LIMIT: 100,
  MIN_RENDER_COST: 20,
  MAX_RENDER_COST: 40,
  PAYMENT_LINKS: {
    PACK_200: 'https://buy.stripe.com/test_your_200_credits_link', // Replace with actual Stripe Payment Link
    PACK_500: 'https://buy.stripe.com/test_your_500_credits_link', // Replace with actual Stripe Payment Link
  },
  PACK_PRICES: {
    PACK_200: { credits: 200, price: 1.99, label: '200 Credits - $1.99' },
    PACK_500: { credits: 500, price: 3.99, label: '500 Credits - $3.99' },
  },
} as const;

const STORAGE_KEY = 'matchcut_credits';

// Generate a simple user ID if none exists
function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Get current date in YYYY-MM-DD format
function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

// Get next month reset date
function getNextMonthResetDate(): string {
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return resetDate.toISOString();
}

// Initialize fresh credit data for new users
function initializeCreditData(): CreditData {
  const now = new Date();
  return {
    userId: generateUserId(),
    trialStartDate: now.toISOString(),
    monthlyCredits: CREDIT_CONFIG.MONTHLY_CREDITS,
    dailyCreditsUsed: 0,
    purchasedCredits: 0,
    creditResetDate: getNextMonthResetDate(),
    dailyResetDate: getDateString(now),
    createdAt: now.toISOString(),
  };
}

// Load credit data from localStorage
export function loadCreditData(): CreditData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as CreditData;
      return checkAndResetCredits(data);
    }
  } catch (e) {
    console.error('Failed to load credit data:', e);
  }
  
  const newData = initializeCreditData();
  saveCreditData(newData);
  return newData;
}

// Save credit data to localStorage
export function saveCreditData(data: CreditData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save credit data:', e);
  }
}

// Check and reset credits if needed (daily or monthly)
function checkAndResetCredits(data: CreditData): CreditData {
  const now = new Date();
  const today = getDateString(now);
  let updated = { ...data };

  // Reset daily credits if new day
  if (data.dailyResetDate !== today) {
    updated.dailyCreditsUsed = 0;
    updated.dailyResetDate = today;
  }

  // Reset monthly credits if past reset date
  const resetDate = new Date(data.creditResetDate);
  if (now >= resetDate) {
    updated.monthlyCredits = CREDIT_CONFIG.MONTHLY_CREDITS;
    updated.creditResetDate = getNextMonthResetDate();
  }

  if (updated !== data) {
    saveCreditData(updated);
  }

  return updated;
}

// Check if user is in trial period
export function isInTrial(data: CreditData): boolean {
  if (!data.trialStartDate) return false;
  
  const trialStart = new Date(data.trialStartDate);
  const trialEnd = new Date(trialStart);
  trialEnd.setDate(trialEnd.getDate() + CREDIT_CONFIG.TRIAL_DAYS);
  
  return new Date() < trialEnd;
}

// Get remaining trial days
export function getTrialDaysRemaining(data: CreditData): number {
  if (!data.trialStartDate) return 0;
  
  const trialStart = new Date(data.trialStartDate);
  const trialEnd = new Date(trialStart);
  trialEnd.setDate(trialEnd.getDate() + CREDIT_CONFIG.TRIAL_DAYS);
  
  const remaining = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, remaining);
}

// Calculate credit cost for a render
export function calculateRenderCost(
  numFonts: number,
  durationSeconds: number,
  totalFrames: number
): CreditCost {
  const base = 10;
  const fonts = numFonts * 0.5;
  const duration = durationSeconds * 1;
  const frames = totalFrames * 0.02;

  const rawTotal = base + fonts + duration + frames;
  const total = Math.max(
    CREDIT_CONFIG.MIN_RENDER_COST,
    Math.min(CREDIT_CONFIG.MAX_RENDER_COST, Math.round(rawTotal))
  );

  return { base, fonts, duration, frames, total };
}

// Get available credits (monthly + purchased)
export function getTotalAvailableCredits(data: CreditData): number {
  return data.monthlyCredits + data.purchasedCredits;
}

// Get remaining daily credits
export function getRemainingDailyCredits(data: CreditData): number {
  return Math.max(0, CREDIT_CONFIG.DAILY_LIMIT - data.dailyCreditsUsed);
}

// Check if user can afford a render
export function canAffordRender(data: CreditData, cost: number): { canAfford: boolean; reason?: string } {
  // Trial users always can
  if (isInTrial(data)) {
    return { canAfford: true };
  }

  // Check daily limit
  const remainingDaily = getRemainingDailyCredits(data);
  if (remainingDaily < cost) {
    return { 
      canAfford: false, 
      reason: 'Daily credit limit reached. Try again tomorrow or buy extra credits.' 
    };
  }

  // Check total credits
  const totalCredits = getTotalAvailableCredits(data);
  if (totalCredits < cost) {
    return { 
      canAfford: false, 
      reason: "You don't have enough credits. Buy credits or wait for next reset." 
    };
  }

  return { canAfford: true };
}

// Deduct credits after successful render
export function deductCredits(data: CreditData, cost: number): CreditData {
  // Don't deduct during trial
  if (isInTrial(data)) {
    return data;
  }

  let remainingCost = cost;
  const updated = { ...data };

  // Deduct from monthly first
  if (updated.monthlyCredits >= remainingCost) {
    updated.monthlyCredits -= remainingCost;
    remainingCost = 0;
  } else {
    remainingCost -= updated.monthlyCredits;
    updated.monthlyCredits = 0;
  }

  // Then from purchased
  if (remainingCost > 0) {
    updated.purchasedCredits = Math.max(0, updated.purchasedCredits - remainingCost);
  }

  // Update daily usage
  updated.dailyCreditsUsed += cost;

  saveCreditData(updated);
  return updated;
}

// Add purchased credits
export function addPurchasedCredits(data: CreditData, amount: number): CreditData {
  const updated = { ...data, purchasedCredits: data.purchasedCredits + amount };
  saveCreditData(updated);
  return updated;
}

// Get credit status color
export function getCreditStatusColor(current: number, max: number): 'green' | 'yellow' | 'red' {
  const percentage = (current / max) * 100;
  if (percentage > 50) return 'green';
  if (percentage > 20) return 'yellow';
  return 'red';
}

// Format date for display
export function formatResetDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
