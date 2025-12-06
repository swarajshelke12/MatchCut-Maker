import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Plus, RotateCcw, History, AlertCircle } from 'lucide-react';
import { CreditData, loadCreditData, saveCreditData, CREDIT_CONFIG, formatResetDate, isInTrial, getTrialDaysRemaining } from '@/lib/credits';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Admin emails that can access the panel
const ADMIN_EMAILS = ['admin@example.com']; // Add your admin emails here

interface RenderLog {
  id: string;
  timestamp: string;
  cost: number;
  success: boolean;
  text: string;
  duration: number;
  frames: number;
}

const RENDER_LOG_KEY = 'matchcut_render_logs';

export function loadRenderLogs(): RenderLog[] {
  try {
    const stored = localStorage.getItem(RENDER_LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function logRender(log: Omit<RenderLog, 'id' | 'timestamp'>): void {
  const logs = loadRenderLogs();
  logs.unshift({
    ...log,
    id: Math.random().toString(36).substring(2),
    timestamp: new Date().toISOString(),
  });
  // Keep only last 100 logs
  localStorage.setItem(RENDER_LOG_KEY, JSON.stringify(logs.slice(0, 100)));
}

export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [renderLogs, setRenderLogs] = useState<RenderLog[]>([]);
  const [addCreditsAmount, setAddCreditsAmount] = useState('100');

  useEffect(() => {
    if (open) {
      setCreditData(loadCreditData());
      setRenderLogs(loadRenderLogs());
    }
  }, [open]);

  const handleAddCredits = () => {
    if (!creditData) return;
    const amount = parseInt(addCreditsAmount) || 0;
    if (amount <= 0) return;

    const updated = {
      ...creditData,
      purchasedCredits: creditData.purchasedCredits + amount,
    };
    saveCreditData(updated);
    setCreditData(updated);
    toast.success(`Added ${amount} credits`);
    setAddCreditsAmount('100');
  };

  const handleResetDaily = () => {
    if (!creditData) return;
    const updated = { ...creditData, dailyCreditsUsed: 0 };
    saveCreditData(updated);
    setCreditData(updated);
    toast.success('Daily credits reset');
  };

  const handleResetMonthly = () => {
    if (!creditData) return;
    const updated = { ...creditData, monthlyCredits: CREDIT_CONFIG.MONTHLY_CREDITS };
    saveCreditData(updated);
    setCreditData(updated);
    toast.success('Monthly credits reset');
  };

  const handleResetTrial = () => {
    if (!creditData) return;
    const updated = { ...creditData, trialStartDate: new Date().toISOString() };
    saveCreditData(updated);
    setCreditData(updated);
    toast.success('Trial reset to today');
  };

  const failedRenders = renderLogs.filter(log => !log.success);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Admin Panel"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Admin Panel
          </DialogTitle>
          <DialogDescription>
            Manage credits, view history, and debug render issues.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* User Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Current User
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">User ID:</span>
                  <p className="font-mono text-xs break-all">{creditData?.userId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trial Status:</span>
                  <p>
                    {creditData && isInTrial(creditData) ? (
                      <Badge variant="default">{getTrialDaysRemaining(creditData)} days left</Badge>
                    ) : (
                      <Badge variant="secondary">Expired</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Credits:</span>
                  <p className="font-medium">{creditData?.monthlyCredits} / {CREDIT_CONFIG.MONTHLY_CREDITS}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Daily Used:</span>
                  <p className="font-medium">{creditData?.dailyCreditsUsed} / {CREDIT_CONFIG.DAILY_LIMIT}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Purchased:</span>
                  <p className="font-medium">{creditData?.purchasedCredits}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Reset:</span>
                  <p className="font-medium">
                    {creditData?.creditResetDate && formatResetDate(creditData.creditResetDate)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Credit Controls */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Credit Controls
              </h3>
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={addCreditsAmount}
                  onChange={(e) => setAddCreditsAmount(e.target.value)}
                  className="w-24"
                  min="1"
                />
                <Button onClick={handleAddCredits} size="sm">
                  Add Credits
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleResetDaily} variant="outline" size="sm">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset Daily
                </Button>
                <Button onClick={handleResetMonthly} variant="outline" size="sm">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset Monthly
                </Button>
                <Button onClick={handleResetTrial} variant="outline" size="sm">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset Trial
                </Button>
              </div>
            </div>

            <Separator />

            {/* Render History */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Recent Renders ({renderLogs.length})
              </h3>
              
              {renderLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No render history yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {renderLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-md text-xs',
                        log.success ? 'bg-secondary/30' : 'bg-destructive/10'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={log.success ? 'text-emerald-400' : 'text-red-400'}>
                          {log.success ? '✓' : '✗'}
                        </span>
                        <span className="font-mono truncate max-w-[150px]">{log.text}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span>{log.cost} credits</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Failed Renders */}
            {failedRenders.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    Failed Renders ({failedRenders.length})
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {failedRenders.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded-md bg-destructive/10 text-xs"
                      >
                        <div className="flex justify-between">
                          <span className="font-mono truncate max-w-[200px]">{log.text}</span>
                          <span className="text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          Duration: {log.duration}s, Frames: {log.frames}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
