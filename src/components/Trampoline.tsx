
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
      {/* Trampoline surface */}
      <div className="w-20 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg" />
      
      {/* Trampoline springs */}
      <div className="absolute -bottom-2 left-2 w-1 h-6 bg-gray-400" />
      <div className="absolute -bottom-2 left-6 w-1 h-6 bg-gray-400" />
      <div className="absolute -bottom-2 left-10 w-1 h-6 bg-gray-400" />
      <div className="absolute -bottom-2 left-14 w-1 h-6 bg-gray-400" />
      <div className="absolute -bottom-2 right-2 w-1 h-6 bg-gray-400" />
    </div>
  );
};

export default Trampoline;
