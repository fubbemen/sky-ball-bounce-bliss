
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
  const [courtDimensions, setCourtDimensions] = useState({ width: 800, height: 600 });
  
  // Game objects state with 3D positioning
  const [ball, setBall] = useState({
    x: 400,
    y: 300,
    z: 0, // Height above ground
    vx: 0,
    vy: 0,
    vz: 0, // Vertical velocity
    radius: 15
  });
  
  const [players, setPlayers] = useState({
    left: { x: 200, y: 400, z: 0, vx: 0, vy: 0, vz: 0, onGround: true },
    right: { x: 600, y: 400, z: 0, vx: 0, vy: 0, vz: 0, onGround: true }
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

  // Game physics loop with 3D mechanics
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update player positions based on keys
      setPlayers(prev => {
        const newPlayers = { ...prev };
        
        // Player 1 (WASD) - overhead controls
        if (keys.has('a')) newPlayers.left.vx = Math.max(newPlayers.left.vx - 1, -6);
        if (keys.has('d')) newPlayers.left.vx = Math.min(newPlayers.left.vx + 1, 6);
        if (keys.has('s')) newPlayers.left.vy = Math.min(newPlayers.left.vy + 1, 6);
        if (keys.has('w')) {
          if (newPlayers.left.onGround) {
            newPlayers.left.vz = -12;
            newPlayers.left.onGround = false;
          } else {
            newPlayers.left.vy = Math.max(newPlayers.left.vy - 1, -6);
          }
        }
        
        // Player 2 (Arrow keys) - overhead controls
        if (keys.has('arrowleft')) newPlayers.right.vx = Math.max(newPlayers.right.vx - 1, -6);
        if (keys.has('arrowright')) newPlayers.right.vx = Math.min(newPlayers.right.vx + 1, 6);
        if (keys.has('arrowdown')) newPlayers.right.vy = Math.min(newPlayers.right.vy + 1, 6);
        if (keys.has('arrowup')) {
          if (newPlayers.right.onGround) {
            newPlayers.right.vz = -12;
            newPlayers.right.onGround = false;
          } else {
            newPlayers.right.vy = Math.max(newPlayers.right.vy - 1, -6);
          }
        }

        // Apply 3D physics to both players
        ['left', 'right'].forEach(side => {
          const player = newPlayers[side as keyof typeof newPlayers];
          
          // Apply gravity to Z axis
          player.vz += 0.6;
          
          // Update position
          player.x += player.vx;
          player.y += player.vy;
          player.z += player.vz;
          
          // Apply friction
          player.vx *= 0.9;
          player.vy *= 0.9;
          
          // Ground collision (Z axis)
          if (player.z >= 0) {
            player.z = 0;
            player.vz = 0;
            player.onGround = true;
          }
          
          // Court boundaries
          player.x = Math.max(30, Math.min(courtDimensions.width - 30, player.x));
          player.y = Math.max(30, Math.min(courtDimensions.height - 30, player.y));
          
          // Net restriction (players can't cross the middle)
          if (side === 'left') {
            player.x = Math.min(player.x, courtDimensions.width / 2 - 40);
          } else {
            player.x = Math.max(player.x, courtDimensions.width / 2 + 40);
          }
        });
        
        return newPlayers;
      });

      // Update ball physics with 3D mechanics
      setBall(prev => {
        let newBall = { ...prev };
        
        // Apply gravity to Z axis
        newBall.vz += 0.4;
        
        // Update position
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;
        newBall.z += newBall.vz;
        
        // Bounce off side walls
        if (newBall.x <= newBall.radius || newBall.x >= courtDimensions.width - newBall.radius) {
          newBall.vx *= -0.8;
          newBall.x = newBall.x <= newBall.radius ? newBall.radius : courtDimensions.width - newBall.radius;
        }
        
        // Bounce off front/back walls
        if (newBall.y <= newBall.radius || newBall.y >= courtDimensions.height - newBall.radius) {
          newBall.vy *= -0.8;
          newBall.y = newBall.y <= newBall.radius ? newBall.radius : courtDimensions.height - newBall.radius;
        }
        
        // Ground collision and scoring
        if (newBall.z >= 0) {
          newBall.z = 0;
          newBall.vz *= -0.7;
          
          // Check for scoring (ball stays on ground)
          if (Math.abs(newBall.vz) < 2 && Math.abs(newBall.vx) < 3 && Math.abs(newBall.vy) < 3) {
            if (newBall.x < courtDimensions.width / 2) {
              onScore('right');
            } else {
              onScore('left');
            }
            // Reset ball in center
            newBall = { 
              x: courtDimensions.width / 2, 
              y: courtDimensions.height / 2, 
              z: -50,
              vx: (Math.random() - 0.5) * 8, 
              vy: (Math.random() - 0.5) * 8, 
              vz: -5,
              radius: 15 
            };
          }
        }
        
        // Net collision (3D)
        if (Math.abs(newBall.x - courtDimensions.width / 2) < 15 && newBall.z > -80) {
          newBall.vx *= -0.8;
        }
        
        // Player collisions with 3D distance
        const checkPlayerCollision = (player: any) => {
          const dx = newBall.x - player.x;
          const dy = newBall.y - player.y;
          const dz = newBall.z - player.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < newBall.radius + 30) {
            // Calculate 3D hit angle
            const speed = Math.sqrt(newBall.vx * newBall.vx + newBall.vy * newBall.vy + newBall.vz * newBall.vz) + 3;
            const angle = Math.atan2(dy, dx);
            const verticalAngle = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy));
            
            newBall.vx = Math.cos(angle) * Math.cos(verticalAngle) * speed;
            newBall.vy = Math.sin(angle) * Math.cos(verticalAngle) * speed;
            newBall.vz = Math.sin(verticalAngle) * speed - 3; // Add upward force
            
            // Move ball away from player
            const pushDistance = newBall.radius + 30;
            newBall.x = player.x + Math.cos(angle) * pushDistance;
            newBall.y = player.y + Math.sin(angle) * pushDistance;
            newBall.z = player.z + dz / distance * pushDistance;
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
        className="relative w-full h-[600px] bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-lg shadow-2xl overflow-hidden border-4 border-white transform perspective-1000"
        style={{ maxWidth: '800px', margin: '0 auto', perspective: '1000px' }}
      >
        {/* 3D Court visualization */}
        <div className="absolute inset-0 transform-gpu">
          {/* Court lines - overhead view */}
          <div className="absolute left-0 top-0 w-full h-full">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 w-1 h-full bg-white transform -translate-x-1/2 opacity-80" />
            
            {/* Court boundary */}
            <div className="absolute inset-4 border-2 border-white rounded opacity-60" />
            
            {/* Service areas */}
            <div className="absolute left-4 top-1/4 w-1/2 h-1/2 border border-white opacity-40 transform -translate-x-4" />
            <div className="absolute right-4 top-1/4 w-1/2 h-1/2 border border-white opacity-40 transform translate-x-4" />
          </div>

          {/* 3D Net visualization */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
            <div className="w-4 h-full bg-gradient-to-b from-gray-300 to-gray-600 opacity-80" style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 12px)'
            }} />
            {/* Net posts */}
            <div className="absolute -top-2 left-0 w-4 h-4 bg-gray-700 rounded-full" />
            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Trampolines - positioned for overhead view */}
        <Trampoline x={150} y={450} />
        <Trampoline x={650} y={450} />
        <Trampoline x={150} y={150} />
        <Trampoline x={650} y={150} />
        
        {/* Players with 3D positioning */}
        <Player 
          x={players.left.x} 
          y={players.left.y - players.left.z * 0.5} // Pseudo 3D shadow effect
          color="blue" 
          isJumping={!players.left.onGround}
        />
        <Player 
          x={players.right.x} 
          y={players.right.y - players.right.z * 0.5} // Pseudo 3D shadow effect
          color="red" 
          isJumping={!players.right.onGround}
        />
        
        {/* Player shadows */}
        <div 
          className="absolute w-8 h-4 bg-black opacity-20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${players.left.x}px`, top: `${players.left.y}px` }}
        />
        <div 
          className="absolute w-8 h-4 bg-black opacity-20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${players.right.x}px`, top: `${players.right.y}px` }}
        />
        
        {/* Ball with 3D positioning and shadow */}
        <Ball x={ball.x} y={ball.y - ball.z * 0.8} />
        <div 
          className="absolute w-4 h-2 bg-black opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${ball.x}px`, top: `${ball.y}px` }}
        />
        
        {/* Updated controls hint */}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 p-2 rounded">
          Player 1: WASD (W=Jump/Forward) | Player 2: Arrows (↑=Jump/Forward)
        </div>
      </div>
    </div>
  );
};

export default GameCourt;
