
import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import Ball from './Ball';
import Trampoline from './Trampoline';

interface GameCourtProps {
  gameState: 'playing' | 'paused';
  onScore: (side: 'left' | 'right') => void;
}

const GameCourt = ({ gameState, onScore }: GameCourtProps) => {
  const courtRef = useRef<HTMLDivElement>(null);
  const [courtDimensions, setCourtDimensions] = useState({ width: 800, height: 400 });
  
  // Game objects state
  const [ball, setBall] = useState({
    x: 400,
    y: 200,
    vx: 0,
    vy: 0,
    radius: 15
  });
  
  const [players, setPlayers] = useState({
    left: { x: 150, y: 300, vx: 0, vy: 0, onGround: true },
    right: { x: 650, y: 300, vx: 0, vy: 0, onGround: true }
  });

  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Update court dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (courtRef.current) {
        const rect = courtRef.current.getBoundingClientRect();
        setCourtDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev.add(e.key.toLowerCase())));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game physics loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update player positions based on keys
      setPlayers(prev => {
        const newPlayers = { ...prev };
        
        // Player 1 (WASD)
        if (keys.has('a')) newPlayers.left.vx = Math.max(newPlayers.left.vx - 1, -8);
        if (keys.has('d')) newPlayers.left.vx = Math.min(newPlayers.left.vx + 1, 8);
        if (keys.has('w') && newPlayers.left.onGround) {
          newPlayers.left.vy = -15;
          newPlayers.left.onGround = false;
        }
        
        // Player 2 (Arrow keys)
        if (keys.has('arrowleft')) newPlayers.right.vx = Math.max(newPlayers.right.vx - 1, -8);
        if (keys.has('arrowright')) newPlayers.right.vx = Math.min(newPlayers.right.vx + 1, 8);
        if (keys.has('arrowup') && newPlayers.right.onGround) {
          newPlayers.right.vy = -15;
          newPlayers.right.onGround = false;
        }

        // Apply physics to both players
        ['left', 'right'].forEach(side => {
          const player = newPlayers[side as keyof typeof newPlayers];
          
          // Apply gravity
          player.vy += 0.8;
          
          // Update position
          player.x += player.vx;
          player.y += player.vy;
          
          // Apply friction
          player.vx *= 0.85;
          
          // Ground collision
          if (player.y >= 300) {
            player.y = 300;
            player.vy = 0;
            player.onGround = true;
          }
          
          // Side boundaries
          if (side === 'left') {
            player.x = Math.max(20, Math.min(380, player.x));
          } else {
            player.x = Math.max(420, Math.min(780, player.x));
          }
        });
        
        return newPlayers;
      });

      // Update ball physics
      setBall(prev => {
        let newBall = { ...prev };
        
        // Apply gravity
        newBall.vy += 0.5;
        
        // Update position
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;
        
        // Bounce off walls
        if (newBall.x <= newBall.radius || newBall.x >= courtDimensions.width - newBall.radius) {
          newBall.vx *= -0.8;
          newBall.x = newBall.x <= newBall.radius ? newBall.radius : courtDimensions.width - newBall.radius;
        }
        
        // Ground collision and scoring
        if (newBall.y >= courtDimensions.height - newBall.radius) {
          newBall.y = courtDimensions.height - newBall.radius;
          newBall.vy *= -0.6;
          
          // Check for scoring
          if (Math.abs(newBall.vy) < 2) {
            if (newBall.x < courtDimensions.width / 2) {
              onScore('right');
            } else {
              onScore('left');
            }
            // Reset ball
            newBall = { x: 400, y: 200, vx: (Math.random() - 0.5) * 10, vy: 0, radius: 15 };
          }
        }
        
        // Net collision
        if (Math.abs(newBall.x - courtDimensions.width / 2) < 5 && newBall.y > 250) {
          newBall.vx *= -0.9;
        }
        
        // Player collisions
        const checkPlayerCollision = (player: any) => {
          const dx = newBall.x - player.x;
          const dy = newBall.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < newBall.radius + 25) {
            const angle = Math.atan2(dy, dx);
            const speed = Math.sqrt(newBall.vx * newBall.vx + newBall.vy * newBall.vy) + 5;
            newBall.vx = Math.cos(angle) * speed;
            newBall.vy = Math.sin(angle) * speed;
            
            // Move ball away from player
            newBall.x = player.x + Math.cos(angle) * (newBall.radius + 25);
            newBall.y = player.y + Math.sin(angle) * (newBall.radius + 25);
          }
        };
        
        checkPlayerCollision(players.left);
        checkPlayerCollision(players.right);
        
        return newBall;
      });
    }, 16); // ~60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState, keys, players, courtDimensions, onScore]);

  return (
    <div className="flex-1 p-4">
      <div 
        ref={courtRef}
        className="relative w-full h-96 bg-gradient-to-b from-blue-200 to-green-300 rounded-lg shadow-lg overflow-hidden border-4 border-white"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Court decorations */}
        <div className="absolute inset-0">
          {/* Net */}
          <div className="absolute left-1/2 top-64 w-2 h-32 bg-white transform -translate-x-1/2" />
          
          {/* Court lines */}
          <div className="absolute left-0 top-80 w-full h-1 bg-white" />
          <div className="absolute left-1/2 top-0 w-1 h-full bg-white transform -translate-x-1/2" />
        </div>

        {/* Trampolines */}
        <Trampoline x={100} y={320} />
        <Trampoline x={700} y={320} />
        
        {/* Players */}
        <Player 
          x={players.left.x} 
          y={players.left.y} 
          color="blue" 
          isJumping={!players.left.onGround}
        />
        <Player 
          x={players.right.x} 
          y={players.right.y} 
          color="red" 
          isJumping={!players.right.onGround}
        />
        
        {/* Ball */}
        <Ball x={ball.x} y={ball.y} />
        
        {/* Controls hint */}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 p-2 rounded">
          Player 1: WASD | Player 2: Arrow Keys
        </div>
      </div>
    </div>
  );
};

export default GameCourt;
