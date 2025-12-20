import { useEffect, useRef, useState } from 'react';
import Character from './Character';
import CharacterSelect from './CharacterSelect';

const StreetFightGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [characterSelect, setCharacterSelect] = useState(true);
  const [selectedCharacters, setSelectedCharacters] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedBackground, setSelectedBackground] = useState('/Background/Default Background.jpeg');
  
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const keysRef = useRef({});
  const backgroundImgRef = useRef(null);
  const timerRef = useRef(null);
  const gameOverRef = useRef(false);
  const timeLeftRef = useRef(30);

  useEffect(() => {
    if (!gameStarted || !selectedCharacters) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 600;

    // Load background image
    const bgImage = new Image();
    bgImage.src = selectedBackground;
    bgImage.onload = () => {
      backgroundImgRef.current = bgImage;
    };

    // Initialize characters at bottom of screen with selected characters
    const groundLevel = canvas.height - 30; // 30 pixels from bottom for ground
    const player1 = new Character({
      x: 200,
      y: groundLevel,
      width: 150,
      height: 200,
      name: selectedCharacters.player1.name,
      spritePath: selectedCharacters.player1.spritePath,
      facingRight: true,
      isPlayer: true,
      groundY: groundLevel,
      controls: {
        left: 'a',
        right: 'd',
        jump: 'w',
        kick: 'j',
        block: 'k'
      }
    });

    const player2 = new Character({
      x: 1000,
      y: groundLevel,
      width: 150,
      height: 200,
      name: selectedCharacters.player2.name,
      spritePath: selectedCharacters.player2.spritePath,
      facingRight: false,
      isPlayer: true,
      groundY: groundLevel,
      controls: {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        jump: 'ArrowUp',
        kick: 'Enter',
        block: 'Shift'
      }
    });

    player1Ref.current = player1;
    player2Ref.current = player2;

    // Start timer countdown (30 seconds)
    gameOverRef.current = false;
    timeLeftRef.current = 30;
    setTimeLeft(30);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Start the timer immediately
    timerRef.current = setInterval(() => {
      // Stop if already game over
      if (gameOverRef.current) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }
      
      // Decrement timer
      if (timeLeftRef.current > 0) {
        timeLeftRef.current = timeLeftRef.current - 1;
        setTimeLeft(timeLeftRef.current);
      }
      
      if (timeLeftRef.current <= 0) {
        // Time's up - determine winner by health (whoever has more health wins)
        if (player1Ref.current && player2Ref.current) {
          gameOverRef.current = true;
          const p1Health = player1Ref.current.health;
          const p2Health = player2Ref.current.health;
          if (p1Health > p2Health) {
            setGameOver(true);
            setWinner('Player 1');
          } else if (p2Health > p1Health) {
            setGameOver(true);
            setWinner('Player 2');
          } else {
            setGameOver(true);
            setWinner('Draw');
          }
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }
    }, 1000);

    // Load sprites
    Promise.all([player1.loadSprites(), player2.loadSprites()]).then(() => {
      // Keyboard event handlers
      const handleKeyDown = (e) => {
        keysRef.current[e.key.toLowerCase()] = true;
        keysRef.current[e.code] = true;
      };

      const handleKeyUp = (e) => {
        keysRef.current[e.key.toLowerCase()] = false;
        keysRef.current[e.code] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Game loop
      let lastTime = 0;
      const gameLoop = (currentTime) => {
        // Stop if game is over
        if (gameOverRef.current) {
          return;
        }

        let deltaTime = currentTime - lastTime;
        // Cap deltaTime to prevent issues when tab is inactive
        if (deltaTime > 100) deltaTime = 16; // ~60fps
        if (lastTime === 0) deltaTime = 16; // First frame
        lastTime = currentTime;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw background image
        if (backgroundImgRef.current) {
          ctx.drawImage(backgroundImgRef.current, 0, 0, canvas.width, canvas.height);
        } else {
          // Fallback background
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw ground platform (if needed, can be part of background)
        // The background image should include the ground

        // Update and draw characters
        player1.update(keysRef.current, player2, deltaTime);
        player2.update(keysRef.current, player1, deltaTime);

        player1.draw(ctx);
        player2.draw(ctx);

        // Draw Street Fighter III style UI (use ref for real-time value)
        drawSF3UI(ctx, canvas.width, canvas.height, player1, player2, round, timeLeftRef.current);

        // Check for game over by health
        if (player1.health <= 0 && !gameOverRef.current) {
          gameOverRef.current = true;
          setGameOver(true);
          setWinner('Player 2');
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        } else if (player2.health <= 0 && !gameOverRef.current) {
          gameOverRef.current = true;
          setGameOver(true);
          setWinner('Player 1');
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }

        // Check if timer reached 0 (double-check in case interval missed it)
        if (timeLeftRef.current <= 0 && !gameOverRef.current) {
          const p1Health = player1.health;
          const p2Health = player2.health;
          gameOverRef.current = true;
          if (p1Health > p2Health) {
            setGameOver(true);
            setWinner('Player 1');
          } else if (p2Health > p1Health) {
            setGameOver(true);
            setWinner('Player 2');
          } else {
            setGameOver(true);
            setWinner('Draw');
          }
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }

        // Continue game loop
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoopRef.current = requestAnimationFrame(gameLoop);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    });
  }, [gameStarted, gameOver, selectedCharacters, selectedBackground]);

  const drawSF3UI = (ctx, width, height, player1, player2, round, timeLeft) => {
    const barWidth = 400;
    const barHeight = 20;
    const barY = 20;
    const nameY = 15;
    const roundBoxSize = 30;

    // Set Street Fighter style font
    const sfFont = 'bold 20px "Russo One", "Orbitron", "Arial Black", sans-serif';
    const sfFontSmall = 'bold 18px "Russo One", "Orbitron", "Arial Black", sans-serif';
    const sfFontLarge = 'bold 36px "Russo One", "Orbitron", "Arial Black", sans-serif';

    // Player 1 UI (Left side)
    // Character name
    ctx.fillStyle = '#FF00FF'; // Purple/magenta like SF3
    ctx.font = sfFont;
    ctx.fillText(player1.name.toUpperCase(), 20, nameY);

    // Round indicator box
    ctx.fillStyle = '#000000';
    ctx.fillRect(20, barY + 5, roundBoxSize, roundBoxSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = sfFontSmall;
    ctx.textAlign = 'center';
    ctx.fillText(round.toString(), 20 + roundBoxSize / 2, barY + 5 + roundBoxSize / 2 + 6);
    ctx.textAlign = 'left';

    // Health bar background (dark)
    ctx.fillStyle = '#000000';
    ctx.fillRect(60, barY, barWidth, barHeight);

    // Health bar (green)
    const healthPercent1 = Math.max(0, player1.health / player1.maxHealth);
    ctx.fillStyle = '#00FF00'; // Green
    ctx.fillRect(60, barY, barWidth * healthPercent1, barHeight);

    // Damage indicator (red overlay for lost health)
    if (player1.health < player1.maxHealth) {
      ctx.fillStyle = '#FF0000'; // Red
      ctx.fillRect(60 + barWidth * healthPercent1, barY, barWidth * (1 - healthPercent1), barHeight);
    }

    // Health bar border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, barY, barWidth, barHeight);

    // Player 2 UI (Right side)
    const p2BarX = width - 60 - barWidth;
    const p2NameX = width - 20 - ctx.measureText(player2.name.toUpperCase()).width;

    // Character name
    ctx.fillStyle = '#FF00FF'; // Purple/magenta like SF3
    ctx.font = sfFont;
    ctx.fillText(player2.name.toUpperCase(), p2NameX, nameY);

    // Round indicator box
    ctx.fillStyle = '#000000';
    ctx.fillRect(width - 20 - roundBoxSize, barY + 5, roundBoxSize, roundBoxSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = sfFontSmall;
    ctx.textAlign = 'center';
    ctx.fillText(round.toString(), width - 20 - roundBoxSize / 2, barY + 5 + roundBoxSize / 2 + 6);
    ctx.textAlign = 'left';

    // Health bar background (dark)
    ctx.fillStyle = '#000000';
    ctx.fillRect(p2BarX, barY, barWidth, barHeight);

    // Health bar (green) - right aligned
    const healthPercent2 = Math.max(0, player2.health / player2.maxHealth);
    ctx.fillStyle = '#00FF00'; // Green
    ctx.fillRect(p2BarX + barWidth * (1 - healthPercent2), barY, barWidth * healthPercent2, barHeight);

    // Damage indicator (red overlay for lost health)
    if (player2.health < player2.maxHealth) {
      ctx.fillStyle = '#FF0000'; // Red
      ctx.fillRect(p2BarX, barY, barWidth * (1 - healthPercent2), barHeight);
    }

    // Health bar border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(p2BarX, barY, barWidth, barHeight);

    // Timer (center top)
    ctx.fillStyle = '#FFFF00'; // Yellow
    ctx.font = sfFontLarge;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const timeText = Math.max(0, Math.floor(timeLeft)).toString().padStart(2, '0');
    ctx.fillText(timeText, width / 2, 50);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  };

  const handleCharacterSelect = (characters, background) => {
    setSelectedCharacters(characters);
    setSelectedBackground(background);
    setCharacterSelect(false);
    setGameStarted(true);
    setGameOver(false);
    gameOverRef.current = false;
    timeLeftRef.current = 30;
    setWinner(null);
    setRound(1);
    setTimeLeft(30);
  };

  const resetGame = () => {
    // Stop game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset game over ref
    gameOverRef.current = false;
    timeLeftRef.current = 30;
    
    // Reset all state
    setGameStarted(false);
    setGameOver(false);
    setWinner(null);
    setRound(1);
    setTimeLeft(30);
    setCharacterSelect(true);
    setSelectedCharacters(null);
    setSelectedBackground('/Background/Default Background.jpeg');
    
    // Clear refs
    player1Ref.current = null;
    player2Ref.current = null;
    backgroundImgRef.current = null;
    keysRef.current = {};
  };

  if (characterSelect) {
    return <CharacterSelect onSelect={handleCharacterSelect} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
      <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>One Piece Street Fight</h1>
      
      {!gameStarted ? (
        <div className="text-center mb-4">
          <button
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-xl hover:bg-blue-700 transition-colors"
            style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}
          >
            Start Game
          </button>
          <div className="mt-8 text-white text-left max-w-2xl">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>Controls:</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>Player 1:</h3>
                <ul className="space-y-1">
                  <li><strong>A</strong> - Move Left</li>
                  <li><strong>D</strong> - Move Right</li>
                  <li><strong>W</strong> - Jump</li>
                  <li><strong>J</strong> - Kick</li>
                  <li><strong>K</strong> - Block</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>Player 2:</h3>
                <ul className="space-y-1">
                  <li><strong>←</strong> - Move Left</li>
                  <li><strong>→</strong> - Move Right</li>
                  <li><strong>↑</strong> - Jump</li>
                  <li><strong>Enter</strong> - Kick</li>
                  <li><strong>Shift</strong> - Block</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
              <div className="text-center bg-gray-800 p-8 rounded-lg">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {winner} Wins!
                </h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-800 shadow-2xl"
            style={{ background: '#000000' }}
          />
        </>
      )}
    </div>
  );
};

export default StreetFightGame;

