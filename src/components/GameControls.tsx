
import React from 'react';
import { Card } from '@/components/ui/card';

const GameControls = () => {
  return (
    <Card className="absolute bottom-4 right-4 p-4 bg-white/90 backdrop-blur-sm">
      <div className="text-sm space-y-2">
        <div className="font-bold text-center mb-2">Controls</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-semibold text-blue-600">Player 1</div>
            <div>W - Jump</div>
            <div>A - Left</div>
            <div>D - Right</div>
          </div>
          <div>
            <div className="font-semibold text-red-600">Player 2</div>
            <div>↑ - Jump</div>
            <div>← - Left</div>
            <div>→ - Right</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameControls;
