import React from 'react';
import { toPng } from 'html-to-image'; // Pastiin library ini udah di-install ya bos

// --- IKON TEKNOLOGI UTAMA (MAX-UPGRADED VISUALS PER LEVEL) ---
const TechIcon = ({ type, color, isHovered }) => {
  const glowStyle = { 
    filter: `drop-shadow(0 0 ${isHovered ? '25px' : '5px'} ${color})`, 
    transition: '0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
  };
  
  const icons = {
    1: ( // THE EXPLORER - Radar & Pulse
      <svg viewBox="0 0 100 100" style={glowStyle}>
        <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3">
          <animate attributeName="r" values="30;38;30" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke={color} strokeWidth="2.5">
          <animate attributeName="stroke-dasharray" values="0,200;200,0;0,200" dur="4s" repeatCount="indefinite" />
        </path>
        <rect x="44" y="44" width="12" height="12" fill={color}>
             <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    ),
    2: ( // ADVANCED VOYAGER - Kinetic Atomic
      <svg viewBox="0 0 100 100" style={glowStyle}>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
          <ellipse cx="50" cy="50" rx="45" ry="15" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
          <ellipse cx="50" cy="50" rx="45" ry="15" stroke={color} strokeWidth="2" fill="none" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="15" stroke={color} strokeWidth="2" fill="none" transform="rotate(120 50 50)" />
          <circle cx="95" cy="50" r="4" fill={color} />
        </g>
        <circle cx="50" cy="50" r="14" fill={color}>
            <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    3: ( // GOLDEN ELITE - Cyber Hexagon Shield
      <svg viewBox="0 0 100 100" style={glowStyle}>
        <path d="M50 5 L95 25 V75 L50 95 L5 75 V25 Z" fill="none" stroke={color} strokeWidth="3">
            <animate attributeName="stroke-dashoffset" values="0;400" dur="5s" repeatCount="indefinite" />
            <animate attributeName="stroke-dasharray" values="10,20;100,10" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M50 20 L80 35 V65 L50 80 L20 65 V35 Z" fill={color} opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="3s" repeatCount="indefinite" />
        </path>
        <rect x="40" y="40" width="20" height="20" fill={color} transform="rotate(45 50 50)">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
        </rect>
      </svg>
    ),
    // Contoh Modifikasi untuk Level 4 (The Architect)
4: ( 
  <svg viewBox="0 0 100 100" style={glowStyle}>
    <defs>
      <filter id="aiGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Particle Dispersion effect inside SVG */}
    {[...Array(8)].map((_, i) => (
      <circle key={i} r="1" fill={color}>
        <animate attributeName="cx" values="50;20;80;50" dur={`${2+i}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values="50;80;20;50" dur={`${2+i}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur={`${2+i}s`} repeatCount="indefinite" />
      </circle>
    ))}
    <g filter="url(#aiGlow)">
        <rect x="30" y="30" width="40" height="40" stroke={color} strokeWidth="2" fill="none">
          <animate attributeName="stroke-width" values="1;4;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <circle cx="50" cy="50" r="10" fill={color}>
            <animate attributeName="r" values="8;15;8" dur="1s" repeatCount="indefinite" />
        </circle>
    </g>
  </svg>
)
  };
  return icons[type] || icons[1];
};

const TitleWatermark = ({ name, color }) => {
  const style = { position: 'absolute', top: '10%', left: '5%', width: '100%', height: '100%', opacity: 0.1, zIndex: 0, pointerEvents: 'none' };
  return (
    <div style={style}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
            <text x="0" y="50" fontSize="10" fontWeight="900" fill={color} style={{fontFamily: 'monospace', letterSpacing: '2px'}} opacity="0.5">
                {name}
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
            </text>
            <path d="M0 55 H80" stroke={color} strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
    </div>
  );
};

const CardVisualFX = ({ level, color, isUnlocked }) => {
  if (!isUnlocked) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, borderRadius: '28px', overflow: 'hidden' }}>
      
      {/* LEVEL 1: NEON FOG */}
      {level === 1 && (
        <div style={{
          position: 'absolute', inset: '-20%',
          background: `radial-gradient(circle at center, ${color}44 0%, transparent 60%)`,
          animation: 'neonFog 4s infinite ease-in-out',
          mixBlendMode: 'screen'
        }} />
      )}

      {/* LEVEL 2: LIGHT TRAILS + PRISM */}
      {level === 2 && (
        <>
          <div className="fx-scan" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)`, height: '2px', width: '100%' }} />
          <div style={{ 
            position: 'absolute', inset: 0, 
            border: `1px solid ${color}33`,
            boxShadow: `inset 0 0 20px ${color}22`,
            filter: 'hue-rotate(90deg)' 
          }} />
        </>
      )}

      {/* LEVEL 3: LIQUID CHROME + ENERGY CORE */}
      {level === 3 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(45deg, transparent, ${color}22, transparent)`,
          backgroundSize: '200% 200%',
          animation: 'liquidFlow 3s infinite linear',
          border: `2px solid ${color}44`
        }} />
      )}

      {/* LEVEL 4: HOLOGRAPHIC + PARTICLE + AI SCAN */}
      {level === 4 && (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            background: `repeating-linear-gradient(0deg, transparent, ${color}11 1px, transparent 2px)`,
            backgroundSize: '100% 4px'
          }} />
          <div style={{
            position: 'absolute', width: '100%', height: '20px',
            background: `linear-gradient(to bottom, transparent, ${color}66, transparent)`,
            animation: 'aiScan 3s infinite linear',
            zIndex: 10
          }} />
        </>
      )}
    </div>
  );
};
// --- UPGRADED: LAYER EFEK TITLE PREMIERE (MAKIN TINGGI MAKIN DEWA) ---
const TitleVisualBuff = ({ titleIndex, color }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden', borderRadius: '28px', '--color': color }}>
      
      {/* TITLE 1-7: HYPER-SPEED WARP (Garis Cahaya Jatuh) */}
      {titleIndex >= 1 && (
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ 
              position: 'absolute', left: `${Math.random() * 100}%`, top: '-10%', 
              width: '1px', height: '100px', background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
              animation: `warpSpeed ${1 + Math.random() * 2}s infinite linear`,
              animationDelay: `${Math.random() * 2}s`
            }} />
          ))}
        </div>
      )}

      {/* TITLE 3-7: NEBULA GAS (Efek Awan Digital) */}
      {titleIndex >= 2 && (
        <div style={{ 
          position: 'absolute', inset: '-50%', 
          background: `radial-gradient(circle at center, ${color}33 0%, transparent 50%)`,
          animation: 'nebulaPulse 10s infinite linear',
          mixBlendMode: 'screen'
        }} />
      )}

      {/* TITLE 4-7: SHATTER EFFECT (Distorsi Bingkai) */}
      {titleIndex >= 3 && (
        <div style={{ 
          position: 'absolute', inset: 0, 
          border: `2px solid ${color}44`, 
          animation: 'shatter 5s infinite step-end',
          opacity: 0.6 
        }} />
      )}

      {/* TITLE 5-7: LIQUID CHROME (Kilauan Mewah) */}
      {titleIndex >= 4 && (
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: `linear-gradient(135deg, transparent 40%, ${color}66 50%, transparent 60%)`,
          backgroundSize: '300% 300%',
          animation: 'holographic 4s infinite linear'
        }} />
      )}

      {/* TITLE 7: THE PRIMORDIAL - THE OVERLORD ASCENSION (BLAR-BLAR VERSION) */}
      {titleIndex >= 6 && (
        <>
          {/* Main Singularity Core - Inti Energi di Tengah */}
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%',
            background: `radial-gradient(circle at center, ${color}22 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'overlay'
          }} />

          {/* Hyper-Aura Rings - Lingkaran Energi Dahsyat */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px', transform: 'translate(-50%, -50%)' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ 
                position: 'absolute', inset: `${i * -20}px`, 
                border: `1px solid ${color}${i % 2 === 0 ? '66' : '22'}`, 
                borderRadius: '50%',
                animation: `spinSlow ${5 + i * 2}s infinite ${i % 2 === 0 ? 'linear' : 'linear reverse'}`,
                boxShadow: `0 0 20px ${color}33`
              }} />
            ))}
          </div>

          {/* Lightning Sparks - Percikan Listrik Digital */}
          <div style={{ position: 'absolute', inset: 0 }}>
             {[...Array(5)].map((_, i) => (
               <div key={i} style={{ 
                 position: 'absolute', 
                 width: '40px', height: '1px', 
                 background: color,
                 left: `${Math.random() * 80 + 10}%`, 
                 top: `${Math.random() * 80 + 10}%`,
                 transform: `rotate(${Math.random() * 360}deg)`,
                 boxShadow: `0 0 15px ${color}`,
                 animation: 'flare 0.2s infinite',
                 animationDelay: `${Math.random() * 5}s`
               }} />
             ))}
          </div>

          {/* Rainbow Border Glow (Final Overlord Touch) */}
          <div style={{ 
            position: 'absolute', inset: '-2px', 
            borderRadius: '30px',
            padding: '2px',
            background: `conic-gradient(from 0deg, ${color}, #fff, ${color}, #000, ${color})`,
            animation: 'spinSlow 3s infinite linear',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: 0.8
          }} />
        </>
      )}
    </div>
  );
};

