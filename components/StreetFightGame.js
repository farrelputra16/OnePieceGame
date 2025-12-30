import { useEffect, useRef, useState } from 'react';
import Character from './Character';
import CharacterSelect from './CharacterSelect';

const StreetFightGame = ({ currentUser }) => {
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
  const [rewardMessage, setRewardMessage] = useState(null);
  
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const keysRef = useRef({});
  const backgroundImgRef = useRef(null);
  const timerRef = useRef(null);
  const gameOverRef = useRef(false);
  const timeLeftRef = useRef(30);

  // --- 1. FUNGSI UPDATE SCORE (Didefinisikan di atas useEffect) ---
  const processMatchResult = async (winnerName) => {
    if (!currentUser) return;

    if (winnerName === 'Player 1') {
      const isPvP = selectedCharacters?.opponentInfo != null;
      
      try {
        const res = await fetch('/api/update-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            winnerUsername: currentUser.username,
            loserUsername: isPvP ? selectedCharacters.opponentInfo.username : 'CPU',
            matchType: isPvP ? 'PVP' : 'PVE'
          })
        });
        
        const data = await res.json();
        if (data.success) {
          setRewardMessage(data.message);
        }
      } catch (err) {
        console.error("Gagal update score", err);
      }
    } else {
        setRewardMessage("DEFEATED! Train harder to become King of Pirates!");
    }
  };

  // --- 2. FUNGSI GAMBAR UI (Didefinisikan di atas useEffect) ---
  const drawSF3UI = (ctx, width, height, player1, player2, round, timeLeft) => {
    const barWidth = 400;
    const barHeight = 20;
    const barY = 20;
    const nameY = 15;
    const roundBoxSize = 30;
    const sfFont = 'bold 20px "Russo One", "Orbitron", "Arial Black", sans-serif';
    const sfFontSmall = 'bold 18px "Russo One", "Orbitron", "Arial Black", sans-serif';
    const sfFontLarge = 'bold 36px "Russo One", "Orbitron", "Arial Black", sans-serif';

    // UI Player 1
    ctx.fillStyle = '#FF00FF';
    ctx.font = sfFont;
    ctx.fillText(player1.name.toUpperCase(), 20, nameY);

    ctx.fillStyle = '#000000';
    ctx.fillRect(20, barY + 5, roundBoxSize, roundBoxSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = sfFontSmall;
    ctx.textAlign = 'center';
    ctx.fillText(round.toString(), 20 + roundBoxSize / 2, barY + 5 + roundBoxSize / 2 + 6);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#000000';
    ctx.fillRect(60, barY, barWidth, barHeight);
    const healthPercent1 = Math.max(0, player1.health / player1.maxHealth);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(60, barY, barWidth * healthPercent1, barHeight);
    if (player1.health < player1.maxHealth) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(60 + barWidth * healthPercent1, barY, barWidth * (1 - healthPercent1), barHeight);
    }
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, barY, barWidth, barHeight);

    // UI Player 2
    const p2BarX = width - 60 - barWidth;
    const p2NameX = width - 20 - ctx.measureText(player2.name.toUpperCase()).width;

    ctx.fillStyle = '#FF00FF';
    ctx.font = sfFont;
    ctx.fillText(player2.name.toUpperCase(), p2NameX, nameY);

    ctx.fillStyle = '#000000';
    ctx.fillRect(width - 20 - roundBoxSize, barY + 5, roundBoxSize, roundBoxSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = sfFontSmall;
    ctx.textAlign = 'center';
    ctx.fillText(round.toString(), width - 20 - roundBoxSize / 2, barY + 5 + roundBoxSize / 2 + 6);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#000000';
    ctx.fillRect(p2BarX, barY, barWidth, barHeight);
    const healthPercent2 = Math.max(0, player2.health / player2.maxHealth);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(p2BarX + barWidth * (1 - healthPercent2), barY, barWidth * healthPercent2, barHeight);
    if (player2.health < player2.maxHealth) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(p2BarX, barY, barWidth * (1 - healthPercent2), barHeight);
    }
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(p2BarX, barY, barWidth, barHeight);

    // Timer
    ctx.fillStyle = '#FFFF00';
    ctx.font = sfFontLarge;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const timeText = Math.max(0, Math.floor(timeLeft)).toString().padStart(2, '0');
    ctx.fillText(timeText, width / 2, 50);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  };

  // --- 3. GAME LOOP USE EFFECT ---
  useEffect(() => {
    if (!gameStarted || !selectedCharacters) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 600;

    const bgImage = new Image();
    bgImage.src = selectedBackground;
    bgImage.onload = () => {
      backgroundImgRef.current = bgImage;
    };

    const groundLevel = canvas.height - 30;
    
    // Inisialisasi Player 1 (User)
    const player1 = new Character({
      x: 200, y: groundLevel, width: 150, height: 200,
      name: selectedCharacters.player1.name,
      spritePath: selectedCharacters.player1.spritePath,
      facingRight: true, isPlayer: true, groundY: groundLevel,
      controls: { left: 'a', right: 'd', jump: 'w', kick: 'j', block: 'k' }
    });

    // Inisialisasi Player 2 (NPC)
    const player2 = new Character({
      x: 1000, y: groundLevel, width: 150, height: 200,
      name: selectedCharacters.player2.name,
      spritePath: selectedCharacters.player2.spritePath,
      facingRight: false, isPlayer: false, groundY: groundLevel,
      controls: {}
    });

    player1Ref.current = player1;
    player2Ref.current = player2;

    gameOverRef.current = false;
    timeLeftRef.current = 30;
    // setTimeLeft(30);
    // setRewardMessage(null);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Timer Logic
    timerRef.current = setInterval(() => {
      if (gameOverRef.current) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      
      if (timeLeftRef.current > 0) {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);
      }
      
      if (timeLeftRef.current <= 0) {
        if (player1Ref.current && player2Ref.current) {
          gameOverRef.current = true;
          const p1Health = player1Ref.current.health;
          const p2Health = player2Ref.current.health;
          
          let finalWinner = 'Draw';
          if (p1Health > p2Health) finalWinner = 'Player 1';
          else if (p2Health > p1Health) finalWinner = 'Player 2';
          
          setGameOver(true);
          setWinner(finalWinner);
          processMatchResult(finalWinner);
        }
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1000);

    Promise.all([player1.loadSprites(), player2.loadSprites()]).then(() => {
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

      let lastTime = 0;
      const gameLoop = (currentTime) => {
        if (gameOverRef.current) return;

        let deltaTime = currentTime - lastTime;
        if (deltaTime > 100) deltaTime = 16;
        if (lastTime === 0) deltaTime = 16;
        lastTime = currentTime;

        // Draw Canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (backgroundImgRef.current) {
          ctx.drawImage(backgroundImgRef.current, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Update & Draw Characters
        player1.update(keysRef.current, player2, deltaTime);
        player2.update({}, player1, deltaTime);

        player1.draw(ctx);
        player2.draw(ctx);
        
        // Draw UI (Sudah aman karena didefinisikan di atas)
        drawSF3UI(ctx, canvas.width, canvas.height, player1, player2, round, timeLeftRef.current);

        // Cek Menang/Kalah
        if (player2.health <= 0 && !gameOverRef.current) {
          gameOverRef.current = true;
          setGameOver(true);
          setWinner('Player 1');
          processMatchResult('Player 1');
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        } else if (player1.health <= 0 && !gameOverRef.current) {
          gameOverRef.current = true;
          setGameOver(true);
          setWinner('Player 2');
          processMatchResult('Player 2');
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoopRef.current = requestAnimationFrame(gameLoop);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    });
  }, [gameStarted, gameOver, selectedCharacters, selectedBackground, currentUser]);

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
    setRewardMessage(null);
  };

  const resetGame = () => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setGameStarted(false);
    setGameOver(false);
    setCharacterSelect(true);
  };

  if (characterSelect) {
    return <CharacterSelect onSelect={handleCharacterSelect} currentUser={currentUser} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
      <h1 className="text-4xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
        ONE PIECE STREET FIGHT <span className="text-red-600">x $LUFFY</span>
      </h1>
      
      {!gameStarted ? (
        <div className="text-center mb-4">
          <button className="px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold text-xl hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            Start Game
          </button>
          
          <div className="mt-8 text-white text-left max-w-2xl bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">CONTROLS</h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Move:</span>
                  <span className="font-bold text-white">A / D</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Attack:</span>
                  <span className="font-bold text-red-500">J</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Jump:</span>
                  <span className="font-bold text-white">W</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Block:</span>
                  <span className="font-bold text-blue-400">K</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-gray-500 italic">
              You are fighting against the CPU NPC
            </p>
          </div>
        </div>
      ) : (
        <>
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
              <div className="text-center bg-gray-900 border-2 border-yellow-500 p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] max-w-lg">
                <h2 className={`text-6xl font-black mb-2 italic ${winner === 'Player 1' ? 'text-green-400' : 'text-red-600'}`}>
                  {winner === 'Player 1' ? 'VICTORY!' : 'DEFEATED'}
                </h2>
                
                {rewardMessage && (
                  <div className="my-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg animate-pulse">
                    <p className="text-yellow-400 text-xl font-bold font-mono uppercase">
                      {rewardMessage}
                    </p>
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className="px-10 py-4 bg-red-600 text-white rounded-full font-bold text-xl hover:bg-red-500 transition-all transform hover:scale-105"
                >
                  BACK TO GRAND LINE
                </button>
              </div>
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            className="border-4 border-gray-900 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-lg"
            style={{ background: '#000000' }}
          />

          {/* Promo Bar Content (LENGKAP) */}
          <div className="mt-6 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between bg-gray-900 border border-yellow-600/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">L</div>
              <div>
                <h4 className="text-white font-bold text-sm">$LUFFY ON SOLANA</h4>
                <p className="text-gray-500 text-[10px]">9Vh33ee2iHam6WkyEKWPpnzRRy1BeJD8gA7YxV4qpump</p>
              </div>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText('9Vh33ee2iHam6WkyEKWPpnzRRy1BeJD8gA7YxV4qpump');
                alert('Contract Address Copied!');
              }}
              className="mt-3 md:mt-0 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs rounded transition-colors"
            >
              COPY CA
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StreetFightGame;