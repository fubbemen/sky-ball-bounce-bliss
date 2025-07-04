
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GameCourt from './GameCourt';
import GameControls from './GameControls';
import ScoreBoard from './ScoreBoard';

const BossaballGame = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused'>('menu');
  const [gameMode, setGameMode] = useState<'single' | 'two-player'>('single');
  const [scores, setScores] = useState({ left: 0, right: 0 });
  const [gameTime, setGameTime] = useState(0);
  const gameLoopRef = useRef<number>();

  const startGame = (mode: 'single' | 'two-player') => {
    setGameMode(mode);
    setGameState('playing');
    setScores({ left: 0, right: 0 });
    setGameTime(0);
  };

  const pauseGame = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  };

  const resetGame = () => {
    setGameState('menu');
    setScores({ left: 0, right: 0 });
    setGameTime(0);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const startTime = Date.now() - gameTime * 1000;
      const updateTime = () => {
        setGameTime((Date.now() - startTime) / 1000);
        gameLoopRef.current = requestAnimationFrame(updateTime);
      };
      gameLoopRef.current = requestAnimationFrame(updateTime);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameTime]);

  const updateScore = (side: 'left' | 'right') => {
    setScores(prev => ({
      ...prev,
      [side]: prev[side] + 1
    }));
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
              BOSSABALL
            </h1>
            <p className="text-lg text-gray-600">3D Overhead Game</p>
          </div>
          
          <div className="mb-8 space-y-2 text-sm text-gray-600">
            <p>🏐 Hit the ball with your player</p>
            <p>🤸‍♂️ Use trampolines to bounce higher</p>
            <p>🎯 Score by landing the ball on opponent's side</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => startGame('single')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 text-lg"
            >
              1 Player (vs AI)
            </Button>
            
            <Button 
              onClick={() => startGame('two-player')}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 text-lg"
            >
              2 Players
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScoreBoard 
        scores={scores} 
        gameTime={gameTime}
        gameMode={gameMode}
        onPause={pauseGame}
        onReset={resetGame}
        isPaused={gameState === 'paused'}
      />
      
      <div className="flex-1 relative">
        <GameCourt 
          gameState={gameState}
          gameMode={gameMode}
          onScore={updateScore}
        />
        
        <GameControls gameMode={gameMode} />
      </div>
    </div>
  );
};

export default BossaballGame;
