import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

export default function VisualCard({ data, onClaim, isMinting }) {
  const { lvl, name, color, isUnlocked, address: propsAddress } = data;
  const themeColor = color || '#a855f7';
  const cardRef = useRef(null);
  
  // Ambil address asli dari storage jika props kosong
  const realAddress = propsAddress || localStorage.getItem('userAddress') || '0x000...000';

  // --- KETENTUAN 2: AMBIL ACHIEVEMENT TERATAS ---
  const [topBadges, setTopBadges] = useState([]);

  const loadTopBadges = () => {
    const titlesList = [
      { id: 'r1', category: 'rank', tier: 1, icon: "🛡️" }, { id: 'r2', category: 'rank', tier: 2, icon: "🏹" },
      { id: 'r3', category: 'rank', tier: 3, icon: "⚔️" }, { id: 'r4', category: 'rank', tier: 4, icon: "🎖️" },
      { id: 's1', category: 'hunter', tier: 1, icon: "📜" }, { id: 's2', category: 'hunter', tier: 2, icon: "⚱️" },
      { id: 's3', category: 'hunter', tier: 3, icon: "👑" }, { id: 's4', category: 'hunter', tier: 4, icon: "⛩️" },
      { id: 'w1', category: 'whale', tier: 1, icon: "🐟" }, { id: 'w2', category: 'whale', tier: 2, icon: "🐬" },
      { id: 'w3', category: 'whale', tier: 3, icon: "🐋" }, { id: 'w4', category: 'whale', tier: 4, icon: "🐳" },
      { id: 'a1', category: 'active', tier: 1, icon: "📅" }, { id: 'a2', category: 'active', tier: 2, icon: "🔥" },
      { id: 'a3', category: 'active', tier: 3, icon: "🏔️" },
      { id: 'x1', category: 'special', tier: 1, icon: "🌅" }, { id: 'x2', category: 'special', tier: 2, icon: "🧬" },
    ];

    const unlockedIds = JSON.parse(localStorage.getItem('unlocked_titles')) || [];
    const filtered = Object.values(
      unlockedIds.reduce((acc, id) => {
        const t = titlesList.find(x => x.id === id);
        if (!t) return acc;
        if (!acc[t.category] || t.tier > acc[t.category].tier) {
          acc[t.category] = t;
        }
        return acc;
      }, {})
    );
    setTopBadges(filtered);
  };

  useEffect(() => {
    loadTopBadges();
    window.addEventListener('storage', loadTopBadges);
    return () => window.removeEventListener('storage', loadTopBadges);
  }, []);

  // --- KETENTUAN 4: DOWNLOAD ENGINE ---
  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!isUnlocked) return;
    
    const element = cardRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: '#050505',
      useCORS: true,
      scale: 3, // HD Quality
    });

    const link = document.createElement('a');
    link.download = `Soulbound-${name}-${realAddress.slice(0, 6)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getRankData = (level) => {
    const grades = {
      1: { title: "THE INITIATE", emblem: "⬡", rank: "G-01" },
      2: { title: "THE EXPLORER", emblem: "⬢", rank: "G-02" },
      3: { title: "THE TRADER", emblem: "⧓", rank: "G-03" },
      4: { title: "THE STRATEGIST", emblem: "⧔", rank: "G-04" },
      5: { title: "THE WHALE", emblem: "🐋", rank: "G-05" },
      6: { title: "THE APEX WHALE", emblem: "🔱", rank: "G-06" },
      7: { title: "THE PRIMORDIAL", emblem: "⚛️", rank: "G-07" }
    };
    return grades[level] || { title: "UNKNOWN", emblem: "❓", rank: "G-00" };
  };

  const rank = getRankData(lvl);

  const getCustomBg = (level) => {
    const encodedColor = encodeURIComponent(themeColor);
    switch (level) {
      case 1: case 2: 
        return `linear-gradient(${themeColor}11 1px, transparent 1px), linear-gradient(90deg, ${themeColor}11 1px, transparent 1px)`;
      case 3: case 4: 
        return `radial-gradient(${themeColor}33 1.5px, transparent 1.5px)`;
      default: 
        return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 10v20L20 40 0 30V10z' fill='none' stroke='${encodedColor}' stroke-opacity='0.15'/%3E%3C/svg%3E")`;
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`hologram-card lvl-${lvl} ${isUnlocked ? 'unlocked-hover' : 'locked-static'}`} 
      style={{
        ...s.cardFrame,
        borderColor: `${themeColor}66`,
        background: '#050505',
      }}
    >
      <div style={{
        ...s.bgLayer, 
        backgroundImage: getCustomBg(lvl),
        backgroundSize: lvl <= 2 ? '20px 20px' : 'auto',
        opacity: isUnlocked ? 0.7 : 0.2
      }} />

      <div style={{ ...s.emblemBg, color: themeColor, opacity: isUnlocked ? 0.06 : 0.02 }}>
        {rank.emblem}
      </div>

      <div style={s.sideGrades}>
        {[7,6,5,4,3,2,1].map(g => (
          <div key={g} style={{
            ...s.gradeItem, 
            color: lvl === g ? themeColor : 'rgba(255,255,255,0.1)',
            fontWeight: lvl === g ? '900' : '400',
            textShadow: lvl === g ? `0 0 8px ${themeColor}` : 'none'
          }}>
            {lvl === g ? '▶' : ''} G-0{g}
          </div>
        ))}
      </div>

      <div style={{ ...s.cornerGlow, background: `radial-gradient(circle, ${themeColor}88 0%, transparent 70%)` }} />

      <div style={s.content}>
        <div style={s.header}>
          <span style={{color: themeColor, fontWeight: '900', letterSpacing: '2px'}}>{rank.rank} PROTOCOL</span>
          <span style={s.walletId}>{realAddress?.slice(0,6)}...</span>
        </div>

        <h2 style={{...s.mainTitle, color: '#fff', textShadow: `0 0 15px ${themeColor}aa`}}>
          {name}
        </h2>

        <div style={s.hudContainer}>
            <div className={isUnlocked ? "spinning-ring" : ""} style={{
              ...s.hudRing, 
              borderColor: themeColor,
              borderRadius: lvl === 1 ? '50%' : lvl === 2 ? '12px' : '0',
              clipPath: lvl >= 3 && lvl <= 5 ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 
                        lvl >= 6 ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
            }}>
              <div style={{ 
                fontSize: '42px', 
                fontWeight: '100',
                color: '#fff',
                filter: isUnlocked ? `drop-shadow(0 0 15px ${themeColor})` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                 {rank.emblem}
              </div>
            </div>
            <div style={s.lvlLabel}>{rank.title}</div>
            
            {/* PAJANG ACHIEVEMENT (KETENTUAN 2) */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px', zIndex: 10 }}>
              {topBadges.map(b => (
                <span key={b.id} style={{ fontSize: '14px', filter: `drop-shadow(0 0 5px ${themeColor})` }}>{b.icon}</span>
              ))}
            </div>
            
            {lvl >= 5 && (
              <div 
                className={isUnlocked ? "pulse-aura" : ""} 
                style={{...s.staticAura, background: themeColor, opacity: isUnlocked ? 0.8 : 0.1}} 
              />
            )}
        </div>

        <div style={s.actionArea}>
          <div style={{...s.statusTag, color: isUnlocked ? themeColor : '#ff4444'}}>
              {isUnlocked ? `● ${rank.title} AUTHORIZED` : '■ ACCESS_RESTRICTED'}
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              disabled={!isUnlocked || isMinting}
              onClick={() => onClaim(lvl)}
              style={{
                ...s.claimBtn,
                flex: 1,
                background: isUnlocked ? themeColor : 'rgba(255,255,255,0.05)',
                color: isUnlocked ? '#000' : '#444',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                border: isUnlocked ? 'none' : '1px solid #222'
              }}
            >
              {isMinting ? 'MINTING...' : isUnlocked ? `CLAIM ${rank.title}` : 'LOCKED'}
            </button>

            {isUnlocked && (
              <button 
                onClick={handleDownload}
                style={{ ...s.claimBtn, width: '50px', background: '#fff', color: '#000' }}
              >
                ⬇️
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600;900&display=swap');
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.3); opacity: 0; } 100% { transform: scale(1); opacity: 0.3; } }
        .spinning-ring { animation: rotate 15s linear infinite; }
        .pulse-aura { position: absolute; width: 100px; height: 100px; border-radius: 50%; animation: pulse 4s infinite; filter: blur(30px); z-index: 1; }
        .unlocked-hover { transition: 0.4s cubic-bezier(0.25, 1, 0.5, 1); cursor: pointer; }
        .unlocked-hover:hover { transform: translateY(-12px); box-shadow: 0 40px 80px -20px ${themeColor}55; border-color: ${themeColor} !important; }
        .locked-static { transition: none !important; cursor: not-allowed !important; }
        .hologram-card { width: 300px; height: 465px; margin: 20px; position: relative; overflow: hidden; border: 1px solid; border-radius: 20px; flex-shrink: 0; }
      `}</style>
    </div>
  );
}

const s = {
  bgLayer: { position: 'absolute', inset: 0, zIndex: 0 },
  emblemBg: { position: 'absolute', top: '50%', left: '55%', transform: 'translate(-50%, -50%)', fontSize: '160px', zIndex: 0, pointerEvents: 'none', filter: 'blur(5px)' },
  sideGrades: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1 },
  gradeItem: { fontSize: '8px', letterSpacing: '1px', fontFamily: 'monospace' },
  cornerGlow: { position: 'absolute', inset: '-60px', filter: 'blur(80px)', zIndex: 0, opacity: 0.4 },
  content: { position: 'relative', zIndex: 2, padding: '35px 25px 35px 60px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', fontSize: '9px', letterSpacing: '2px', marginBottom: '30px', opacity: 0.6 },
  walletId: { fontFamily: 'monospace', opacity: 0.5 },
  mainTitle: { textAlign: 'center', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '30px' },
  hudContainer: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  hudRing: { width: '120px', height: '120px', border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2, background: 'rgba(5, 5, 5, 0.8)' },
  lvlLabel: { marginTop: '15px', fontSize: '11px', fontWeight: '900', opacity: 0.8, letterSpacing: '2px', textAlign: 'center', color: '#fff' },
  staticAura: { position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', filter: 'blur(30px)', zIndex: 1 },
  actionArea: { marginTop: 'auto', paddingTop: '20px' },
  statusTag: { fontSize: '9px', fontWeight: '900', textAlign: 'center', marginBottom: '15px', letterSpacing: '1px' },
  claimBtn: { padding: '18px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase', transition: '0.3s', border: 'none' }
};