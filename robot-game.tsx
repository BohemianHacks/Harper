import React, { useState, useEffect } from 'react';

const Game = () => {
  const [position, setPosition] = useState(50);
  const [jumping, setJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize stars
  useEffect(() => {
    if (gameStarted) {
      setStars([
        { id: 1, x: Math.random() * 80 + 10, y: Math.random() * 40 + 10 },
        { id: 2, x: Math.random() * 80 + 10, y: Math.random() * 40 + 10 },
        { id: 3, x: Math.random() * 80 + 10, y: Math.random() * 40 + 10 }
      ]);
    }
  }, [gameStarted]);

  // Handle key presses
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && position > 0) {
        setPosition(p => Math.max(0, p - 5));
      }
      if (e.key === 'ArrowRight' && position < 90) {
        setPosition(p => Math.min(90, p + 5));
      }
      if (e.key === ' ' && !jumping) {
        setJumping(true);
        setTimeout(() => setJumping(false), 500);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [position, jumping, gameStarted]);

  // Check for star collection
  useEffect(() => {
    if (!gameStarted) return;

    const newStars = stars.filter(star => {
      const collected = 
        Math.abs(star.x - position) < 10 && 
        (jumping ? Math.abs(star.y - 30) < 20 : Math.abs(star.y - 70) < 10);
      
      if (collected) {
        setScore(s => s + 1);
        return false;
      }
      return true;
    });

    if (newStars.length < stars.length) {
      setStars([...newStars, {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 10
      }]);
    }
  }, [position, jumping, stars, gameStarted]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-900 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-500 mb-4">Robot Star Collector</h1>
        <p className="text-white mb-4">Use arrow keys to move, spacebar to jump!</p>
        <button 
          onClick={() => setGameStarted(true)}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 text-white text-xl">
        Score: {score}
      </div>
      
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute w-6 h-6 text-yellow-400"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
        >
          ⭐
        </div>
      ))}

      {/* Robot */}
      <div
        className={`absolute w-12 h-12 transition-all duration-200 text-4xl`}
        style={{
          left: `${position}%`,
          bottom: jumping ? '60%' : '20%',
          transform: 'translateX(-50%)',
        }}
      >
        🤖
      </div>
    </div>
  );
};

export default Game;
