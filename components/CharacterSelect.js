import { useState } from 'react';

const CHARACTERS = [
  {
    name: 'Luffy',
    spritePath: '/Sprites/Luffy',
    color: '#FF6B6B'
  },
  {
    name: 'Sanji',
    spritePath: '/Sprites/Sanji',
    color: '#4ECDC4'
  },
  {
    name: 'Zoro',
    spritePath: '/Sprites/Zoro',
    color: '#95E1D3'
  }
];

const BACKGROUNDS = [
  { name: 'Default', path: '/Background/Default Background.jpeg' },
  { name: 'Dressrosa', path: '/Background/Dressrosa Background.jpeg' },
  { name: 'Marineford', path: '/Background/Marineford Background.jpeg' },
  { name: 'Wano', path: '/Background/Wano Background.jpeg' }
];

const CharacterSelect = ({ onSelect }) => {
  const [player1Selection, setPlayer1Selection] = useState(0);
  const [player2Selection, setPlayer2Selection] = useState(1);
  const [player1Confirmed, setPlayer1Confirmed] = useState(false);
  const [player2Confirmed, setPlayer2Confirmed] = useState(false);
  const [backgroundSelection, setBackgroundSelection] = useState(0);

  const handlePlayer1Move = (direction) => {
    if (player1Confirmed) return;
    if (direction === 'left') {
      setPlayer1Selection((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
    } else {
      setPlayer1Selection((prev) => (prev + 1) % CHARACTERS.length);
    }
  };

  const handlePlayer2Move = (direction) => {
    if (player2Confirmed) return;
    if (direction === 'left') {
      setPlayer2Selection((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
    } else {
      setPlayer2Selection((prev) => (prev + 1) % CHARACTERS.length);
    }
  };

  const handlePlayer1Confirm = () => {
    if (!player1Confirmed) {
      setPlayer1Confirmed(true);
    }
  };

  const handlePlayer2Confirm = () => {
    if (!player2Confirmed) {
      setPlayer2Confirmed(true);
    }
  };

  const handleStart = () => {
    if (player1Confirmed && player2Confirmed) {
      onSelect({
        player1: CHARACTERS[player1Selection],
        player2: CHARACTERS[player2Selection]
      }, BACKGROUNDS[backgroundSelection].path);
    }
  };

  // Keyboard controls
  const handleKeyDown = (e) => {
    if (e.key === 'a' || e.key === 'A') {
      handlePlayer1Move('left');
    } else if (e.key === 'd' || e.key === 'D') {
      handlePlayer1Move('right');
    } else if (e.key === 'j' || e.key === 'J') {
      handlePlayer1Confirm();
    } else if (e.key === 'ArrowLeft') {
      handlePlayer2Move('left');
    } else if (e.key === 'ArrowRight') {
      handlePlayer2Move('right');
    } else if (e.key === 'Enter') {
      handlePlayer2Confirm();
    } else if (e.key === ' ') {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-black p-8"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}
    >
      <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-2xl" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
        ONE PIECE STREET FIGHT
      </h1>
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 drop-shadow-lg" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
        CHARACTER SELECT
      </h2>

      {/* Game Rules */}
      <div className="mb-8 w-full max-w-4xl bg-black bg-opacity-60 border-4 border-yellow-400 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
          GAME RULES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
              OBJECTIVE
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• Reduce opponent's health to 0, OR</li>
              <li>• Have more health when the 30-second timer runs out</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
              TIMER
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• Each round lasts 30 seconds</li>
              <li>• If time runs out, player with more health wins</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
              PLAYER 1 CONTROLS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <span className="text-yellow-400 font-bold">A</span> - Move Left</li>
              <li>• <span className="text-yellow-400 font-bold">D</span> - Move Right</li>
              <li>• <span className="text-yellow-400 font-bold">W</span> - Jump</li>
              <li>• <span className="text-yellow-400 font-bold">J</span> - Attack</li>
              <li>• <span className="text-yellow-400 font-bold">K</span> - Block</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
              PLAYER 2 CONTROLS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <span className="text-yellow-400 font-bold">←</span> - Move Left</li>
              <li>• <span className="text-yellow-400 font-bold">→</span> - Move Right</li>
              <li>• <span className="text-yellow-400 font-bold">↑</span> - Jump</li>
              <li>• <span className="text-yellow-400 font-bold">Enter</span> - Attack</li>
              <li>• <span className="text-yellow-400 font-bold">Shift</span> - Block</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-yellow-400">
          <h4 className="text-xl font-bold text-yellow-400 mb-2 text-center" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
            TIPS
          </h4>
          <ul className="text-sm text-white space-y-1 text-center">
            <li>• Blocking reduces damage taken</li>
            <li>• Time your attacks carefully</li>
            <li>• Use jumping to dodge attacks</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-16 mb-8">
        {/* Player 1 Selection */}
        <div className="flex flex-col items-center">
          <div className={`text-2xl font-bold mb-4 ${player1Confirmed ? 'text-green-400' : 'text-blue-400'}`}>
            {player1Confirmed ? '✓ PLAYER 1' : 'PLAYER 1'}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {CHARACTERS.map((char, index) => (
              <div
                key={char.name}
                onClick={() => !player1Confirmed && setPlayer1Selection(index)}
                className={`relative cursor-pointer transition-all duration-200 ${
                  player1Selection === index
                    ? 'scale-110 transform'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-32 h-40 rounded-lg border-4 p-2 ${
                    player1Selection === index
                      ? player1Confirmed
                        ? 'border-green-400 bg-green-900 bg-opacity-50'
                        : 'border-blue-400 bg-blue-900 bg-opacity-50'
                      : 'border-gray-600 bg-gray-800 bg-opacity-50'
                  }`}
                >
                  <div className="text-center text-white font-bold text-sm mb-2">
                    {char.name}
                  </div>
                  <div className="flex items-center justify-center h-28 bg-black rounded">
                    <img
                      src={`${char.spritePath}/Running/${char.name} 1.png`}
                      alt={char.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                {player1Selection === index && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1P</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-white text-sm text-center">
            {player1Confirmed ? (
              <span className="text-green-400 font-bold">CONFIRMED!</span>
            ) : (
              <>
                <div>A/D - Move | J - Confirm</div>
              </>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center">
          <div className="text-5xl font-bold text-yellow-400 drop-shadow-lg">VS</div>
        </div>

        {/* Player 2 Selection */}
        <div className="flex flex-col items-center">
          <div className={`text-2xl font-bold mb-4 ${player2Confirmed ? 'text-green-400' : 'text-red-400'}`}>
            {player2Confirmed ? '✓ PLAYER 2' : 'PLAYER 2'}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {CHARACTERS.map((char, index) => (
              <div
                key={char.name}
                onClick={() => !player2Confirmed && setPlayer2Selection(index)}
                className={`relative cursor-pointer transition-all duration-200 ${
                  player2Selection === index
                    ? 'scale-110 transform'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-32 h-40 rounded-lg border-4 p-2 ${
                    player2Selection === index
                      ? player2Confirmed
                        ? 'border-green-400 bg-green-900 bg-opacity-50'
                        : 'border-red-400 bg-red-900 bg-opacity-50'
                      : 'border-gray-600 bg-gray-800 bg-opacity-50'
                  }`}
                >
                  <div className="text-center text-white font-bold text-sm mb-2">
                    {char.name}
                  </div>
                  <div className="flex items-center justify-center h-28 bg-black rounded">
                    <img
                      src={`${char.spritePath}/Running/${char.name} 1.png`}
                      alt={char.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                {player2Selection === index && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2P</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-white text-sm text-center">
            {player2Confirmed ? (
              <span className="text-green-400 font-bold">CONFIRMED!</span>
            ) : (
              <>
                <div>← → - Move | Enter - Confirm</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Background Selection */}
      <div className="mt-8 mb-4">
        <h3 className="text-xl font-bold text-white mb-4 text-center" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
          SELECT BACKGROUND
        </h3>
        <div className="flex gap-4 justify-center">
          {BACKGROUNDS.map((bg, index) => (
            <div
              key={bg.name}
              onClick={() => setBackgroundSelection(index)}
              className={`cursor-pointer transition-all duration-200 ${
                backgroundSelection === index
                  ? 'scale-110 transform'
                  : 'opacity-60 hover:opacity-80'
              }`}
            >
              <div
                className={`w-32 h-20 rounded-lg border-4 overflow-hidden ${
                  backgroundSelection === index
                    ? 'border-yellow-400 bg-yellow-900 bg-opacity-50'
                    : 'border-gray-600 bg-gray-800 bg-opacity-50'
                }`}
              >
                <img
                  src={bg.path}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="text-center text-white font-bold text-xs mt-1" style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}>
                  {bg.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {player1Confirmed && player2Confirmed && (
        <div className="mt-8">
          <button
            onClick={handleStart}
            className="px-12 py-4 bg-yellow-500 text-black font-bold text-2xl rounded-lg hover:bg-yellow-400 transition-colors shadow-2xl animate-pulse"
            style={{ fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif' }}
          >
            PRESS SPACE TO START
          </button>
        </div>
      )}

      <div className="mt-8 text-white text-center text-sm opacity-75">
        {!player1Confirmed && <div>Player 1: Select your character and press J to confirm</div>}
        {player1Confirmed && !player2Confirmed && <div>Player 2: Select your character and press Enter to confirm</div>}
        {player1Confirmed && player2Confirmed && <div>Both players ready! Press SPACE to start the fight!</div>}
      </div>
    </div>
  );
};

export default CharacterSelect;