const allTitlesDB = {
  'r1': { icon: "🛡️", color: "#94a3b8" },
  'r2': { icon: "🏹", color: "#22d3ee" },
  's1': { icon: "📜", color: "#4ade80" },
  'w1': { icon: "🐟", color: "#60a5fa" },
  // Tambahin ID piala lainnya di sini bos...
};
export default function Badges({ userTransactions = 1000, userName = "ZYAN", walletAddress = "0x71C...3a2f" }) {
  
  // FUNGSI DOWNLOAD SAKTI
  const downloadAsPNG = async (id, cardName) => {
    const node = document.getElementById(id);
    if (!node) return;

    try {
      // Kita "moto" elemennya pake toPng
      const dataUrl = await toPng(node, { 
        quality: 1,
        pixelRatio: 3, // Biar super jernih pas di-zoom
        backgroundColor: '#000', // Pastiin background gak transparan pas di HP
      });

      const link = document.createElement('a');
      link.download = `EVOCARD_STORY_${cardName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal download bos:', err);
    }
  };

  const titles = [
    { name: 'THE INITIATE', min: 1, icon: '🌑' },
    { name: 'THE EXPLORER', min: 50, icon: '🛰️' },
    { name: 'THE TRADER', min: 150, icon: '📈' },
    { name: 'THE STRATEGIST', min: 400, icon: '🧩' },
    { name: 'THE WHALE', min: 750, icon: '🐋' },
    { name: 'THE APEX WHALE', min: 1500, icon: '🔱' },
    { name: 'THE PRIMORDIAL', min: 3000, icon: '⚛️' },
  ];

  const badgeLevels = [
  { lvl: 1, name: 'THE EXPLORER', grad: 'linear-gradient(135deg, #047857, #0369a1)', text: '#34d399', req: 1 },
  { lvl: 2, name: 'THE VANGUARD', grad: 'linear-gradient(135deg, #0369a1, #581c87)', text: '#7dd3fc', req: 50 },
  { lvl: 3, name: 'GOLDEN ELITE', grad: 'linear-gradient(135deg, #581c87, #ca8a04)', text: '#fbbf24', req: 150 },
  { lvl: 4, name: 'THE ARCHITECT', grad: 'linear-gradient(135deg, #b91c1c, #ca8a04)', text: '#f87171', req: 400 }
];

  const currentTitle = [...titles].reverse().find(t => userTransactions >= t.min)?.name || 'THE INITIATE';

  const currentTitleIndex = titles.findIndex(t => t.name === currentTitle);
  return (
  <div style={{ animation: 'fadeIn 0.6s ease', color: '#fff', padding: '60px 40px', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <style>{`
        .evo-card { 
          width: 250px; 
          height: 444px; 
          border-radius: 30px; 
          padding: 2.5px; 
          transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1); 
          position: relative; 
          overflow: visible; 
          background: transparent; 
          border: none; 
          cursor: pointer;
        }
        
        .card-unlocked:hover { 
          transform: translateY(-20px) scale(1.03) rotateY(12deg); 
          z-index: 10; 
          box-shadow: 0 40px 100px var(--card-glow); 
        }

        .analytics-container { display: flex; gap: 30px; margin-bottom: 60px; }
        .unified-wrapper { display: flex; gap: 60px; }

        .evo-inner { 
          width: 100%; 
          height: 100%; 
          border-radius: 28px; 
          padding: 30px; 
          display: flex; 
          flex-direction: column; 
          position: relative; 
          overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.08); 
          z-index: 1; 
          background-size: 30px 30px;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
        }

        @keyframes pulseRadar { 0% { transform: scale(0.6); opacity: 0.9; } 100% { transform: scale(2.8); opacity: 0; } }
        .fx-pulse { position: absolute; inset: 0; border: 3px solid var(--card-color); border-radius: 50%; animation: pulseRadar 3.5s ease-out infinite; }
        .fx-orbit { position: absolute; width: 6px; height: 6px; background: var(--card-color); border-radius: 50%; animation: orbitSpin 4s linear infinite; }
        .fx-glitch { position: absolute; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--card-color), transparent); opacity: 0.3; animation: glitchLine 2s linear infinite; }

        @keyframes scanline { 0% { top: -100%; } 100% { top: 200%; } }
        .fx-scan { position: absolute; width: 100%; height: 60px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent); opacity: 0.1; animation: scanline 4s linear infinite; }
        
        @keyframes warpSpeed {
  0% { transform: translateY(-100%) scaleY(0.1); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(100%) scaleY(2); opacity: 0; }
}

