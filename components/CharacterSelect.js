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

  /* eslint-disable @next/next/no-img-element */
return (
  <div 
    className="flex flex-col items-center justify-center min-h-screen bg-black p-8 relative overflow-hidden"
    onKeyDown={handleKeyDown}
    tabIndex={0}
    style={{ 
      fontFamily: '"Russo One", "Orbitron", "Arial Black", sans-serif',
      backgroundImage: 'radial-gradient(circle, #1a365d 0%, #000000 100%)' // Background biru laut gelap
    }}
  >
    {/* Dekorasi Partikel Matahari (Luffy Sun God vibes) */}
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-700 rounded-full blur-[120px]"></div>
    </div>

    <h1 className="text-7xl font-black text-white mb-2 drop-shadow-[0_5px_15px_rgba(255,255,255,0.3)] italic tracking-tighter text-center">
      ONE PIECE <span className="text-yellow-500">STREET FIGHT</span>
    </h1>

    {/* --- PROMOSI $LUFFY COIN & SOCIALS --- */}
    <div className="w-full max-w-4xl mt-4 mb-8 relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
      <div className="relative bg-black rounded-lg p-6 text-center border border-yellow-500/50">
        <h3 className="text-4xl font-black text-yellow-400 mb-3 tracking-tighter italic">
          JOIN THE GRAND LINE WITH $LUFFY
        </h3>
        
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-900 border-2 border-yellow-500 px-6 py-3 rounded-xl flex flex-col md:flex-row items-center gap-4 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">CA:</span>
            <code className="text-yellow-400 font-bold text-sm md:text-lg break-all">
              9Vh33ee2iHam6WkyEKWPpnzRRy1BeJD8gA7YxV4qpump
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText('9Vh33ee2iHam6WkyEKWPpnzRRy1BeJD8gA7YxV4qpump');
                alert('Bounty CA Copied!');
              }}
              className="bg-yellow-500 hover:bg-white text-black px-4 py-1 rounded-full font-black transition-all transform hover:scale-110 active:scale-95 text-sm"
            >
              COPY CA
            </button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 mt-2">
            <a 
              href="https://t.me/luffyonsolanaa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#24A1DE] hover:bg-white hover:text-[#24A1DE] text-white px-6 py-2 rounded-full font-bold transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <span>TELEGRAM</span>
            </a>
            <a 
              href="https://x.com/i/communities/1997376124498690372" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full font-bold transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <span>X COMMUNITY</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Section Karakter - Dibuat Seperti Bounty Poster */}
    <div className="flex flex-col md:flex-row gap-12 mb-8 items-start justify-center w-full">
      
      {/* P1 Selection */}
      <div className="flex flex-col items-center bg-yellow-100/10 p-6 rounded-2xl border-2 border-blue-500/30 backdrop-blur-sm">
        <h2 className={`text-2xl font-black mb-4 tracking-widest ${player1Confirmed ? 'text-green-400 animate-bounce' : 'text-blue-400'}`}>
          {player1Confirmed ? '🏴‍☠️ PLAYER READY' : 'CHOOSE YOUR CAPTAIN'}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {CHARACTERS.map((char, index) => (
            <div
              key={char.name}
              onClick={() => !player1Confirmed && setPlayer1Selection(index)}
              className={`group relative cursor-pointer transition-all duration-300 ${
                player1Selection === index ? 'scale-110' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className={`w-28 h-36 rounded-md border-4 flex flex-col items-center justify-between p-2 overflow-hidden ${
                player1Selection === index ? 'border-yellow-500 bg-[#e3d5b8]' : 'border-gray-700 bg-gray-800'
              }`}>
                <span className={`text-[10px] font-bold ${player1Selection === index ? 'text-black' : 'text-white'}`}>WANTED</span>
                <div className="h-20 w-full bg-black rounded overflow-hidden">
                  <img src={`${char.spritePath}/Running/${char.name} 1.png`} alt={char.name} className="w-full h-full object-contain group-hover:scale-125 transition-transform" />
                </div>
                <span className={`text-xs font-black ${player1Selection === index ? 'text-red-700' : 'text-white'}`}>{char.name.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center self-center">
        <div className="text-6xl font-black text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] italic">VS</div>
      </div>

      {/* CPU Selection */}
      <div className="flex flex-col items-center bg-red-900/10 p-6 rounded-2xl border-2 border-red-500/30 backdrop-blur-sm">
        <h2 className={`text-2xl font-black mb-4 tracking-widest ${player2Confirmed ? 'text-green-400' : 'text-red-500'}`}>
          {player2Confirmed ? '💀 TARGET LOCKED' : 'SELECT TARGET'}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {CHARACTERS.map((char, index) => (
            <div
              key={char.name}
              onClick={() => !player2Confirmed && setPlayer2Selection(index)}
              className={`group relative cursor-pointer transition-all duration-300 ${
                player2Selection === index ? 'scale-110' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className={`w-28 h-36 rounded-md border-4 flex flex-col items-center justify-between p-2 overflow-hidden ${
                player2Selection === index ? 'border-red-600 bg-[#e3d5b8]' : 'border-gray-700 bg-gray-800'
              }`}>
                <span className={`text-[10px] font-bold ${player2Selection === index ? 'text-black' : 'text-white'}`}>DEAD OR ALIVE</span>
                <div className="h-20 w-full bg-black rounded overflow-hidden">
                  <img src={`${char.spritePath}/Running/${char.name} 1.png`} alt={char.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0" />
                </div>
                <span className={`text-xs font-black ${player2Selection === index ? 'text-red-700' : 'text-white'}`}>{char.name.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Stage Selection - Lebih Visual */}
    <div className="mt-4 w-full max-w-2xl bg-black/40 p-4 rounded-xl border border-white/10">
      <h3 className="text-center text-white font-bold mb-4 tracking-widest">CHOOSE BATTLEFIELD</h3>
      <div className="flex gap-4 justify-center">
        {BACKGROUNDS.map((bg, index) => (
          <div 
            key={bg.name} 
            onClick={() => setBackgroundSelection(index)} 
            className={`cursor-pointer group relative w-32 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              backgroundSelection === index ? 'border-yellow-400 scale-110 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'border-gray-600 opacity-60'
            }`}
          >
            <img src={bg.path} alt={bg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white text-center px-1 uppercase">{bg.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Game Start Button */}
    {player1Confirmed && player2Confirmed && (
      <div className="mt-12 animate-in fade-in zoom-in duration-500">
        <button
          onClick={handleStart}
          className="relative px-16 py-5 bg-red-600 text-white font-black text-3xl rounded-full hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] group overflow-hidden"
        >
          <span className="relative z-10">SET SAIL! (SPACE)</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>
      </div>
    )}

    {/* Footer Link Footer */}
    <div className="mt-12 text-gray-500 text-[10px] tracking-[0.3em] uppercase">
      Luffy Street Fight Engine &bull; Powered by $LUFFY
    </div>
  </div>
);
};

export default CharacterSelect;

