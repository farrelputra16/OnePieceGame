import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from '../components/Login';
import StreetFightGame from '../components/StreetFightGame';

export default function GamePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // Opsi: Redirect ke home jika ingin keluar (bisa ditambahkan nanti)

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: '#000' }}>
         {/* Tombol kembali ke Home */}
         <button 
            onClick={() => router.push('/')}
            style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100, padding: '10px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
         >
            ← Back to Home
         </button>
         <Login onLoginSuccess={(user) => setCurrentUser(user)} />
      </div>
    );
  }

  return <StreetFightGame currentUser={currentUser} />;
}