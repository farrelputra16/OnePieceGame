import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleAuth = async (type) => {
    if (!username || !password) {
      setMessage({ text: "Please enter your Crew Name & Key!", type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: type === 'login' ? "Opening the Gate..." : "Recruiting...", type: 'success' });

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type })
      });
      const data = await res.json();

      if (data.success || data.message === "User Created") {
        if (type === 'register') {
           setMessage({ text: "Registration Successful! Please Login.", type: 'success' });
        } else {
           onLoginSuccess(data.user);
        }
      } else {
        setMessage({ text: data.message || "Access Denied!", type: 'error' });
      }
    } catch (error) {
      setMessage({ text: "Connection Failed!", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0a0a0a] relative font-sans overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0505] to-black opacity-90"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[#111] border border-[#333] rounded-xl shadow-[0_0_60px_rgba(211,47,47,0.15)] flex flex-col items-center">
        
        {/* Logo / Icon */}
        <div className="mb-6 p-4 bg-black rounded-full border-2 border-yellow-600 shadow-lg transform -translate-y-12">
            <span className="text-5xl">🏴‍☠️</span>
        </div>

        <h2 className="text-4xl text-white font-black text-center mb-2 tracking-widest uppercase" style={{ fontFamily: "'Bangers', cursive" }}>
          PIRATE <span className="text-red-600">GATE</span>
        </h2>
        <p className="text-gray-500 text-xs tracking-[0.4em] mb-8 uppercase font-bold">Luffy Protocol Access</p>

        {/* Message Box */}
        {message.text && (
          <div className={`mb-6 p-3 rounded w-full text-center text-xs font-bold uppercase tracking-wide border ${
            message.type === 'error' ? 'bg-red-900/20 text-red-500 border-red-900' : 'bg-green-900/20 text-green-500 border-green-900'
          }`}>
            {message.text}
          </div>
        )}

        {/* Input Fields */}
        <div className="w-full space-y-4">
          <div>
            <label className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider ml-1 mb-1 block">Captain Name</label>
            <input 
              className="w-full p-4 bg-[#050505] text-white rounded-lg border border-[#333] focus:border-red-600 focus:outline-none transition-colors font-bold tracking-wide" 
              placeholder="Enter Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider ml-1 mb-1 block">Secret Key</label>
            <input 
              className="w-full p-4 bg-[#050505] text-white rounded-lg border border-[#333] focus:border-red-600 focus:outline-none transition-colors font-bold tracking-wide" 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth('login')}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full mt-8">
          <button 
            onClick={() => handleAuth('login')} 
            disabled={isLoading}
            className="flex-1 bg-red-700 hover:bg-red-600 text-white p-4 rounded-lg font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-red-900/50 active:scale-95"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {isLoading ? 'Loading...' : 'ENTER'}
          </button>
          
          <button 
            onClick={() => handleAuth('register')} 
            disabled={isLoading}
            className="px-6 py-4 border border-[#333] text-gray-400 font-bold uppercase tracking-wider hover:text-white hover:border-gray-500 transition-colors rounded-lg text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            JOIN
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-6 text-gray-800 text-[10px] font-mono">SECURE PIRATE NETWORK v1.0</p>
    </div>
  );
}