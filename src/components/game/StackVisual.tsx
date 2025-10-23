import { useEffect, useState } from 'react';
import { StackSymbol } from '@/types/pda';

interface StackVisualProps {
  stack: StackSymbol[];
  animatingPush?: boolean;
  animatingPop?: boolean;
}

const StackVisual = ({ stack, animatingPush, animatingPop }: StackVisualProps) => {
  const [displayStack, setDisplayStack] = useState<StackSymbol[]>(stack);

  useEffect(() => {
    setDisplayStack(stack);
  }, [stack]);

  const getStackColor = (symbol: StackSymbol) => {
    const colors = {
      A: 'from-purple-500 to-purple-600',
      X: 'from-amber-500 to-orange-600',
      Y: 'from-emerald-500 to-teal-600',
      Z: 'from-blue-500 to-cyan-600',
    };
    return colors[symbol] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-lg font-bold text-primary mb-2">Stack</h3>
      <div className="relative min-h-[300px] w-24 bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border-4 border-primary/30 flex flex-col-reverse items-center p-2 gap-1 overflow-hidden">
        {displayStack.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Empty</span>
          </div>
        ) : (
          displayStack.map((symbol, index) => (
            <div
              key={`${symbol}-${index}-${Date.now()}`}
              className={`
                w-20 h-14 rounded-md shadow-lg flex items-center justify-center
                text-white font-bold text-2xl
                bg-gradient-to-br ${getStackColor(symbol)}
                border-2 border-white/30
                ${
                  index === displayStack.length - 1 && animatingPush
                    ? 'animate-stack-push'
                    : index === displayStack.length - 1 && animatingPop
                    ? 'animate-stack-pop'
                    : ''
                }
              `}
              style={{
                transformOrigin: 'bottom center',
              }}
            >
              {symbol}
            </div>
          ))
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        Height: {displayStack.length}
      </div>
    </div>
  );
};

export default StackVisual;
