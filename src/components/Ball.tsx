
import React from 'react';

interface BallProps {
  x: number;
  y: number;
}

const Ball = ({ x, y }: BallProps) => {
  return (
    <div 
      className="absolute w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      }}
    >
      {/* Ball pattern */}
      <div className="absolute inset-1 border border-orange-700 rounded-full opacity-50" />
      <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-70" />
    </div>
  );
};

export default Ball;
