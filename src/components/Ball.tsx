
import React from 'react';

interface BallProps {
  x: number;
  y: number;
}

const Ball = ({ x, y }: BallProps) => {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))'
      }}
    >
      {/* Main ball */}
      <div className="w-8 h-8 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 rounded-full relative border-2 border-orange-700">
        {/* Volleyball pattern */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* Curved lines for volleyball pattern */}
          <div className="absolute top-1 left-1/2 w-6 h-0.5 bg-orange-800 rounded transform -translate-x-1/2 rotate-45" />
          <div className="absolute top-1 left-1/2 w-6 h-0.5 bg-orange-800 rounded transform -translate-x-1/2 -rotate-45" />
          <div className="absolute bottom-1 left-1/2 w-6 h-0.5 bg-orange-800 rounded transform -translate-x-1/2 rotate-45" />
          <div className="absolute bottom-1 left-1/2 w-6 h-0.5 bg-orange-800 rounded transform -translate-x-1/2 -rotate-45" />
        </div>
        
        {/* Highlight */}
        <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full opacity-60" />
      </div>
    </div>
  );
};

export default Ball;
