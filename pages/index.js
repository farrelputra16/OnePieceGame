import { useState } from 'react';
import Login from '../components/Login';
import StreetFightGame from '../components/StreetFightGame';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null); // Data user yang login

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // PASSING currentUser KE COMPONENT GAME
  return <StreetFightGame currentUser={currentUser} />;
}