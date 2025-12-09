import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Sliders, Download, Gift, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

const ONBOARDING_KEY = 'matchcut_onboarding_dismissed';

const slides = [
  {
    icon: FileText,
    title: 'Paste Your Text',
    description: 'Paste text or type directly. Keep it short for punchy, rapid previews that pop.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Sliders,
    title: 'Customize Your Style',
    description: 'Choose fonts, adjust frames, speed, and pick an animation style preset.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Download,
    title: 'Export Your MatchCut',
    description: 'Generate your MatchCut effect and export as WebM video or PNG sequence.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Gift,
    title: 'Welcome Bonus!',
    description: 'You received 500 Bonus Credits to get started. Create amazing effects today!',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleComplete()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-8">
          {/* Icon */}
          <div className={cn('w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center', currentSlideData.bg)}>
            <Icon className={cn('w-10 h-10', currentSlideData.color)} />
          </div>

          {/* Content */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {currentSlideData.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {currentSlideData.description}
            </p>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === currentSlide
                    ? 'w-6 bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className={cn(currentSlide === 0 && 'invisible')}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="px-6"
            >
              {currentSlide === slides.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Don't show again */}
        <div className="px-8 pb-6 pt-0">
          <div className="flex items-center gap-2 justify-center">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(!!checked)}
            />
            <label
              htmlFor="dontShowAgain"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Don't show this again
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useOnboarding() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(ONBOARDING_KEY);
    if (!dismissed) {
      setShouldShow(true);
    }
  }, []);

  return { shouldShow, setShouldShow };
}
