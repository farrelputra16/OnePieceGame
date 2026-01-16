import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  // State Standard
  const [emptySlots] = useState([1, 2, 3]);
  const [hakiMode, setHakiMode] = useState(false);
  
  // State Bounty Calculator (Updated)
  const [pirateName, setPirateName] = useState('');
  const [pirateImage, setPirateImage] = useState(null); // Menyimpan file gambar
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // URL untuk preview gambar
  const [myBounty, setMyBounty] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const caAddress = "9Vh33ee2iHam6WkyEKWPpnzRRy1BeJD8gA7YxV4qpump";

  // Fungsi Handle Upload Gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPirateImage(file);
      // Membuat URL preview lokal
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi Hitung Bounty
  const calculateBounty = () => {
    // Validasi input
    if (!pirateName || !pirateImage) {
        alert("Arrgh! You must provide both a NAME and a PHOTO to get a bounty!");
        return;
    }

    setIsCalculating(true);
    
    // Simulasi loading
    setTimeout(() => {
      const randomBounty = Math.floor(Math.random() * 5000000000) + 1000000;
      let rank = "ROOKIE";
      if (randomBounty > 100000000) rank = "SUPERNOVA";
      if (randomBounty > 500000000) rank = "WARLORD";
      if (randomBounty > 1000000000) rank = "YONKO COMMANDER";
      if (randomBounty > 3000000000) rank = "EMPEROR (YONKO)";
      if (randomBounty > 4500000000) rank = "PIRATE KING LEVEL";

      setMyBounty({
        value: randomBounty.toLocaleString(),
        rank: rank
      });
      setIsCalculating(false);
    }, 2000); // Waktu loading sedikit diperlama biar dramatis
  };

  // Fungsi Reset Calculator
  const resetCalculator = () => {
      setMyBounty(null);
      setPirateName('');
      setPirateImage(null);
      setImagePreviewUrl(null);
  }

  return (
    <div style={hakiMode ? styles.containerHaki : styles.container}>
      <Head>
        <title>Luffy Coin | King of Pirates</title>
        <meta name="description" content="Join the Straw Hat Grand Fleet on Solana" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Rajdhani:wght@600;700&family=Rye&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        body { margin: 0; padding: 0; background: #050505; color: #f0f0f0; overflow-x: hidden; }
        
        /* Animasi Haki Pulse */
        @keyframes hakiPulse {
          0% { box-shadow: 0 0 10px #8b0000; filter: hue-rotate(0deg); }
          50% { box-shadow: 0 0 40px #ff0000; filter: hue-rotate(10deg); }
          100% { box-shadow: 0 0 10px #8b0000; filter: hue-rotate(0deg); }
        }

        /* Efek Goncangan Haki */
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        /* Scanlines */
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
          background-size: 100% 4px;
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 2;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .main-title { font-size: 4rem !important; }
            .hero-tagline { font-size: 1.2rem !important; }
            .bounty-section-padding { padding: 30px 20px !important; }
            .poster-header-text { font-size: 2.5rem !important; }
        }
      `}</style>

      {/* Background Image Overlay */}
      <div style={styles.bgWrapper}>
        <div style={styles.bgImage}></div>
        <div style={hakiMode ? styles.bgOverlayHaki : styles.bgOverlay}></div>
        
        {hakiMode && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'radial-gradient(circle, transparent 20%, #000 150%)',
            zIndex: -1, pointerEvents: 'none', animation: 'hakiPulse 0.2s infinite'
          }}></div>
        )}
      </div>

      <main style={styles.mainContent}>
        
        {/* HAKI SWITCH */}
        <div style={styles.hakiSwitchContainer}>
           <span style={{color: hakiMode ? '#ff0000' : '#555', fontWeight:'bold', marginRight:'10px', fontSize: '0.8rem'}}>
             {hakiMode ? "HAKI: ON" : "HAKI: OFF"}
           </span>
           <button 
             onClick={() => setHakiMode(!hakiMode)}
             style={hakiMode ? styles.hakiButtonActive : styles.hakiButton}
           >
             {hakiMode ? "👁️" : "⭕"}
           </button>
        </div>

        {/* HERO SECTION */}
        <header style={styles.heroSection}>
          <h1 style={hakiMode ? styles.mainTitleHaki : styles.mainTitle} className="main-title">LUFFY <span style={{color: '#d32f2f'}}>COIN</span></h1>
          <div style={styles.tagline} className="hero-tagline">THE FUTURE PIRATE KING TOKEN</div>
          
          <div style={styles.caContainer}>
            <span style={styles.caLabel}>CA (SOLANA NETWORK)</span>
            <div style={styles.caBox}>
              <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>{caAddress}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(caAddress)}
                style={styles.copyBtn}
                title="Copy Address"
              >
                📋
              </button>
            </div>
          </div>

          <Link href="/game">
            <button style={styles.playButton}>
              SET SAIL (PLAY GAME)
            </button>
          </Link>
        </header>

        {/* --- BOUNTY CALCULATOR (UPDATED WITH IMAGE) --- */}
        <section style={styles.bountySection} className="bounty-section-padding">
           <h2 style={styles.sectionHeader}>📜 GENERATE YOUR BOUNTY POSTER</h2>
           <p style={{textAlign:'center', color:'#ccc', marginBottom:'30px'}}>Upload your photo and see your official World Government bounty!</p>
           
           <div style={styles.calculatorBox}>
              {!myBounty ? (
                // Tampilan Input
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center'}}>
                  
                  {/* Preview & Upload Gambar */}
                  <div style={styles.imageUploadPreview}>
                     {imagePreviewUrl ? (
                        <img src={imagePreviewUrl} alt="Preview" style={styles.previewImg} />
                     ) : (
                        <div style={{color:'#555', textAlign:'center'}}>
                            <span style={{fontSize:'3rem'}}>📷</span>
                            <p style={{margin:0, fontSize:'0.8rem'}}>No Photo Chosen</p>
                        </div>
                     )}
                  </div>

                  {/* Tombol Upload Custom */}
                  <label htmlFor="file-upload" style={styles.customFileUpload}>
                      {pirateImage ? "CHANGE PHOTO" : "UPLOAD WANTED PHOTO"}
                  </label>
                  <input 
                      id="file-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{display:'none'}} // Sembunyikan input file asli
                  />

                  <input 
                    type="text" 
                    placeholder="Enter Pirate Name..." 
                    style={styles.bountyInput}
                    value={pirateName}
                    onChange={(e) => setPirateName(e.target.value.toUpperCase())} // Paksa huruf besar biar keren
                  />

                  <button 
                    onClick={calculateBounty} 
                    style={styles.calcButton}
                    disabled={isCalculating}
                  >
                    {isCalculating ? "GENERATING POSTER..." : "REVEAL MY BOUNTY"}
                  </button>
                </div>
              ) : (
                // Tampilan Hasil Poster
                <div style={styles.bountyResult}>
                   {/* Tekstur Kertas */}
                   <div style={styles.paperTexture}></div> 
                   
                   <div style={styles.posterHeader} className="poster-header-text">WANTED</div>
                   <div style={styles.deadOrAlivePoster}>DEAD OR ALIVE</div>
                   
                   <div style={styles.posterImageContainer}>
                      {/* Gambar yang diupload user */}
                      <img src={imagePreviewUrl} alt={pirateName} style={styles.posterImgActual} />
                   </div>
                   
                   <div style={styles.posterName}>{pirateName}</div>
                   <div style={styles.posterValue}>
                     <span style={{fontSize:'0.6em'}}>฿</span> {myBounty.value}-
                   </div>
                   <div style={styles.posterRank}>{myBounty.rank}</div>
                   
                   <button onClick={resetCalculator} style={styles.resetButton}>GENERATE NEW POSTER</button>
                </div>
              )}
           </div>
        </section>

        {/* GAME PREVIEW */}
        <section style={styles.gameSection}>
           <div style={styles.gameContent}>
              <div style={styles.gameInfo}>
                 <h2 style={{...styles.sectionHeader, textAlign: 'left', marginBottom: '15px'}}>
                   <span style={{color: '#d32f2f'}}>STREET FIGHT</span> ARENA
                 </h2>
                 <p style={styles.gameDesc}>
                   Take control of your favorite Straw Hat pirates in our exclusive <b>Play-to-Earn</b> fighting game.
                 </p>
                 <Link href="/game">
                    <button style={styles.smallPlayButton}>PLAY DEMO NOW ➜</button>
                 </Link>
              </div>

              <div style={styles.videoWrapper}>
                 <div style={styles.videoFrame}>
                    <div className="scanlines"></div>
                    <video src="/image/game.mp4" autoPlay loop muted playsInline style={styles.videoPlayer} />
                 </div>
              </div>
           </div>
        </section>

        {/* TREASURY & FEES */}
        <section style={styles.sectionContainer}>
          <div style={{borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px', textAlign:'center'}}>
             <h2 style={styles.sectionHeader}>PIRATE TREASURY</h2>
             <p style={{color: '#888', letterSpacing: '2px', fontSize: '0.8rem'}}>REVENUE DISTRIBUTION PROTOCOL</p>
          </div>
          
          <div style={styles.trackerBox}>
            <div style={{textAlign: 'center', flex: 1, minWidth: '200px'}}>
              <p style={{margin:0, color:'#d32f2f', fontWeight:'bold', letterSpacing:'1px'}}>TOTAL FEES GENERATED</p>
              <h2 style={styles.solValue}>86.99 SOL</h2>
              <p style={{fontSize: '0.8rem', color: '#ffeb3b'}}>GROWING DAILY 📈</p>
            </div>
            
            <div style={styles.feeInfoList}>
              <h4 style={{color:'#fff', margin:'0 0 15px 0', fontFamily: "'Bangers', cursive", fontSize: '1.5rem', letterSpacing: '1px'}}>TREASURY USAGE:</h4>
              <ul style={{listStyle:'none', padding:0, margin:0, fontSize:'1rem', color:'#ccc', lineHeight: '1.8'}}>
                <li style={{display:'flex', alignItems:'center', gap:'10px'}}><span style={{color: '#00ff88'}}>✔</span> <b>BUYBACK & BURN</b></li>
                <li style={{display:'flex', alignItems:'center', gap:'10px'}}><span style={{color: '#00ff88'}}>✔</span> <b>GLOBAL MARKETING</b></li>
                <li style={{display:'flex', alignItems:'center', gap:'10px'}}><span style={{color: '#00ff88'}}>✔</span> <b>CARD ACQUISITION</b></li>
              </ul>
            </div>
          </div>
        </section>

        {/* WEEKLY WINNERS */}
        <section style={{marginTop: '100px'}}>
          <div style={{textAlign: 'center', marginBottom: '50px'}}>
            <h2 style={styles.sectionHeader}>🏆 WEEKLY HALL OF FAME</h2>
            <div style={styles.eventInfoBox}>
               <p style={{margin:0, color: '#ffeb3b', fontSize: '1.2rem', fontFamily: "'Rajdhani', sans-serif"}}>
                 📢 <b>EVENT INFO:</b> The Devs will reveal exclusive <b>Luffy Cards</b> and host a <b>Giveaway</b> for lucky holders!
               </p>
            </div>
          </div>
          
          <div style={styles.bountyGrid}>
            {emptySlots.map((slot) => (
              <div key={slot} className="card-hover" style={styles.bountyCard}>
                <div style={styles.wantedHeader}>WANTED</div>
                <div style={styles.deadOrAlive}>DEAD OR ALIVE</div>
                <div style={styles.imageContainer}><span style={{fontSize: '6rem', color: '#333'}}>?</span></div>
                <div style={styles.bountyName}>UNKNOWN PIRATE</div>
                <div style={styles.bountyValue}><span style={{fontSize:'0.6em', color:'#aaa'}}>BOUNTY:</span> ???,???,???</div>
                <div style={styles.statusBox}><div style={styles.comingSoonBadge}>COMING SOON</div></div>
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

// STYLING OBJECT (Responsive & Updated)
const styles = {
  container: {
    minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", position: 'relative', overflowX: 'hidden',
    transition: 'filter 0.5s',
  },
  containerHaki: {
    minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", position: 'relative', overflowX: 'hidden',
    filter: 'contrast(1.2) sepia(0.2)',
  },
  bgWrapper: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2, background: '#111'
  },
  bgImage: {
    width: '100%', height: '100%', backgroundImage: "url('/image/luffy-bg.gif')",
    backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.5) contrast(1.2)', transform: 'scale(1.05)',
  },
  bgOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #080808)',
  },
  bgOverlayHaki: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
    background: 'radial-gradient(circle, rgba(139,0,0,0.2) 0%, rgba(0,0,0,0.9) 100%)',
    animation: 'hakiPulse 2s infinite'
  },
  mainContent: {
    maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', zIndex: 1, position:'relative'
  },
  
  // HAKI SWITCH
  hakiSwitchContainer: {
    position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', zIndex: 100,
    background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '20px'
  },
  hakiButton: {
    background: '#333', border: '2px solid #555', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center'
  },
  hakiButtonActive: {
    background: '#8b0000', border: '2px solid #ff0000', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow: '0 0 10px #ff0000'
  },

  heroSection: { textAlign: 'center', padding: '80px 0 40px 0' },
  mainTitle: {
    fontFamily: "'Bangers', cursive", fontSize: '6rem', margin: '0', lineHeight: '0.9', color: '#fff', letterSpacing: '4px', textShadow: '4px 4px 0px #8b0000', textTransform: 'uppercase',
    wordBreak: 'break-word'
  },
  mainTitleHaki: {
    fontFamily: "'Bangers', cursive", fontSize: '6rem', margin: '0', lineHeight: '0.9', color: '#ff0000', letterSpacing: '4px', textShadow: '4px 4px 10px #000', textTransform: 'uppercase',
    animation: 'shake 0.5s infinite', wordBreak: 'break-word'
  },
  tagline: {
    fontSize: '1.5rem', letterSpacing: '6px', color: '#ffeb3b', marginBottom: '40px', fontWeight: '700', textTransform: 'uppercase'
  },
  
  // CA BOX (Responsive Truncate)
  caContainer: {
    background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #d32f2f', display: 'inline-block', padding: '15px 30px', borderRadius: '8px', marginBottom: '60px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', maxWidth: '90%'
  },
  caLabel: { display: 'block', fontSize: '0.8rem', color: '#d32f2f', marginBottom: '5px', letterSpacing: '2px', fontWeight: 'bold' },
  caBox: { fontFamily: 'monospace', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'space-between' },
  copyBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', filter: 'grayscale(100%)', flexShrink: 0 },

  playButton: {
    background: 'linear-gradient(to right, #d32f2f, #b71c1c)', color: '#fff', border: 'none', padding: '20px 60px', fontSize: '1.8rem', fontFamily: "'Bangers', cursive", cursor: 'pointer', letterSpacing: '2px', borderRadius: '50px', boxShadow: '0 0 25px rgba(211, 47, 47, 0.4)', textTransform: 'uppercase', maxWidth: '100%', whiteSpace: 'nowrap'
  },

  // BOUNTY CALCULATOR (New Styles & Responsive)
  bountySection: {
    marginBottom: '80px', background: 'rgba(20,20,20,0.8)', borderRadius: '15px', border: '1px solid #444', textAlign: 'center'
  },
  calculatorBox: { maxWidth: '500px', margin: '0 auto', padding: '20px', width: '100%' },
  
  // Input Stage Styles
  imageUploadPreview: {
    width: '150px', height: '150px', background: '#222', border: '3px dashed #555', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
  },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  customFileUpload: {
    display: 'inline-block', padding: '10px 20px', cursor: 'pointer', background: '#333', color: '#ffeb3b', borderRadius: '5px', border: '1px solid #ffeb3b', fontWeight: 'bold', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', transition: 'all 0.2s'
  },
  bountyInput: {
    width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '8px', border: '2px solid #d32f2f', background: '#000', color: '#fff', textAlign: 'center', fontFamily: "'Bangers', cursive", textTransform: 'uppercase'
  },
  calcButton: {
    width: '100%', padding: '15px', background: '#ffeb3b', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255, 235, 59, 0.3)', fontFamily: "'Rajdhani', sans-serif"
  },
  
  // Result Poster Styles
  bountyResult: {
    background: '#f4e4bc', // Warna kertas lama
    padding: '30px 20px', borderRadius: '4px', color: '#3e2723', border: '6px solid #3e2723', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', animation: 'fadeIn 0.5s', position: 'relative', overflow: 'hidden',
    maxWidth: '400px', margin: '0 auto'
  },
  paperTexture: {
    position: 'absolute', top:0, left:0, width:'100%', height:'100%', opacity: 0.1, pointerEvents:'none',
    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')"
  },
  posterHeader: { fontFamily: "'Rye', serif", fontSize: '3.5rem', fontWeight: '900', lineHeight: 0.8, letterSpacing: '5px', color: '#3e2723' },
  deadOrAlivePoster: { fontFamily: "'Rye', serif", fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '3px solid #3e2723', display: 'inline-block', padding: '0 30px 5px 30px', marginBottom: '25px', color: '#3e2723' },
  posterImageContainer: { height: '250px', background: '#aaa', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #3e2723', width: '90%', overflow: 'hidden', position:'relative', zIndex: 2 },
  posterImgActual: { width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.3) contrast(1.1)' },
  posterName: { fontFamily: "'Rye', serif", fontSize: '2.2rem', textTransform: 'uppercase', fontWeight: 'bold', lineHeight: 1, marginBottom: '10px', wordBreak: 'break-word' },
  posterValue: { fontFamily: "'Rye', serif", fontSize: '1.8rem', color: '#d32f2f', fontWeight: '900' },
  posterRank: { marginTop: '15px', fontWeight: 'bold', background: '#3e2723', color: '#f4e4bc', padding: '8px 15px', borderRadius: '4px', display: 'inline-block', fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', position:'relative', zIndex: 2 },
  resetButton: { marginTop: '25px', background: 'transparent', border: '2px solid #3e2723', cursor: 'pointer', fontSize: '0.9rem', padding: '10px 20px', fontWeight: 'bold', color: '#3e2723', position:'relative', zIndex: 2, fontFamily: "'Rajdhani', sans-serif" },

  // OTHER SECTIONS (Standardized for responsiveness)
  gameSection: { marginBottom: '100px', padding: '40px 20px', background: 'rgba(20,20,20,0.6)', borderRadius: '20px', border: '1px solid #333', backdropFilter: 'blur(5px)' },
  gameContent: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '30px', justifyContent: 'center' },
  gameInfo: { flex: '1', minWidth: '280px' },
  gameDesc: { fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6', marginBottom: '20px' },
  smallPlayButton: { background: 'transparent', border: '2px solid #ffeb3b', color: '#ffeb3b', padding: '10px 25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '30px' },
  videoWrapper: { flex: '1', minWidth: '280px', maxWidth: '500px' },
  videoFrame: { position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '4px solid #222', background: '#000' },
  videoPlayer: { width: '100%', display: 'block', borderRadius: '6px' },

  sectionContainer: { background: 'rgba(15, 15, 15, 0.95)', padding: '40px 20px', borderRadius: '20px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  sectionHeader: { fontFamily: "'Bangers', cursive", fontSize: '3rem', textAlign: 'center', margin: '0', color: '#fff', letterSpacing:'3px', textShadow: '2px 2px 0px #333' },
  trackerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', flexWrap: 'wrap' },
  solValue: { fontSize: '4rem', margin: '10px 0', fontFamily: "'Bangers', cursive", color: '#fff', textShadow: '0 0 15px rgba(255, 235, 59, 0.3)', wordBreak: 'break-word' },
  feeInfoList: { flex: 2, minWidth: '280px', borderLeft: '1px solid #444', paddingLeft: '30px' },

  eventInfoBox: { background: 'rgba(211, 47, 47, 0.1)', display: 'inline-block', padding: '20px', borderRadius: '12px', border: '1px dashed #d32f2f', marginBottom: '20px', boxShadow: '0 0 15px rgba(211, 47, 47, 0.2)', maxWidth: '90%' },
  bountyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', padding: '10px' },
  bountyCard: { background: '#e0e0e0', color: '#111', padding: '20px', textAlign: 'center', position: 'relative', borderRadius: '5px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', border: '8px solid #222' },
  wantedHeader: { fontFamily: "'Rye', serif", fontSize: '2.8rem', color: '#222', fontWeight: '900', letterSpacing: '3px', lineHeight: 1, marginBottom: '5px' },
  deadOrAlive: { fontSize: '1rem', fontWeight: 'bold', fontFamily: "'Rye', serif", borderBottom: '2px solid #222', display: 'inline-block', padding: '0 20px 5px 20px', marginBottom: '20px' },
  imageContainer: { background: '#ccc', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '2px solid #555' },
  bountyName: { fontFamily: "'Bangers', cursive", fontSize: '1.8rem', color: '#222', letterSpacing: '1px', marginBottom: '5px' },
  bountyValue: { fontFamily: "'Rye', serif", fontSize: '1.4rem', fontWeight: 'bold', color: '#d32f2f', marginBottom: '15px' },
  statusBox: { background: '#222', padding: '15px', borderRadius: '4px', marginTop: '10px' },
  comingSoonBadge: { color: '#ffeb3b', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '2px', border: '1px dashed #ffeb3b', padding: '5px', display: 'inline-block' },
  
  footer: { textAlign: 'center', marginTop: '100px', color: '#444', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold', paddingBottom: '20px' }
};