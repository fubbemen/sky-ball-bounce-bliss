
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface ScoreBoardProps {
  scores: { left: number; right: number };
  gameTime: number;
  gameMode: 'single' | 'two-player';
  onPause: () => void;
  onReset: () => void;
  isPaused: boolean;
}

const ScoreBoard = ({ scores, gameTime, gameMode, onPause, onReset, isPaused }: ScoreBoardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="m-4 p-4 bg-white/90 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{scores.left}</div>
            <div className="text-sm text-gray-600">Player 1</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-mono text-gray-800">{formatTime(gameTime)}</div>
            <div className="text-sm text-gray-600">
              {gameMode === 'single' ? '1P vs AI' : '2 Players'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{scores.right}</div>
            <div className="text-sm text-gray-600">
              {gameMode === 'single' ? 'AI' : 'Player 2'}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="flex items-center space-x-1"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center space-x-1"
          >
            <RotateCcw size={16} />
            <span>Menu</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScoreBoard;
