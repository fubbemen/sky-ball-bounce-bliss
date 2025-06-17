
import React from 'react';

interface TrampolineProps {
  x: number;
  y: number;
}

const Trampoline = ({ x, y }: TrampolineProps) => {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {/* Trampoline surface - overhead view */}
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg border-4 border-purple-800">
          {/* Trampoline pattern */}
          <div className="absolute inset-2 border-2 border-purple-300 rounded-full opacity-60" />
          <div className="absolute inset-4 border border-purple-200 rounded-full opacity-40" />
          
          {/* Springs indication around the edge */}
          <div className="absolute -top-1 left-1/2 w-1 h-2 bg-gray-500 transform -translate-x-1/2" />
          <div className="absolute -bottom-1 left-1/2 w-1 h-2 bg-gray-500 transform -translate-x-1/2" />
          <div className="absolute -left-1 top-1/2 w-2 h-1 bg-gray-500 transform -translate-y-1/2" />
          <div className="absolute -right-1 top-1/2 w-2 h-1 bg-gray-500 transform -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Trampoline;
