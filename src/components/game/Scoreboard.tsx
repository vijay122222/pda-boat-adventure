import { Card } from '@/components/ui/card';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface ScoreboardProps {
  totalPlayed: number;
  totalAccepted: number;
  correctPredictions: number;
  currentStreak: number;
}

const Scoreboard = ({ totalPlayed, totalAccepted, correctPredictions, currentStreak }: ScoreboardProps) => {
  const acceptanceRate = totalPlayed > 0 ? Math.round((totalAccepted / totalPlayed) * 100) : 0;
  const predictionRate = totalPlayed > 0 ? Math.round((correctPredictions / totalPlayed) * 100) : 0;

  return (
    <Card className="p-4 bg-card">
      <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Scoreboard
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Target className="w-3 h-3" />
            Total Played
          </div>
          <div className="text-2xl font-bold text-foreground">{totalPlayed}</div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-muted-foreground text-xs mb-1">Accepted</div>
          <div className="text-2xl font-bold text-secondary">{totalAccepted}</div>
          <div className="text-xs text-muted-foreground">{acceptanceRate}%</div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-muted-foreground text-xs mb-1">Correct Predictions</div>
          <div className="text-2xl font-bold text-accent">{correctPredictions}</div>
          <div className="text-xs text-muted-foreground">{predictionRate}%</div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            Current Streak
          </div>
          <div className="text-2xl font-bold text-primary">{currentStreak}</div>
        </div>
      </div>
    </Card>
  );
};

export default Scoreboard;
