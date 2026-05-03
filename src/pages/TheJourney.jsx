import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; 

// --- DATA QUEST (TETEP UTUH) ---
const masterQuestPool = [
  { id: 'q1', title: "📡 Network Scout", desc: "Lakukan 5 transaksi hari ini.", target: 5, xp: 50, icon: "📡" },
  { id: 'q2', title: "⛽ Gas Optimizer", desc: "Transaksi dengan gas < 20 gwei.", target: 1, xp: 30, icon: "⛽" },
  { id: 'q3', title: "🌊 Liquidity Wave", desc: "Add liquidity minimal 0.01 ETH.", target: 1, xp: 100, icon: "🌊" },
  { id: 'q4', title: "🌉 Bridge Master", desc: "Lakukan 2x Bridge ke Monad.", target: 2, xp: 80, icon: "🌉" },
  { id: 'q5', title: "🐳 Whale Watcher", desc: "Cek saldo wallet paus di Explorer.", target: 1, xp: 20, icon: "🐳" },
  { id: 'q6', title: "🔄 Swap Apprentice", desc: "Lakukan 3x Swap di DEX favorit.", target: 3, xp: 45, icon: "🔄" },
  { id: 'q7', title: "🛡️ Safety First", desc: "Revoke 1 smart contract permission.", target: 1, xp: 60, icon: "🛡️" },
  { id: 'q8', title: "📜 Contract Deployer", desc: "Coba deploy contract simpel di Testnet.", target: 1, xp: 200, icon: "📜" },
  { id: 'q9', title: "💎 NFT Collector", desc: "Mint 1 NFT gratisan hari ini.", target: 1, xp: 70, icon: "💎" },
  { id: 'q10', title: "⚡ Speed Runner", desc: "5 transaksi dalam waktu 10 menit.", target: 5, xp: 120, icon: "⚡" },
];

const titlesList = [
  { id: 'r1', name: "Initiate", reqXP: 0, reqQuest: 0, icon: "🛡️", color: "#94a3b8", category: 'rank', tier: 1, task: "Starting your journey" },
  { id: 'r2', name: "Scout", reqXP: 1000, reqQuest: 3, icon: "🏹", color: "#22d3ee", category: 'rank', tier: 2, task: "Complete 3 missions + 1k XP" },
  { id: 'r3', name: "Vanguard", reqXP: 5000, reqQuest: 10, icon: "⚔️", color: "#6366f1", category: 'rank', tier: 3, task: "Complete 10 missions + 5k XP" },
  { id: 'r4', name: "Commander", reqXP: 15000, reqQuest: 25, icon: "🎖️", color: "#a855f7", category: 'rank', tier: 4, task: "Complete 25 missions + 15k XP" },
  { id: 's1', name: "Novice Tasker", reqXP: 0, reqQuest: 5, icon: "📜", category: 'hunter', tier: 1, color: "#4ade80", task: "Complete 5 missions" },
  { id: 's2', name: "Task Master", reqXP: 0, reqQuest: 20, icon: "⚱️", category: 'hunter', tier: 2, color: "#22c55e", task: "Complete 20 missions" },
  { id: 's3', name: "Legendary Grinder", reqXP: 0, reqQuest: 50, icon: "👑", category: 'hunter', tier: 3, color: "#fbbf24", task: "Complete 50 missions" },
  { id: 's4', name: "Mission God", reqXP: 0, reqQuest: 100, icon: "⛩️", category: 'hunter', tier: 4, color: "#f43f5e", task: "Complete 100 missions" },
  { id: 'w1', name: "Small Fry", reqXP: 2000, reqQuest: 0, icon: "🐟", category: 'whale', tier: 1, color: "#60a5fa", task: "Reach 2k XP" },
  { id: 'w2', name: "Dolphin", reqXP: 10000, reqQuest: 0, icon: "🐬", category: 'whale', tier: 2, color: "#3b82f6", task: "Reach 10k XP" },
  { id: 'w3', name: "Orca", reqXP: 30000, reqQuest: 0, icon: "🐋", category: 'whale', tier: 3, color: "#2563eb", task: "Reach 30k XP" },
  { id: 'w4', name: "Blue Whale", reqXP: 100000, reqQuest: 0, icon: "🐳", category: 'whale', tier: 4, color: "#1e40af", task: "Reach 100k XP" },
  { id: 'a1', name: "Daily User", reqXP: 500, reqQuest: 1, icon: "📅", category: 'active', tier: 1, color: "#fb923c", task: "First day active" },
  { id: 'a2', name: "Week Warrior", reqXP: 3000, reqQuest: 7, icon: "🔥", category: 'active', tier: 2, color: "#f97316", task: "7 days of activity" },
  { id: 'a3', name: "Monthly Titan", reqXP: 12000, reqQuest: 30, icon: "🏔️", category: 'active', tier: 3, color: "#ea580c", task: "30 days of activity" },
  { id: 'x1', name: "Early Bird", reqXP: 100, reqQuest: 1, icon: "🌅", category: 'special', tier: 1, color: "#f87171", task: "First mission completed" },
  { id: 'x2', name: "Monad Addict", reqXP: 50000, reqQuest: 75, icon: "🧬", category: 'special', tier: 2, color: "#a855f7", task: "75 Missions + 50k XP" },
];

