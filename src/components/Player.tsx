
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
  
  return (
    <div 
      className={`absolute w-10 h-10 ${baseColor} rounded-full ${shadowColor} shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${isJumping ? 'scale-110' : 'scale-100'}`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      }}
    >
      {/* Player face */}
      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
        <div className="w-1 h-1 bg-black rounded-full mr-1" />
        <div className="w-1 h-1 bg-black rounded-full" />
      </div>
    </div>
  );
};

export default Player;
