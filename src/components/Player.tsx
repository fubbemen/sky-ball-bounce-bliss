
import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
  color: 'blue' | 'red';
  isJumping: boolean;
}

const Player = ({ x, y, color, isJumping }: PlayerProps) => {
  const baseColor = color === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  const shadowColor = color === 'blue' ? 'shadow-blue-300' : 'shadow-red-300';
  const borderColor = color === 'blue' ? 'border-blue-700' : 'border-red-700';
  
  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${isJumping ? 'scale-125' : 'scale-100'}`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      }}
    >
      {/* Player body - overhead view */}
      <div className={`w-12 h-16 ${baseColor} rounded-t-full rounded-b-lg ${shadowColor} shadow-lg border-2 ${borderColor} relative`}>
        {/* Head */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-200 rounded-full border-2 border-amber-300">
          {/* Eyes */}
          <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full" />
          <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full" />
        </div>
        
        {/* Arms indication */}
        <div className="absolute top-2 -left-1 w-2 h-6 bg-amber-200 rounded opacity-80" />
        <div className="absolute top-2 -right-1 w-2 h-6 bg-amber-200 rounded opacity-80" />
        
        {/* Team indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded opacity-80" />
      </div>
    </div>
  );
};

export default Player;
