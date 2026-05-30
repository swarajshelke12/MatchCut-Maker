import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Scissors, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "hsl(172, 90%, 50%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "hsl(260, 80%, 60%)" }}
      />

      <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-4 animate-fade-in relative z-10">
        {/* Icon */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mx-auto mb-6">
          <Scissors className="w-10 h-10 text-primary-foreground" strokeWidth={2} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary-glow animate-pulse-glow" />
        </div>

        {/* 404 */}
        <div className="text-8xl font-black gradient-text-primary leading-none mb-3">
          404
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Cut Not Found
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          This page doesn't exist — but your next MatchCut effect does.
          <br />
          Head back and start creating.
        </p>

        {/* CTA */}
        <a href="/">
          <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-semibold gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to MatchCut Maker
          </Button>
        </a>

        {/* Path hint */}
        <p className="text-xs text-muted-foreground/50 font-mono mt-4">
          {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
