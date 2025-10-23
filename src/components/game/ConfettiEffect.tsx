import { useEffect, useState } from 'react';

interface Confetti {
  id: number;
  left: number;
  color: string;
  delay: number;
}

const ConfettiEffect = ({ active }: { active: boolean }) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (active) {
      const pieces: Confetti[] = [];
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
      
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
        });
      }
      
      setConfetti(pieces);
      
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-100px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