export default function TheJourney() {
  const [dailyQuests, setDailyQuests] = useState([]);
  const walletAddress = localStorage.getItem('userAddress');

  const { data: realTxCount = 0 } = useQuery({
    queryKey: ['userTxs', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return 0;
      const res = await fetch(`https://api.monad-explorer.com/address/${walletAddress}/tx-count`);
      const data = await res.json();
      return data.count || 0;
    },
    enabled: !!walletAddress,
    refetchInterval: 15000 
  });

  const [userXP, setUserXP] = useState(() => Number(localStorage.getItem('monad_xp')) || 0);
  const [claimedIds, setClaimedIds] = useState(() => JSON.parse(localStorage.getItem('claimed_quests')) || []);
  const [unlockedTitles, setUnlockedTitles] = useState(() => JSON.parse(localStorage.getItem('unlocked_titles')) || ['r1']);

  useEffect(() => {
    localStorage.setItem('monad_xp', userXP);
    localStorage.setItem('claimed_quests', JSON.stringify(claimedIds));
    localStorage.setItem('unlocked_titles', JSON.stringify(unlockedTitles));
    window.dispatchEvent(new Event('storage'));
  }, [userXP, claimedIds, unlockedTitles]);

  useEffect(() => {
    const generateDailyQuests = () => {
      const now = new Date();
      const dateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      let seed = 0;
      for (let i = 0; i < dateString.length; i++) seed += dateString.charCodeAt(i);
      const shuffled = [...masterQuestPool].sort(() => {
        seed = (seed * 9301 + 49297) % 233280;
        return (seed / 233280) - 0.5;
      });
      setDailyQuests(shuffled.slice(0, 10)); // Lu bisa taro misi sebanyak apa pun sekarang
    };
    generateDailyQuests();
  }, []);

  const handleClaim = (id, xp) => {
    if (!claimedIds.includes(id)) {
      setUserXP(prev => prev + xp);
      setClaimedIds(prev => [...prev, id]);
    }
  };

  const handleClaimTitle = (id) => {
    if (!unlockedTitles.includes(id)) {
      setUnlockedTitles(prev => [...prev, id]);
    }
  };

  const topBadges = Object.values(
    unlockedTitles.reduce((acc, id) => {
      const t = titlesList.find(x => x.id === id);
      if (!t) return acc;
      if (!acc[t.category] || t.tier > acc[t.category].tier) {
        acc[t.category] = t;
      }
      return acc;
    }, {})
  );

  const styles = {
    // LAYAR UTAMA: KUNCI TOTAL (Gak bisa scroll)
    pageWrapper: { 
        height: '100vh', 
        width: '100%', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        paddingBottom: '20px'
    },
    headerText: { flexShrink: 0, marginBottom: '20px' },
    container: { 
      display: 'grid', 
      gridTemplateColumns: '1.6fr 1fr', 
      gap: '25px',
      width: '100%',
      flex: 1, // Ngabisin sisa layar
      overflow: 'hidden' // Biar container gedenya gak scroll
    },
    glass: {
      background: 'rgba(15, 15, 15, 0.7)', 
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.05)', 
      borderRadius: '24px',
      padding: '25px', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden' // Penting!
    },
    // AREA LIST: HANYA INI YANG BISA SCROLL
    scrollArea: { 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: '8px',
        marginTop: '10px'
    },
    badgeDisplay: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* CSS internal buat sembunyiin scrollbar biar estetik tapi tetep fungsi */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
        .custom-scroll:hover::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.5); }
      `}</style>

      <div style={styles.headerText}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: 0 }}>
          THE <span style={{ color: '#a855f7' }}>JOURNEY</span>
        </h1>
        <p style={{ fontSize: '11px', color: '#fff', opacity: 0.5, letterSpacing: '2px' }}>
          ON-CHAIN STATUS
        </p>
      </div>

      <div style={styles.container}>
        {/* KOLOM KIRI: MISSIONS */}
        <div style={styles.glass}>
           <h3 style={{ fontSize: '11px', opacity: 0.5, fontWeight: '800' }}>MISSIONS</h3>
           <div className="custom-scroll" style={styles.scrollArea}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dailyQuests.map((q) => {
                  const isDone = realTxCount >= q.target;
                  const isClaimed = claimedIds.includes(q.id);
                  return (
                    <div key={q.id} style={itemStyle(isDone, isClaimed)}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ fontSize: '20px' }}>{q.icon}</div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '13px', color: isClaimed ? '#22c55e' : '#fff' }}>{q.title}</div>
                          <div style={{ fontSize: '10px', opacity: 0.4 }}>{q.desc}</div>
                        </div>
                      </div>
                      <button onClick={() => handleClaim(q.id, q.xp)} disabled={!isDone || isClaimed} style={btnStyle(isDone, isClaimed)}>
                          {isClaimed ? '✓' : (isDone ? 'CLAIM' : `${realTxCount}/${q.target}`)}
                      </button>
                    </div>
                  );
                })}
              </div>
           </div>
        </div>

        {/* KOLOM KANAN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          {/* XP Box (No Scroll) */}
          <div style={{ ...styles.glass, borderLeft: '4px solid #a855f7', flexShrink: 0 }}>
             <p style={{ fontSize: '9px', opacity: 0.5, fontWeight: '900' }}>TOTAL XP</p>
             <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace' }}>{userXP.toLocaleString()}</div>
             <div style={styles.badgeDisplay}>
               {topBadges.map(t => (
                 <div key={t.id} style={{
                   width: '32px', height: '32px', borderRadius: '50%', background: `${t.color}22`,
                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                   border: `1px solid ${t.color}`
                 }}>{t.icon}</div>
               ))}
             </div>
          </div>

          {/* Achievement Box (Scrollable) */}
          <div style={styles.glass}>
            <p style={{ fontSize: '10px', opacity: 0.5, fontWeight: '800' }}>ACHIEVEMENTS</p>
            <div className="custom-scroll" style={styles.scrollArea}>
                {titlesList.map((t) => {
                  const isUnlocked = unlockedTitles.includes(t.id);
                  const canClaim = userXP >= t.reqXP && claimedIds.length >= t.reqQuest;
                  return (
                    <div key={t.id} style={titleCardStyle(isUnlocked)}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                         <div style={{ fontSize: '18px', opacity: isUnlocked ? 1 : 0.2 }}>{t.icon}</div>
                         <div>
                           <div style={{ fontSize: '12px', fontWeight: '900', color: isUnlocked ? t.color : '#444' }}>{t.name}</div>
                           <div style={{ fontSize: '9px', opacity: 0.5 }}>{t.task}</div>
                         </div>
                      </div>
                      {!isUnlocked ? (
                        <button onClick={() => handleClaimTitle(t.id)} disabled={!canClaim} style={titleBtnStyle(canClaim)}>
                          {canClaim ? 'CLAIM' : 'LOCKED'}
                        </button>
                      ) : <span style={{ fontSize: '8px', color: '#22c55e', fontWeight: '900' }}>✓</span>}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const itemStyle = (done, claimed) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '14px',
  background: claimed ? 'rgba(34, 197, 94, 0.03)' : (done ? 'rgba(251, 191, 36, 0.03)' : 'rgba(255,255,255,0.01)'),
  border: '1px solid rgba(255,255,255,0.05)'
});

const btnStyle = (done, claimed) => ({
  padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '900', fontSize: '9px',
  background: claimed ? '#000' : (done ? '#fbbf24' : 'rgba(255,255,255,0.05)'),
  color: claimed ? '#22c55e' : (done ? '#000' : '#444'), cursor: (done && !claimed) ? 'pointer' : 'default'
});

const titleCardStyle = (unlocked) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px',
  background: unlocked ? 'rgba(255,255,255,0.03)' : 'transparent',
  border: '1px solid rgba(255,255,255,0.03)', marginBottom: '8px'
});

const titleBtnStyle = (can) => ({
  padding: '4px 8px', borderRadius: '6px', border: 'none', fontSize: '8px', fontWeight: '900',
  background: can ? '#a855f7' : 'rgba(255,255,255,0.03)', color: can ? '#fff' : '#333', cursor: can ? 'pointer' : 'not-allowed'
});