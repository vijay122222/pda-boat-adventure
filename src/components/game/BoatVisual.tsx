import { Anchor, Palmtree, Mountain, Sparkles } from 'lucide-react';

interface BoatVisualProps {
  position: number; // 0-100
  sinking?: boolean;
  sailing?: boolean;
  reachedDestination?: boolean;
}

const BoatVisual = ({ position, sinking, sailing, reachedDestination }: BoatVisualProps) => {
  return (
    <div className="relative w-full h-48">
      {/* Highland Island at the end */}
      <div className="absolute right-0 bottom-0 w-32 h-40 z-10">
        {/* Island base */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-700 via-green-600 to-green-500 rounded-t-full border-4 border-green-800">
          {/* Sand beach */}
          <div className="absolute bottom-0 w-full h-6 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg"></div>
          
          {/* Palm trees */}
          <div className="absolute bottom-8 left-4">
            <Palmtree className="w-8 h-8 text-green-900" />
          </div>
          <div className="absolute bottom-12 right-6">
            <Palmtree className="w-10 h-10 text-green-900" />
          </div>
          
          {/* Mountain peak */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <Mountain className="w-12 h-12 text-green-900" />
          </div>
        </div>
        
        {/* Appreciation when reached */}
        {reachedDestination && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-scale-in">
            <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-lg font-bold text-sm whitespace-nowrap flex items-center gap-2 animate-pulse-glow">
              <Sparkles className="w-4 h-4" />
              Safe Arrival!
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* River */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-lg overflow-hidden">
        {/* Animated waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-[200%] h-full animate-wave">
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
          <div className="absolute w-[200%] h-full animate-wave" style={{ animationDelay: '-2s' }}>
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,70 Q150,40 300,70 T600,70 T900,70 T1200,70 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Boat */}
      <div
        className={`absolute transition-all duration-1000 ease-in-out ${
          sinking ? 'animate-boat-sink' : sailing ? 'animate-float-boat' : 'animate-float-boat'
        }`}
        style={{
          left: `${Math.min(position, 85)}%`,
          bottom: '35px',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Boat body */}
        <div className="relative">
          {/* Sail */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-red-500">
            </div>
            <div className="w-1 h-12 bg-amber-900 mx-auto -mt-1"></div>
          </div>
          
          {/* Hull */}
          <div className="relative w-20 h-8">
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <path
                d="M 10,10 L 90,10 L 85,35 L 15,35 Z"
                fill="hsl(var(--boat-brown))"
                stroke="hsl(30 60% 30%)"
                strokeWidth="2"
              />
              <ellipse cx="50" cy="10" rx="30" ry="5" fill="hsl(30 60% 35%)" />
            </svg>
          </div>

          {/* Anchor icon */}
          <div className="absolute -right-2 bottom-0">
            <Anchor className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatVisual;
