
import React from 'react';
import { Card } from '@/components/ui/card';

interface GameControlsProps {
  gameMode: 'single' | 'two-player';
}

const GameControls = ({ gameMode }: GameControlsProps) => {
  return (
    <Card className="absolute bottom-4 right-4 p-4 bg-white/90 backdrop-blur-sm">
      <div className="text-sm space-y-2">
        <div className="font-bold text-center mb-2">Controls</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-semibold text-blue-600">Player 1</div>
            <div>Space - Jump</div>
            <div>W - Up</div>
            <div>A - Left</div>
            <div>S - Down</div>
            <div>D - Right</div>
          </div>
          <div>
            <div className="font-semibold text-red-600">
              {gameMode === 'single' ? 'AI Player' : 'Player 2'}
            </div>
            {gameMode === 'single' ? (
              <div className="text-gray-500">Automatic</div>
            ) : (
              <>
                <div>Shift - Jump</div>
                <div>↑ - Up</div>
                <div>← - Left</div>
                <div>↓ - Down</div>
                <div>→ - Right</div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameControls;
