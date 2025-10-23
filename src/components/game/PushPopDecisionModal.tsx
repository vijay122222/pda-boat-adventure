import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface PushPopDecisionModalProps {
  open: boolean;
  symbol: string;
  currentStack: string[];
  onDecision: (decision: 'push' | 'pop') => void;
  expectedOperation: 'push' | 'pop' | 'none';
  explanation: string;
  wrongAttempt?: {
    decision: 'push' | 'pop';
    reason: string;
  };
}

const PushPopDecisionModal = ({ 
  open, 
  symbol, 
  currentStack, 
  onDecision, 
  expectedOperation,
  explanation,
  wrongAttempt 
}: PushPopDecisionModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Decision Time!
          </DialogTitle>
          <DialogDescription className="text-base mt-3">
            Processing symbol: <span className="font-mono text-xl font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg">{symbol}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-bold mb-2 text-sm">Current Stack:</h4>
            <div className="font-mono text-sm">
              {currentStack.length === 0 ? (
                <span className="text-muted-foreground italic">Empty</span>
              ) : (
                <span className="text-primary font-bold">[{currentStack.join(', ')}]</span>
              )}
            </div>
          </div>

          {wrongAttempt && (
            <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start gap-2">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h4 className="font-bold text-destructive mb-2">Wrong Choice!</h4>
                  <p className="text-sm text-foreground">{wrongAttempt.reason}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">Try again with the correct operation.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-bold text-center text-lg">What operation should be performed?</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={() => onDecision('push')}
                className="h-24 flex flex-col gap-2 hover:bg-secondary/20 hover:border-secondary hover:scale-105 transition-all"
              >
                <ArrowUp className="w-8 h-8 text-secondary" />
                <span className="text-lg font-bold">PUSH</span>
                <span className="text-xs text-muted-foreground">Add to stack</span>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => onDecision('pop')}
                className="h-24 flex flex-col gap-2 hover:bg-accent/20 hover:border-accent hover:scale-105 transition-all"
              >
                <ArrowDown className="w-8 h-8 text-accent" />
                <span className="text-lg font-bold">POP</span>
                <span className="text-xs text-muted-foreground">Remove from stack</span>
              </Button>
            </div>
          </div>

          {!wrongAttempt && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-semibold">Hint:</span> Think about the PDA rule for this symbol and the current state.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PushPopDecisionModal;