@keyframes nebulaPulse {
  0% { filter: hue-rotate(0deg) blur(10px); transform: scale(1); opacity: 0.3; }
  50% { filter: hue-rotate(180deg) blur(20px); transform: scale(1.2); opacity: 0.5; }
  100% { filter: hue-rotate(360deg) blur(10px); transform: scale(1); opacity: 0.3; }
}

@keyframes shatter {
  0% { clip-path: inset(0% 0% 0% 0%); }
  25% { clip-path: inset(0% 2% 0% 0%); transform: translateX(2px); }
  50% { clip-path: inset(0% 0% 0% 2%); transform: translateX(-2px); }
  75% { clip-path: inset(2% 0% 0% 0%); transform: translateY(1px); }
  100% { clip-path: inset(0% 0% 0% 0%); }
}

@keyframes flare {
  0%, 100% { opacity: 0.5; stroke-width: 1px; }
  50% { opacity: 1; stroke-width: 3px; }
}

@keyframes rainbowShift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* Efek Fog untuk Explorer */
@keyframes neonFog {
  0% { filter: blur(8px) opacity(0.3); transform: scale(1); }
  50% { filter: blur(15px) opacity(0.6); transform: scale(1.1); }
  100% { filter: blur(8px) opacity(0.3); transform: scale(1); }
}

