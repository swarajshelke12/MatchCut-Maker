import { FileJson, Image, Info, Video, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  lastExport: { filename: string; frames: number; format: string } | null;
}

export function Footer({ lastExport }: FooterProps) {
  return (
    <footer className="border-t border-border/40 glass-panel rounded-none">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            {lastExport ? (
              <>
                <span className="flex items-center gap-1.5 text-foreground/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">Last export:</span>
                </span>
                <span className="flex items-center gap-1.5">
                  {lastExport.format === 'WebM' ? (
                    <Video className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Image className="w-3.5 h-3.5 text-primary" />
                  )}
                  {lastExport.frames} frames · {lastExport.format}
                </span>
                <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] opacity-80">
                  <FileJson className="w-3.5 h-3.5 text-primary" />
                  {lastExport.filename}_matchcut.{lastExport.format === 'WebM' ? 'webm' : 'zip'}
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Enter text and hit Export to download your sequence
              </span>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-muted-foreground/80">
            <span className="text-[11px]">WebM · drag & drop into any editor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
