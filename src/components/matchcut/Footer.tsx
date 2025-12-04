import { FileJson, Image, Info } from 'lucide-react';

interface FooterProps {
  lastExport: { filename: string; frames: number } | null;
}

export function Footer({ lastExport }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            {lastExport ? (
              <>
                <span className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-primary" />
                  {lastExport.frames} PNGs exported
                </span>
                <span className="flex items-center gap-1.5">
                  <FileJson className="w-3.5 h-3.5 text-primary" />
                  {lastExport.filename}_timing.json
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Enter text and click "Generate MatchCut" to export
              </span>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-muted-foreground">
            <span>Import: Premiere → Import Image Sequence</span>
            <span>•</span>
            <span>AE → Import → File → PNG Sequence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