/* Efek Prism Refraction */
@keyframes prismShift {
  0% { stop-color: var(--color); }
  33% { stop-color: #ff00ff; }
  66% { stop-color: #00ffff; }
  100% { stop-color: var(--color); }
}

/* AI Scan Line */
@keyframes aiScan {
  0% { top: -10%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 110%; opacity: 0; }
}

/* Liquid Chrome Flow */
@keyframes liquidFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

        .scroll-wrapper { 
          display: flex; 
          gap: 50px; 
          overflow-x: auto; 
          padding: 100px 40px 120px 40px; 
          scrollbar-width: none; 
          perspective: 1000px; 
          overflow-y: visible !important;
          margin-top: -10px;
        }
        .scroll-wrapper::-webkit-scrollbar { display: none; }

        .metric-card { background: rgba(20,20,20,0.5); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.08); padding: 35px; border-radius: 35px; border-left: 5px solid #a855f7; }
        .gen-btn-premium { width: 100%; padding: 18px; border-radius: 16px; background: #000; color: #fff; border: 1px solid var(--card-color); font-weight: 1000; font-size: 11px; letter-spacing: 4px; cursor: pointer; transition: 0.4s; text-transform: uppercase; }
        .gen-btn-premium:hover:not(:disabled) { background: var(--card-color); color: #000; box-shadow: 0 0 30px var(--card-color); transform: translateY(-3px); }
      `}</style>

      {/* --- DASHBOARD HEADER --- */}
      <div className="analytics-container">
        <div className="metric-card" style={{ flex: 1.8 }}>
          <div className="label-sm" style={{fontSize: '11px', opacity: 0.4, letterSpacing: '4px', marginBottom: '15px', fontWeight: '900'}}>NODE IDENTITY</div>
          <div style={{ fontSize: '32px', fontWeight: '1000', fontFamily: 'monospace', background: 'linear-gradient(90deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{walletAddress}</div>
          <div style={{ display: 'flex', gap: '50px', marginTop: '25px' }}>
            <div><div className="label-sm" style={{fontSize: '9px', opacity: 0.4}}>HOLDER</div><div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>{userName}</div></div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '50px' }}><div className="label-sm" style={{fontSize: '9px', opacity: 0.4}}>CURRENT RANK</div><div style={{ fontSize: '15px', fontWeight: '900', color: '#34d399' }}>{currentTitle}</div></div>
          </div>
        </div>
        <div className="metric-card" style={{ flex: 1, textAlign: 'right', borderLeftColor: '#34d399' }}>
          <div className="label-sm" style={{fontSize: '11px', opacity: 0.4, letterSpacing: '4px'}}>ACTIVITY SCORE</div>
          <div style={{ fontSize: '48px', fontWeight: '1000', margin: '5px 0' }}>{userTransactions} <span style={{fontSize: '18px', opacity: 0.3}}>VALS</span></div>
          <div className="stat-bar-bg" style={{height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', overflow: 'hidden'}}><div className="stat-bar-fill" style={{width: `${Math.min((userTransactions/1000)*100, 100)}%`, height:'100%', background: '#34d399', boxShadow: '0 0 20px #34d399'}}></div></div>
        </div>
      </div>

      <div className="unified-wrapper">
        <div style={{ width: '320px', background: 'rgba(255,255,255,0.01)', padding: '35px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
          <p style={{ fontSize: '13px', opacity: 0.4, letterSpacing: '5px', fontWeight: '1000', marginBottom: '35px', textAlign: 'center' }}>EVOLUTION DECK</p>
          {titles.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '18px', borderRadius: '20px', marginBottom: '14px', transition: '0.3s', border: userTransactions >= t.min ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid transparent', background: userTransactions >= t.min ? 'rgba(168, 85, 247, 0.08)' : 'transparent', opacity: userTransactions >= t.min ? 1 : 0.15 }}>
              <span style={{marginRight: '20px', fontSize: '24px'}}>{t.icon}</span>
              <span style={{fontWeight: '900', fontSize: '13px', letterSpacing: '1px'}}>{t.name}</span>
            </div>
          ))}
        </div>

        {/* STORY CARDS DISPLAY (9:16) - AREA SCROLL BABLAS */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', marginRight: '-120px' }}>
          <div className="scroll-wrapper custom-scroll" style={{ width: 'calc(100% + 40px)', overflowX: 'auto', display: 'flex' }}>
            {badgeLevels.map((lvl) => {
              const isUnlocked = userTransactions >= lvl.req;
              const cardColor = isUnlocked ? lvl.text : '#333';
              const cardId = `evocard-${lvl.lvl}`;
              
              return (
                <div key={lvl.lvl} className="card-stack" style={{ '--card-color': cardColor, '--card-glow': isUnlocked ? lvl.text + '55' : 'transparent' }}>
                  <div 
  id={cardId} 
  className={`evo-card ${isUnlocked ? 'card-unlocked' : 'card-locked'}`} 
  style={{ 
    // Efek border gradasi:
    background: isUnlocked ? lvl.grad : 'rgba(255,255,255,0.05)', 
    padding: '2px', // Ini ketebalan garis bordernya bos
    transition: '0.5s'
  }}
>
  <div 
  className="evo-inner" 
  style={{ 
    background: '#000', 
    width: '100%', 
    height: '100%', 
    borderRadius: '28px', 
    position: 'relative',
    overflow: 'hidden' // WAJIB ADA BIAR EFEK SCAN GAK OFF-SIDE
  }}
  >
    <CardVisualFX level={lvl.lvl} color={cardColor} isUnlocked={isUnlocked} />
    {/* Di sini baru layer TitleVisualBuff dan konten lainnya */}
    {isUnlocked && <TitleVisualBuff titleIndex={currentTitleIndex} color={cardColor} />}
    
    {/* Efek pendaran cahaya halus (Glow) di dalem area item */}
    {isUnlocked && (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 0%, ${lvl.text}15 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
    )}
                      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isUnlocked && lvl.lvl === 1 && <><div className="fx-pulse" /><div className="fx-pulse" style={{animationDelay:'1.5s'}}/></>}
                        {isUnlocked && lvl.lvl === 2 && <><div className="fx-orbit" /><div className="fx-orbit" style={{animationDelay:'2s'}}/></>}
                        {isUnlocked && lvl.lvl === 3 && (
                          <div style={{width:'100%', height:'100%'}}>
                            <div className="fx-glitch" style={{top:'20%'}}/>
                            <div className="fx-glitch" style={{top:'50%'}}/>
                            <div className="fx-glitch" style={{top:'80%'}}/>
                          </div>
                        )}
                        {isUnlocked && lvl.lvl === 4 && <div style={{position:'absolute', inset: 0, background: `radial-gradient(circle, ${cardColor}15 0%, transparent 70%)`}} />}
                      </div>

                      {isUnlocked && <TitleWatermark name={currentTitle} color={cardColor} />}

                      <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 5, alignItems: 'center' }}>
                        {/* --- BAGIAN YANG DIGANTI --- */}
<div className="rank-tag" style={{
  background: 'rgba(0,0,0,0.6)', 
  padding: '7px 14px', 
  borderRadius: '12px', 
  border: `1px solid ${cardColor}55`, 
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}}>
    <div className="rank-dot" style={{background: cardColor, width: '8px', height: '8px', borderRadius: '50%'}}></div>
    <span style={{ fontSize: '11px', fontWeight: '1000', color: '#fff', letterSpacing: '1px' }}>
      {isUnlocked ? `${userTransactions} TXS` : `REQ: ${lvl.req} TXS`}
    </span>
</div>
{/* ---------------------------- */}
                        <div style={{textAlign: 'right'}}>
                           <div style={{ color: cardColor, fontSize: '13px', fontWeight: '1000', letterSpacing: '1px' }}>{userName}</div>
                           <div style={{ fontSize: '10px', opacity: 0.6 }}>{isUnlocked ? currentTitle : 'LOCKED'}</div>
                        </div>
                      </div>

                      <h2 style={{ fontSize: '24px', fontWeight: '1000', marginTop: '35px', zIndex: 5, letterSpacing: '-0.5px', color: isUnlocked ? '#fff' : '#444', textShadow: isUnlocked ? `0 0 25px ${cardColor}66` : 'none' }}>{lvl.name}</h2>
                      
                      <div className="floating" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, marginTop: '20px' }}>
                        <div style={{ width: '130px', height: '130px' }}>
                            <TechIcon type={lvl.lvl} color={cardColor} isHovered={isUnlocked} />
                        </div>
                      </div>

                      {/* --- GANTI AREA AUTHORIZED JADI ACHIEVEMENT DISPLAY --- */}
<div style={{ zIndex: 5, marginTop: 'auto' }}>
  <div style={{ marginBottom: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '1000', opacity: 0.7, marginBottom: '8px' }}>
      <span>ENCRYPTION_STRENGTH</span>
      <span>{isUnlocked ? (70 + lvl.lvl * 7.5) : 0}%</span>
    </div>
    <div className="stat-bar-bg" style={{height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px'}}>
      <div className="stat-bar-fill" style={{ width: isUnlocked ? `${70 + lvl.lvl * 7.5}%` : '0%', background: cardColor, height: '100%', boxShadow: `0 0 20px ${cardColor}`, transition: '1.5s ease-out' }}></div>
    </div>
  </div>

  {/* --- AREA PAMER PIALA (GANTINYA AUTHORIZED) --- */}
  <div style={{ 
    background: isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.5)', 
    padding: '12px', 
    borderRadius: '20px', 
    border: `1px solid ${isUnlocked ? cardColor + '44' : 'rgba(255,255,255,0.05)'}`, 
    textAlign: 'center', 
    backdropFilter: 'blur(12px)',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    {isUnlocked ? (
      <>
        <p style={{ fontSize: '8px', fontWeight: '1000', color: cardColor, margin: '0 0 8px 0', letterSpacing: '2px' }}>ACHIEVEMENTS</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {/* Ambil piala dari localStorage atau Props */}
          {(JSON.parse(localStorage.getItem('unlocked_titles')) || ['r1']).slice(0, 3).map(id => (
            <div key={id} title={id} style={{
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${cardColor}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>
              {allTitlesDB[id]?.icon || "🏆"}
            </div>
          ))}
        </div>
      </>
    ) : (
      <p style={{ fontSize: '11px', fontWeight: '1000', color: '#444', margin: 0, letterSpacing: '4px' }}>ACCESS_DENIED</p>
    )}
  </div>
</div>
                    </div>
                  </div>

                  <div className="gen-bar-container" style={{'--card-color': cardColor, width: '100%', padding: '3px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <button className="gen-btn-premium" style={{'--card-color': cardColor}} disabled={!isUnlocked} onClick={() => downloadAsPNG(cardId, lvl.name)}>
                      {isUnlocked ? 'Generate Evocard' : 'Locked'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}