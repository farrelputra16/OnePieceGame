import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  // 3 Slot Kosong untuk Pemenang Minggu Depan
  const [emptySlots] = useState([1, 2, 3]);

  const caAddress = "9Vh33ee2iHam6WkyEKWPpnzRRy1BeJD8gA7YxV4qpump";

  return (
    <div style={styles.container}>
      <Head>
        <title>Luffy Coin | King of Pirates</title>
        <meta name="description" content="Join the Straw Hat Grand Fleet on Solana" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Rajdhani:wght@600;700&family=Rye&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        body { margin: 0; padding: 0; background: #080808; color: #f0f0f0; }
        
        @keyframes hakiPulse {
          0% { box-shadow: 0 0 10px #8b0000; }
          50% { box-shadow: 0 0 25px #ff0000; }
          100% { box-shadow: 0 0 10px #8b0000; }
        }

        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: #ffeb3b;
          box-shadow: 0 10px 40px rgba(255, 0, 0, 0.3);
        }

        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
          background-size: 100% 4px;
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 2;
        }
      `}</style>

      {/* Background Image Overlay */}
      <div style={styles.bgWrapper}>
        <div style={styles.bgImage}></div>
        <div style={styles.bgOverlay}></div>
      </div>

      <main style={styles.mainContent}>
        
        {/* HERO SECTION */}
        <header style={styles.heroSection}>
          <h1 style={styles.mainTitle}>LUFFY <span style={{color: '#d32f2f'}}>COIN</span></h1>
          <div style={styles.tagline}>THE FUTURE PIRATE KING TOKEN</div>
          
          <div style={styles.caContainer}>
            <span style={styles.caLabel}>CA (SOLANA NETWORK)</span>
            <div style={styles.caBox}>
              {caAddress}
              <button 
                onClick={() => navigator.clipboard.writeText(caAddress)}
                style={styles.copyBtn}
                title="Copy Address"
              >
                📋
              </button>
            </div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>☠️ NAKAMA DRIVEN</h3>
              <p>Zero taxes. Fully decentralized. Built for the community, by the community.</p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>⚔️ BATTLE ARENA</h3>
              <p>Test your strength in the Street Fight mini-game. Prove you are the strongest.</p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>💎 TREASURE HUNT</h3>
              <p>Weekly rewards and rare character card airdrops for loyal holders.</p>
            </div>
          </div>

          <Link href="/game">
            <button style={styles.playButton}>
              SET SAIL (PLAY GAME)
            </button>
          </Link>
        </header>

        {/* GAME PREVIEW SECTION */}
        <section style={styles.gameSection}>
           <div style={styles.gameContent}>
              <div style={styles.gameInfo}>
                 <h2 style={{...styles.sectionHeader, textAlign: 'left', marginBottom: '15px'}}>
                   <span style={{color: '#d32f2f'}}>STREET FIGHT</span> ARENA
                 </h2>
                 <p style={styles.gameDesc}>
                   Experience the thrill of the Grand Line! Take control of your favorite Straw Hat pirates in our exclusive <b>Play-to-Earn</b> fighting game. 
                   Master the combos, defeat the enemies, and earn $LUFFY rewards.
                 </p>
                 <ul style={styles.featureList}>
                    <li>👊 <b>REAL-TIME COMBAT:</b> Smooth animations & high-octane action.</li>
                    <li>🎮 <b>SKILL BASED:</b> Victory depends on your strategy, not luck.</li>
                    <li>🌍 <b>GLOBAL RANKING:</b> Climb the leaderboard to become Pirate King.</li>
                 </ul>
                 <Link href="/game">
                    <button style={styles.smallPlayButton}>PLAY DEMO NOW ➜</button>
                 </Link>
              </div>

              <div style={styles.videoWrapper}>
                 <div style={styles.videoFrame}>
                    <div className="scanlines"></div>
                    <video 
                      src="/image/game.mp4" 
                      autoPlay loop muted playsInline 
                      style={styles.videoPlayer}
                    />
                    <div style={styles.liveBadge}>● LIVE GAMEPLAY</div>
                 </div>
              </div>
           </div>
        </section>

        {/* TREASURY & FEES (STATIC VERSION) */}
        <section style={styles.sectionContainer}>
          <div style={{borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px', textAlign:'center'}}>
             <h2 style={styles.sectionHeader}>PIRATE TREASURY</h2>
             <p style={{color: '#888', letterSpacing: '2px', fontSize: '0.8rem'}}>REVENUE DISTRIBUTION PROTOCOL</p>
          </div>
          
          <div style={styles.trackerBox}>
            <div style={{textAlign: 'center', flex: 1, minWidth: '200px'}}>
              <p style={{margin:0, color:'#d32f2f', fontWeight:'bold', letterSpacing:'1px'}}>TOTAL FEES GENERATED</p>
              
              {/* ANGKA STATIS (Bisa diganti manual sesuka hati) */}
              <h2 style={styles.solValue}>86.99 SOL</h2>
              
              <p style={{fontSize: '0.8rem', color: '#ffeb3b'}}>GROWING DAILY 📈</p>
            </div>
            
            <div style={styles.feeInfoList}>
              <h4 style={{color:'#fff', margin:'0 0 15px 0', fontFamily: "'Bangers', cursive", fontSize: '1.5rem', letterSpacing: '1px'}}>TREASURY USAGE:</h4>
              <ul style={{listStyle:'none', padding:0, margin:0, fontSize:'1rem', color:'#ccc', lineHeight: '1.8'}}>
                <li style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color: '#00ff88'}}>✔</span> <b>BUYBACK & BURN:</b> Supporting the price floor.
                </li>
                <li style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color: '#00ff88'}}>✔</span> <b>GLOBAL MARKETING:</b> Spreading the word.
                </li>
                <li style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color: '#00ff88'}}>✔</span> <b>CARD ACQUISITION:</b> Buying assets for rewards.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* WEEKLY WINNERS (ALL COMING SOON + GIVEAWAY INFO) */}
        <section style={{marginTop: '100px'}}>
          <div style={{textAlign: 'center', marginBottom: '50px'}}>
            <h2 style={styles.sectionHeader}>🏆 WEEKLY HALL OF FAME</h2>
            <p style={{color: '#aaa', fontSize: '1.1rem', marginBottom: '20px'}}>Who will claim the bounty this week?</p>
            
            {/* BOX PENJELASAN GIVEAWAY */}
            <div style={styles.eventInfoBox}>
               <p style={{margin:0, color: '#ffeb3b', fontSize: '1.2rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: '1.5'}}>
                 📢 <b>EVENT INFO:</b> The Devs will reveal exclusive <b>Luffy Cards</b> and host a <b>Giveaway</b> for lucky holders!
               </p>
            </div>
          </div>
          
          <div style={styles.bountyGrid}>
            
            {/* Loop 3 Kartu Coming Soon */}
            {emptySlots.map((slot) => (
              <div key={slot} className="card-hover" style={styles.bountyCard}>
                <div style={styles.wantedHeader}>
                  <span>WANTED</span>
                </div>
                <div style={styles.deadOrAlive}>DEAD OR ALIVE</div>

                <div style={styles.imageContainer}>
                  <span style={{fontSize: '6rem', color: '#333', fontWeight: 'bold'}}>?</span>
                </div>
                
                <div style={styles.bountyName}>UNKNOWN PIRATE</div>
                <div style={styles.bountyValue}>
                  <span style={{fontSize:'0.6em', color:'#aaa'}}>BOUNTY:</span> ???,???,???
                </div>
                
                <div style={styles.statusBox}>
                  <div style={styles.comingSoonBadge}>COMING SOON</div>
                  <p style={{margin:'10px 0 0 0', fontSize:'0.75rem', color:'#777', fontStyle: 'italic'}}>
                    Awaiting Winner Declaration...
                  </p>
                </div>
              </div>
            ))}

          </div>
        </section>

        <footer style={styles.footer}>
          <p>© 2025 STRAW HAT DEV TEAM • POWERED BY SOLANA</p>
        </footer>
      </main>
    </div>
  );
}

// STYLING OBJECT
const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Rajdhani', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  bgWrapper: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2,
    background: '#111'
  },
  bgImage: {
    width: '100%', height: '100%',
    backgroundImage: "url('/image/luffy-bg.gif')",
    backgroundSize: 'cover', backgroundPosition: 'center',
    filter: 'brightness(0.5) contrast(1.2)', 
    transform: 'scale(1.05)',
  },
  bgOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #080808)', 
  },
  mainContent: {
    maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', zIndex: 1, position:'relative'
  },
  heroSection: {
    textAlign: 'center', padding: '80px 0', 
  },
  mainTitle: {
    fontFamily: "'Bangers', cursive", fontSize: '6rem', margin: '0', lineHeight: '0.9',
    color: '#fff', letterSpacing: '4px', textShadow: '4px 4px 0px #8b0000',
    textTransform: 'uppercase'
  },
  tagline: {
    fontSize: '1.5rem', letterSpacing: '6px', color: '#ffeb3b', marginBottom: '40px',
    fontWeight: '700', textTransform: 'uppercase', fontFamily: "'Rajdhani', sans-serif"
  },
  caContainer: {
    background: 'rgba(20, 20, 20, 0.8)', 
    border: '1px solid #d32f2f', 
    display: 'inline-block',
    padding: '15px 30px', 
    borderRadius: '8px', 
    marginBottom: '60px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
  },
  caLabel: {
    display: 'block', fontSize: '0.8rem', color: '#d32f2f', marginBottom: '5px',
    letterSpacing: '2px', fontWeight: 'bold'
  },
  caBox: {
    fontFamily: 'monospace', fontSize: '1.2rem', color: '#fff',
    display: 'flex', alignItems: 'center', gap: '15px',
  },
  copyBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontSize: '1.2rem', filter: 'grayscale(100%)',
  },
  infoGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px', marginBottom: '70px',
  },
  infoCard: {
    background: 'linear-gradient(145deg, #1a1a1a, #111)', 
    borderLeft: '4px solid #d32f2f', 
    padding: '30px',
    borderRadius: '5px',
    textAlign: 'left', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    color: '#ffeb3b', fontFamily: "'Bangers', cursive", fontSize: '1.8rem', marginTop: 0,
    letterSpacing: '1px'
  },
  playButton: {
    background: 'linear-gradient(to right, #d32f2f, #b71c1c)', 
    color: '#fff',
    border: 'none', padding: '20px 60px', fontSize: '1.8rem', 
    fontFamily: "'Bangers', cursive", cursor: 'pointer', letterSpacing: '2px', 
    borderRadius: '50px',
    boxShadow: '0 0 25px rgba(211, 47, 47, 0.4)',
    textTransform: 'uppercase', 
    transition: 'transform 0.2s',
  },
  
  // GAME SECTION STYLES
  gameSection: {
    marginBottom: '100px',
    padding: '40px',
    background: 'rgba(20,20,20,0.6)',
    borderRadius: '20px',
    border: '1px solid #333',
    backdropFilter: 'blur(5px)',
  },
  gameContent: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', justifyContent: 'center',
  },
  gameInfo: {
    flex: '1', minWidth: '300px',
  },
  gameDesc: {
    fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6', marginBottom: '20px',
  },
  featureList: {
    listStyle: 'none', padding: 0, marginBottom: '30px', color: '#eee', lineHeight: '2.2',
  },
  smallPlayButton: {
    background: 'transparent', border: '2px solid #ffeb3b', color: '#ffeb3b',
    padding: '10px 25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
    borderRadius: '30px', transition: 'background 0.3s, color 0.3s',
  },
  videoWrapper: {
    flex: '1', minWidth: '300px', maxWidth: '500px',
  },
  videoFrame: {
    position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '4px solid #222',
    boxShadow: '0 0 30px rgba(211, 47, 47, 0.2)', background: '#000',
  },
  videoPlayer: {
    width: '100%', display: 'block', borderRadius: '6px',
  },
  liveBadge: {
    position: 'absolute', top: '15px', left: '15px', background: 'rgba(255, 0, 0, 0.8)',
    color: 'white', padding: '5px 10px', fontSize: '0.7rem', borderRadius: '4px',
    fontWeight: 'bold', zIndex: 3, animation: 'hakiPulse 2s infinite',
  },

  // TREASURY SECTION
  sectionContainer: {
    background: 'rgba(15, 15, 15, 0.95)', padding: '50px', 
    borderRadius: '20px', border: '1px solid #333',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  sectionHeader: {
    fontFamily: "'Bangers', cursive", fontSize: '3rem', textAlign: 'center',
    margin: '0', color: '#fff', letterSpacing:'3px', textShadow: '2px 2px 0px #333'
  },
  trackerBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: '40px', flexWrap: 'wrap'
  },
  solValue: {
    fontSize: '4.5rem', margin: '10px 0', fontFamily: "'Bangers', cursive",
    color: '#fff', textShadow: '0 0 15px rgba(255, 235, 59, 0.3)',
  },
  feeInfoList: {
    flex: 2, borderLeft: '1px solid #444', paddingLeft: '40px'
  },
  
  // EVENT INFO BOX
  eventInfoBox: {
    background: 'rgba(211, 47, 47, 0.1)', 
    display: 'inline-block', 
    padding: '20px 40px', 
    borderRadius: '12px', 
    border: '1px dashed #d32f2f',
    marginBottom: '20px',
    boxShadow: '0 0 15px rgba(211, 47, 47, 0.2)'
  },

  // BOUNTY CARDS
  bountyGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px', padding: '10px',
  },
  bountyCard: {
    background: '#e0e0e0', color: '#111', padding: '20px', textAlign: 'center',
    position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer',
    borderRadius: '5px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', border: '8px solid #222', 
  },
  wantedHeader: {
    fontFamily: "'Rye', serif", fontSize: '2.8rem', color: '#222',
    fontWeight: '900', letterSpacing: '3px', lineHeight: 1, marginBottom: '5px',
  },
  deadOrAlive: {
    fontSize: '1rem', fontWeight: 'bold', fontFamily: "'Rye', serif",
    borderBottom: '2px solid #222', display: 'inline-block', padding: '0 20px 5px 20px', marginBottom: '20px'
  },
  imageContainer: {
    background: '#ccc', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '20px', border: '2px solid #555', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
  },
  bountyName: {
    fontFamily: "'Bangers', cursive", fontSize: '1.8rem', color: '#222',
    letterSpacing: '1px', marginBottom: '5px'
  },
  bountyValue: {
    fontFamily: "'Rye', serif", fontSize: '1.4rem', fontWeight: 'bold',
    color: '#d32f2f', marginBottom: '15px'
  },
  statusBox: {
    background: '#222', padding: '15px', borderRadius: '4px', marginTop: '10px'
  },
  comingSoonBadge: {
    color: '#ffeb3b', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '2px', border: '1px dashed #ffeb3b', padding: '5px', display: 'inline-block'
  },
  footer: {
    textAlign: 'center', marginTop: '100px', color: '#444', fontSize: '0.8rem',
    letterSpacing: '2px', fontWeight: 'bold'
  }
};