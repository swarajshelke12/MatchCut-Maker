// Credit system configuration and utilities

export interface CreditData {
  userId: string;
  bonusCredits: number;
  monthlyCredits: number;
  dailyCredits: number;
  dailyCreditsUsed: number;
  purchasedCredits: number;
  creditResetDate: string;
  dailyResetDate: string;
  createdAt: string;
  isNewUser: boolean;
}

export interface CreditCost {
  base: number;
  duration: number;
  speed: number;
  total: number;
}

// Configuration
export const CREDIT_CONFIG = {
  BONUS_CREDITS: 500,
  MONTHLY_CREDITS: 500,
  DAILY_LIMIT: 100,
  MIN_RENDER_COST: 17,
  MAX_RENDER_COST: 100,
  RENDER_COOLDOWN_SECONDS: 30, // 30 second cooldown between renders
  PAYMENT_LINKS: {
    PACK_200: 'https://buy.stripe.com/test_your_200_credits_link', // Replace with actual Stripe Payment Link
    PACK_500: 'https://buy.stripe.com/test_your_500_credits_link', // Replace with actual Stripe Payment Link
  },
  PACK_PRICES: {
    PACK_200: { credits: 200, price: 99, currency: '₹', label: '200 Credits' },
    PACK_500: { credits: 500, price: 199, currency: '₹', label: '500 Credits' },
  },
} as const;

const COOLDOWN_STORAGE_KEY = 'matchcut_last_render';

// Get remaining cooldown time in seconds (0 if ready)
export function getRemainingCooldown(): number {
  try {
    const lastRender = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!lastRender) return 0;
    
    const lastRenderTime = parseInt(lastRender, 10);
    const now = Date.now();
    const elapsed = Math.floor((now - lastRenderTime) / 1000);
    const remaining = CREDIT_CONFIG.RENDER_COOLDOWN_SECONDS - elapsed;
    
    return Math.max(0, remaining);
  } catch {
    return 0;
  }
}

// Check if cooldown is active
export function isCooldownActive(): boolean {
  return getRemainingCooldown() > 0;
}

// Set cooldown after a render
export function setRenderCooldown(): void {
  try {
    localStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());
  } catch (e) {
    console.error('Failed to set cooldown:', e);
  }
}

// Clear cooldown (for testing/admin)
export function clearRenderCooldown(): void {
  try {
    localStorage.removeItem(COOLDOWN_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear cooldown:', e);
  }
}

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
    bonusCredits: CREDIT_CONFIG.BONUS_CREDITS,
    monthlyCredits: CREDIT_CONFIG.MONTHLY_CREDITS,
    dailyCredits: CREDIT_CONFIG.DAILY_LIMIT,
    dailyCreditsUsed: 0,
    purchasedCredits: 0,
    creditResetDate: getNextMonthResetDate(),
    dailyResetDate: getDateString(now),
    createdAt: now.toISOString(),
    isNewUser: true,
  };
}

// Load credit data from localStorage
export function loadCreditData(): CreditData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as CreditData;
      // Migrate old data structure if needed
      const migratedData = migrateOldData(data);
      return checkAndResetCredits(migratedData);
    }
  } catch (e) {
    console.error('Failed to load credit data:', e);
  }
  
  const newData = initializeCreditData();
  saveCreditData(newData);
  return newData;
}

// Migrate old data format to new format
function migrateOldData(data: any): CreditData {
  // If old structure with trialStartDate, migrate it
  if ('trialStartDate' in data && !('bonusCredits' in data)) {
    return {
      userId: data.userId || generateUserId(),
      bonusCredits: CREDIT_CONFIG.BONUS_CREDITS,
      monthlyCredits: data.monthlyCredits ?? CREDIT_CONFIG.MONTHLY_CREDITS,
      dailyCredits: CREDIT_CONFIG.DAILY_LIMIT,
      dailyCreditsUsed: data.dailyCreditsUsed ?? 0,
      purchasedCredits: data.purchasedCredits ?? 0,
      creditResetDate: data.creditResetDate || getNextMonthResetDate(),
      dailyResetDate: data.dailyResetDate || getDateString(),
      createdAt: data.createdAt || new Date().toISOString(),
      isNewUser: false,
    };
  }
  
  // Ensure all fields exist
  return {
    userId: data.userId || generateUserId(),
    bonusCredits: data.bonusCredits ?? 0,
    monthlyCredits: data.monthlyCredits ?? CREDIT_CONFIG.MONTHLY_CREDITS,
    dailyCredits: data.dailyCredits ?? CREDIT_CONFIG.DAILY_LIMIT,
    dailyCreditsUsed: data.dailyCreditsUsed ?? 0,
    purchasedCredits: data.purchasedCredits ?? 0,
    creditResetDate: data.creditResetDate || getNextMonthResetDate(),
    dailyResetDate: data.dailyResetDate || getDateString(),
    createdAt: data.createdAt || new Date().toISOString(),
    isNewUser: data.isNewUser ?? false,
  };
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
    updated.dailyCredits = CREDIT_CONFIG.DAILY_LIMIT;
    updated.dailyResetDate = today;
  }

  // Reset monthly credits if past reset date
  const resetDate = new Date(data.creditResetDate);
  if (now >= resetDate) {
    updated.monthlyCredits = CREDIT_CONFIG.MONTHLY_CREDITS;
    updated.creditResetDate = getNextMonthResetDate();
  }

  if (JSON.stringify(updated) !== JSON.stringify(data)) {
    saveCreditData(updated);
  }

  return updated;
}

