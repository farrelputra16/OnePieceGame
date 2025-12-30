import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

  const handleAuth = async (type) => {
    if (!username || !password) {
      setMessage({ text: "Isi nama dan sandi bajak lautmu!", type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: type === 'login' ? "Membuka gerbang..." : "Mendaftarkan kru baru...", type: 'success' });

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type })
      });
      const data = await res.json();

      if (data.success || data.message === "User Created") {
        if (type === 'register') {
           setMessage({ text: "Registrasi berhasil! Silakan Login.", type: 'success' });
        } else {
           // Berhasil login, panggil fungsi parent
           onLoginSuccess(data.user);
        }
      } else {
        setMessage({ text: data.message || "Gagal masuk!", type: 'error' });
      }
    } catch (error) {
      setMessage({ text: "Terjadi kesalahan jaringan!", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black opacity-80 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-[url('/Background/Wano%20Background.jpeg')] bg-cover bg-center opacity-20 mix-blend-overlay blur-sm"></div>

      {/* Login Container */}
      <div 
        className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-md border-4 border-yellow-600/80 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.3)] flex flex-col items-center animate-slide-up"
        style={{ fontFamily: '"Russo One", "Orbitron", sans-serif' }}
      >
        {/* Skull Icon Header */}
        <div className="absolute -top-12 bg-black border-4 border-yellow-600 rounded-full p-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <span className="text-4xl">🏴‍☠️</span>
        </div>

        <h2 className="text-3xl text-yellow-400 font-black text-center mt-8 mb-6 tracking-widest drop-shadow-lg uppercase italic">
          Pirate&apos;s Gate
        </h2>

        {/* Pesan Feedback (Error/Sukses) */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg w-full text-center text-sm font-bold animate-bounce-short ${
            message.type === 'error' ? 'bg-red-900/50 text-red-300 border border-red-500' : 'bg-green-900/50 text-green-300 border border-green-500'
          }`}>
            {message.text}
          </div>
        )}

        <div className="w-full space-y-4">
          <div className="relative group">
            <span className="absolute left-3 top-3 text-yellow-600 group-focus-within:text-yellow-400 transition-colors">👤</span>
            <input 
              className="w-full p-3 pl-10 rounded-xl bg-black/50 text-yellow-300 border-2 border-yellow-800 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600/50 transition-all placeholder:text-gray-600" 
              placeholder="Nama Bajak Laut" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="relative group">
            <span className="absolute left-3 top-3 text-yellow-600 group-focus-within:text-yellow-400 transition-colors">🔑</span>
            <input 
              className="w-full p-3 pl-10 rounded-xl bg-black/50 text-yellow-300 border-2 border-yellow-800 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600/50 transition-all placeholder:text-gray-600" 
              type="password" 
              placeholder="Kata Sandi Rahasia" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth('login')}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-4 w-full mt-8">
          <button 
            onClick={() => handleAuth('login')} 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 p-3 rounded-xl font-black text-black uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-400 transform hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isLoading ? 'Loading...' : 'Set Sail (Login)'}
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
          </button>
          
          <button 
            onClick={() => handleAuth('register')} 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-900 to-blue-700 p-3 rounded-xl font-bold text-blue-200 uppercase tracking-wider hover:from-blue-800 hover:to-blue-600 transform hover:scale-105 active:scale-95 transition-all border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isLoading ? '...' : 'Join Crew'}
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-8 text-yellow-600/60 text-xs tracking-[0.2em]">ONE PIECE STREET FIGHT ENGINE</p>
    </div>
  );
}