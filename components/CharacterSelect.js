/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';

const CHARACTERS = [
  { name: 'Luffy', spritePath: '/Sprites/Luffy', color: '#FF6B6B' },
  { name: 'Sanji', spritePath: '/Sprites/Sanji', color: '#4ECDC4' },
  { name: 'Zoro', spritePath: '/Sprites/Zoro', color: '#95E1D3' }
];

const BACKGROUNDS = [
  { name: 'Default', path: '/Background/Default Background.jpeg' },
  { name: 'Dressrosa', path: '/Background/Dressrosa Background.jpeg' },
  { name: 'Marineford', path: '/Background/Marineford Background.jpeg' },
  { name: 'Wano', path: '/Background/Wano Background.jpeg' }
];

const CharacterSelect = ({ onSelect, currentUser }) => { // Menerima prop currentUser
  const [player1Selection, setPlayer1Selection] = useState(0);
  const [player2Selection, setPlayer2Selection] = useState(1);
  const [backgroundSelection, setBackgroundSelection] = useState(0);
  const [player1Confirmed, setPlayer1Confirmed] = useState(false);
  
  // State untuk Online Mode
  const [leaderboard, setLeaderboard] = useState([]);
  const [targetOpponent, setTargetOpponent] = useState(null); // Menyimpan data musuh yang dipilih

  // Fetch Leaderboard saat masuk menu
  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => {
        // Filter agar tidak menantang diri sendiri
        const enemies = data.filter(p => p.username !== currentUser?.username);
        setLeaderboard(enemies);
      });
  }, [currentUser]);

  // Fungsi saat memilih musuh dari Leaderboard
  const handleChallenge = (enemy) => {
    setTargetOpponent(enemy);
    
    // Cari index karakter favorit musuh (default ke 0 jika tidak ketemu)
    const charIndex = CHARACTERS.findIndex(c => c.name === enemy.favoriteChar);
    setPlayer2Selection(charIndex !== -1 ? charIndex : 1);
    
    alert(`TARGET LOCKED: ${enemy.username}! \nReward: Steal their Berries!`);
  };

  const handleStart = () => {
    if (player1Confirmed) {
      onSelect({
        player1: CHARACTERS[player1Selection],
        player2: CHARACTERS[player2Selection],
        opponentInfo: targetOpponent // Kirim data musuh ke game logic untuk update score nanti
      }, BACKGROUNDS[backgroundSelection].path);
    }
  };

  // Keyboard controls (disederhanakan untuk Player 1 saja)
  const handleKeyDown = (e) => {
    if (player1Confirmed) {
        if (e.key === ' ') handleStart();
        return;
    }
    if (e.key === 'a' || e.key === 'A') setPlayer1Selection((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
    if (e.key === 'd' || e.key === 'D') setPlayer1Selection((prev) => (prev + 1) % CHARACTERS.length);
    if (e.key === 'j' || e.key === 'J') setPlayer1Confirmed(true);
  };

  return (
    <div 
      className="flex flex-col items-center min-h-screen bg-black p-4 relative overflow-hidden font-sans"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ fontFamily: '"Russo One", sans-serif', backgroundImage: 'radial-gradient(circle, #1a365d 0%, #000000 100%)' }}
    >
      {/* --- HEADER: USER STATS (LOGIN INFO) --- */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4 animate-slide-in-right">
        <div className="bg-gray-900/90 border-2 border-yellow-500 rounded-xl p-3 flex items-center gap-4 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black border-2 border-white">
            {currentUser?.username?.charAt(0).toUpperCase() || "P"}
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">{currentUser?.username || "Guest"}</span>
            <span className="text-white text-xs font-mono">💰 {currentUser?.berries?.toLocaleString() || 0} Berries</span>
            <span className="text-red-400 text-[10px] font-bold">BOUNTY: {currentUser?.bounty?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg text-center mt-12">
        GRAND LINE <span className="text-yellow-500">ARENA</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl items-start justify-center">
        
        {/* --- KIRI: CHARACTER SELECT (PLAYER) --- */}
        <div className="flex-1 flex flex-col items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm w-full">
            <h2 className="text-2xl text-blue-400 font-black mb-6 tracking-widest">
                {player1Confirmed ? "READY TO SAIL!" : "SELECT YOUR FIGHTER"}
            </h2>
            
            {/* Carousel Karakter */}
            <div className="relative w-64 h-80 mb-6">
                <div className={`w-full h-full border-8 transition-all duration-300 rounded-lg overflow-hidden relative flex items-center justify-center bg-gray-800 ${player1Confirmed ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : 'border-blue-500'}`}>
                    <img 
                        src={`${CHARACTERS[player1Selection].spritePath}/Running/${CHARACTERS[player1Selection].name} 1.png`} 
                        className="w-48 h-48 object-contain"
                        alt="Char"
                    />
                    <div className="absolute bottom-0 w-full bg-black/80 text-center py-2">
                        <span className="text-xl text-white font-bold uppercase">{CHARACTERS[player1Selection].name}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <button onClick={() => !player1Confirmed && setPlayer1Selection((p) => (p - 1 + 3) % 3)} className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">⬅️</button>
                <button 
                    onClick={() => setPlayer1Confirmed(true)} 
                    className={`px-8 py-3 rounded-full font-bold transition-all ${player1Confirmed ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}
                >
                    {player1Confirmed ? "CONFIRMED" : "CONFIRM (J)"}
                </button>
                <button onClick={() => !player1Confirmed && setPlayer1Selection((p) => (p + 1) % 3)} className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">➡️</button>
            </div>
            
            <div className="w-full mt-4">
                <h3 className="text-center text-gray-400 text-sm mb-2">SELECT STAGE</h3>
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                    {BACKGROUNDS.map((bg, index) => (
                        <div key={bg.name} onClick={() => setBackgroundSelection(index)} className={`w-16 h-10 flex-shrink-0 border-2 cursor-pointer ${backgroundSelection === index ? 'border-yellow-400' : 'border-gray-600'}`}>
                            <img src={bg.path} className="w-full h-full object-cover" alt={bg.name} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- TENGAH: VS --- */}
        <div className="hidden lg:flex flex-col items-center justify-center pt-20">
            <span className="text-6xl font-black text-red-600 italic animate-pulse">VS</span>
        </div>

        {/* --- KANAN: BOUNTY BOARD (ONLINE PVP) --- */}
        <div className="flex-1 w-full bg-yellow-900/20 border-2 border-yellow-600/30 p-0 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="bg-yellow-600/20 p-4 border-b border-yellow-600/30 flex justify-between items-center">
                <h2 className="text-xl text-yellow-500 font-black tracking-widest">WANTED BOARD</h2>
                <span className="text-xs text-gray-400 animate-pulse">● LIVE</span>
            </div>
            
            <div className="h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {/* List Pemain */}
                {leaderboard.map((enemy, idx) => (
                    <div 
                        key={idx} 
                        className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                            targetOpponent?.username === enemy.username 
                            ? 'bg-red-900/50 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                            : 'bg-black/40 border-gray-700 hover:border-yellow-500/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`text-lg font-bold w-6 ${idx < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>#{idx + 1}</span>
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase">{enemy.username}</h4>
                                <span className="text-[10px] text-gray-400">Main: {enemy.favoriteChar || "Random"}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-yellow-400 font-mono text-xs font-bold">฿ {enemy.bounty?.toLocaleString() || 0}</span>
                            <button 
                                onClick={() => handleChallenge(enemy)}
                                className={`px-3 py-1 text-[10px] font-bold rounded uppercase transition-all ${
                                    targetOpponent?.username === enemy.username 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 group-hover:bg-yellow-500 group-hover:text-black'
                                }`}
                            >
                                {targetOpponent?.username === enemy.username ? 'LOCKED' : 'HUNT'}
                            </button>
                        </div>
                    </div>
                ))}
                
                {leaderboard.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No pirates found nearby...</div>
                )}
            </div>

            {/* Target Info */}
            <div className="p-4 bg-black/40 border-t border-yellow-600/30 text-center">
                {targetOpponent ? (
                    <div className="animate-bounce">
                        <span className="text-gray-400 text-xs">TARGET: </span>
                        <span className="text-red-500 font-bold">{targetOpponent.username}</span>
                    </div>
                ) : (
                    <span className="text-gray-500 text-xs italic">Select a pirate from the list to steal their berries</span>
                )}
            </div>
        </div>

      </div>

      {/* --- START BUTTON --- */}
      {player1Confirmed && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
             <button
                onClick={handleStart}
                className="px-16 py-4 bg-red-600 text-white font-black text-2xl rounded-full hover:bg-red-500 transition-all shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-pulse"
            >
                {targetOpponent ? "FIGHT FOR BOUNTY!" : "PRACTICE MODE"}
            </button>
        </div>
      )}
    </div>
  );
};

export default CharacterSelect;