// Calculate credit cost for a render based on timing and speed
export function calculateRenderCost(
  _numFonts: number,
  durationSeconds: number,
  totalFrames: number
): CreditCost {
  // Base cost: 5 credits minimum
  const base = 5;
  
  // Duration cost: 2 credits per second of video
  const duration = Math.round(durationSeconds * 2);
  
  // Speed cost: based on total frames (higher FPS = more frames = more processing)
  // ~0.1 credits per frame
  const speed = Math.round(totalFrames * 0.1);

  const rawTotal = base + duration + speed;
  const total = Math.max(
    CREDIT_CONFIG.MIN_RENDER_COST,
    Math.min(CREDIT_CONFIG.MAX_RENDER_COST, Math.round(rawTotal))
  );

  return { base, duration, speed, total };
}

// Get total available credits (spendable pools only - not daily limit)
export function getTotalAvailableCredits(data: CreditData): number {
  // Daily is a limit/cap, not actual credits. Only count actual credit pools.
  return data.bonusCredits + data.monthlyCredits + data.purchasedCredits;
}

// Get remaining daily limit (how much more can be used today)
export function getRemainingDailyCredits(data: CreditData): number {
  return Math.max(0, data.dailyCredits - data.dailyCreditsUsed);
}

// Check if user can afford a render
export function canAffordRender(data: CreditData, cost: number): { canAfford: boolean; reason?: string } {
  // Check daily limit first (this is a rate limit, not actual credits)
  const remainingDaily = getRemainingDailyCredits(data);
  if (remainingDaily < cost) {
    return { 
      canAfford: false, 
      reason: `Daily limit reached (${data.dailyCreditsUsed}/${data.dailyCredits} used today). Try again tomorrow.` 
    };
  }

  // Check total credits across spendable pools
  const totalAvailable = getTotalAvailableCredits(data);
  if (totalAvailable < cost) {
    return { 
      canAfford: false, 
      reason: `Not enough credits (${totalAvailable} available, need ${cost}). Buy credits or wait for monthly reset.` 
    };
  }

  return { canAfford: true };
}

// Deduct credits after successful render
// Order: Daily → Bonus → Monthly → Purchased
export function deductCredits(data: CreditData, cost: number): CreditData {
  let remainingCost = cost;
  const updated = { ...data };

  // Update daily usage first (this is a limit, not deducted from)
  updated.dailyCreditsUsed += cost;

  // Deduct from bonus credits first
  if (updated.bonusCredits > 0) {
    const deductFromBonus = Math.min(updated.bonusCredits, remainingCost);
    updated.bonusCredits -= deductFromBonus;
    remainingCost -= deductFromBonus;
  }

  // Then from monthly credits
  if (remainingCost > 0 && updated.monthlyCredits > 0) {
    const deductFromMonthly = Math.min(updated.monthlyCredits, remainingCost);
    updated.monthlyCredits -= deductFromMonthly;
    remainingCost -= deductFromMonthly;
  }

  // Finally from purchased credits
  if (remainingCost > 0 && updated.purchasedCredits > 0) {
    updated.purchasedCredits = Math.max(0, updated.purchasedCredits - remainingCost);
  }

  saveCreditData(updated);
  return updated;
}

// Add purchased credits
export function addPurchasedCredits(data: CreditData, amount: number): CreditData {
  const updated = { ...data, purchasedCredits: data.purchasedCredits + amount };
  saveCreditData(updated);
  return updated;
}

// Mark user as no longer new (after onboarding)
export function markOnboardingComplete(data: CreditData): CreditData {
  const updated = { ...data, isNewUser: false };
  saveCreditData(updated);
  return updated;
}

// Get credit status color
export function getCreditStatusColor(current: number, max: number): 'green' | 'yellow' | 'red' {
  if (max === 0) return 'red';
  const percentage = (current / max) * 100;
  if (percentage > 50) return 'green';
  if (percentage > 20) return 'yellow';
  return 'red';
}

// Get bonus credit status color (special handling since bonus depletes permanently)
export function getBonusCreditStatusColor(current: number): 'green' | 'yellow' | 'red' {
  if (current <= 0) return 'red';
  if (current > 250) return 'green';
  if (current > 100) return 'yellow';
  return 'red';
}

// Format date for display
export function formatResetDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Estimate render time based on settings
export function estimateRenderTime(totalFrames: number, fps: number): string {
  // Approximate: ~50ms per frame for rendering + some overhead
  const estimatedMs = totalFrames * 50 + 1000;
  const seconds = Math.ceil(estimatedMs / 1000);
  
  if (seconds < 60) {
    return `~${seconds}s`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `~${minutes}m`;
}
