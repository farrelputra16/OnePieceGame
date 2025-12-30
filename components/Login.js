import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleAuth = async (type) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass, type })
    });
    const data = await res.json();
    if (data.success) onLoginSuccess(data.user);
    else alert(data.message || "Success! Now Login.");
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-900 p-8 rounded-xl border-2 border-yellow-500 shadow-2xl">
      <h2 className="text-2xl text-yellow-400 font-bold text-center">PIRATE LOGIN</h2>
      <input className="p-2 rounded bg-black text-white border border-gray-700" placeholder="Username Telegram" onChange={e => setUser(e.target.value)} />
      <input className="p-2 rounded bg-black text-white border border-gray-700" type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={() => handleAuth('login')} className="bg-yellow-500 flex-1 p-2 font-bold">LOGIN</button>
        <button onClick={() => handleAuth('register')} className="bg-blue-600 flex-1 p-2 font-bold text-white">REGISTER</button>
      </div>
    </div>
  );
}