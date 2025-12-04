import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { MatchCutSequence, renderFrameToCanvas } from '@/lib/matchcut';

interface PreviewCanvasProps {
  sequence: MatchCutSequence | null;
}

export function PreviewCanvas({ sequence }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const renderCurrentFrame = useCallback(() => {
    if (!canvasRef.current || !sequence) return;
    
    const frame = sequence.frames[currentFrame];
    if (!frame) return;

    renderFrameToCanvas(
      canvasRef.current,
      sequence.text,
      frame.fontFamily,
      sequence.settings.fontSize,
      sequence.settings.foregroundColor,
      sequence.settings.backgroundColor
    );
  }, [sequence, currentFrame]);

  useEffect(() => {
    renderCurrentFrame();
  }, [renderCurrentFrame]);

  useEffect(() => {
    if (!isPlaying || !sequence) return;

    const frameDuration = 1000 / sequence.fps;

    const animate = (time: number) => {
      if (time - lastTimeRef.current >= frameDuration) {
        setCurrentFrame((prev) => {
          const next = prev + 1;
          return next >= sequence.totalFrames ? 0 : next;
        });
        lastTimeRef.current = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, sequence]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleScrub = (value: number[]) => {
    setIsPlaying(false);
    setCurrentFrame(value[0]);
  };

  if (!sequence) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 checkerboard rounded-lg flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <Maximize2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Enter text to preview your MatchCut</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 checkerboard rounded-lg overflow-hidden border border-border relative">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-contain"
        />
        
        {/* Current font indicator */}
        <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono text-muted-foreground">
          {sequence.frames[currentFrame]?.fontName}
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            className="bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1">
          <Slider
            value={[currentFrame]}
            min={0}
            max={Math.max(0, sequence.totalFrames - 1)}
            step={1}
            onValueChange={handleScrub}
            className="cursor-pointer"
          />
        </div>

        <div className="text-xs font-mono text-muted-foreground min-w-[80px] text-right">
          {currentFrame + 1} / {sequence.totalFrames}
        </div>
      </div>

      {/* Tips */}
      <p className="text-xs text-muted-foreground text-center">
        Tip: Use 1–2 frames per card for a punchy look. Seed ensures reproducibility.
      </p>
    </div>
  );
}
