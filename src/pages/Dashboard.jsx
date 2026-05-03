import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'; // Library buat konek ke Blockchain
import VisualCard from './VisualCard'; 
import Badges from './Badges';
// Titik dua kali (..) artinya keluar dulu dari folder 'pages', baru masuk ke 'components'
import ActivityChart from "../components/ActivityChart";
import TheJourney from './TheJourney';
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [selectedChain, setSelectedChain] = useState(null);
  const [userName, setUserName] = useState('');
  // 1. SET STATE AWAL JADI KOSONG BIAR GA OTOMATIS KEISI
  const [walletAddress, setWalletAddress] = useState(''); 
  // Set awal 0, nanti bakal keisi pas fetch data sukses
  const [userTransactions, setUserTransactions] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [isMinting, setIsMinting] = useState(false);

  const CONTRACT_ADDRESS = "0xD28dEf767f8f6E18e028093D978c6869E49f6669";
  const CONTRACT_ABI = [
    "function mintInitialBadge() external", // Sesuai kode Solidity baru
    "function userToToken(address) view returns (uint256)",
    "function getUserXP(address) view returns (uint256)"
  ];

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) navigate('/');
    else setUserName(name);
  }, [navigate]);

  // FUNGSI BUAT AMBIL DATA ASLI DARI WALLET
  const fetchWalletData = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // 1. Ambil Jumlah Transaksi (Data On-Chain)
      const txCount = await provider.getTransactionCount(address);
      setUserTransactions(txCount); 

      // 2. Ambil Saldo
      const balance = await provider.getBalance(address);
      setWalletBalance(ethers.formatEther(balance).substring(0, 6));

      // 3. TARIK DATA XP DARI SMART CONTRACT (FIXED)
      const soulContract = new ethers.Contract(
        CONTRACT_ADDRESS, 
        CONTRACT_ABI,
        provider
      );
      
      const xpReal = await soulContract.getUserXP(address);
      // Simpan XP ini ke state atau kirim ke TheJourney
      console.log("XP Real dari Blockchain:", xpReal.toString());

    } catch (err) {
      console.error("Error fetching on-chain data:", err);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        // LANGSUNG TARIK DATA ASLI BEGITU KONEK
        await fetchWalletData(accounts[0]);
      } catch (err) { console.error("User denied"); }
    } else { alert("MetaMask not found!"); }
  };

  const handleClaimNFT = async () => {
    if (!window.ethereum || !walletAddress) return alert("Please connect wallet first!");
    
    setIsMinting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      let userLvl = 1;
      if (userTransactions >= 400) userLvl = 4;
      else if (userTransactions >= 150) userLvl = 3;
      else if (userTransactions >= 50) userLvl = 2;

      console.log(`Minting NFT Level ${userLvl} for ${walletAddress}`);

      // MANGGIL TANPA PARAMETER SESUAI CONTRACT BARU
      const tx = await contract.mintInitialBadge();
      
      alert("Transaction Sent! Waiting for confirmation...");
      await tx.wait(); 
      
      alert(`Success! NFT Level ${userLvl} has been minted to your wallet.`);
    } catch (err) {
      console.error(err);
      alert("Minting failed: " + (err.reason || "User rejected/Error"));
    } finally {
      setIsMinting(false);
    }
  };

  const mainnetChains = [
    { name: 'BITCOIN', symbol: 'BTC', color: '#f7931a', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { name: 'MONAD', symbol: 'MON', color: '#a855f7', logo: '/monad_mainnet.png' }, 
    { name: 'SUI', symbol: 'SUI', color: '#6fbcf0', logo: 'https://cryptologos.cc/logos/sui-sui-logo.png' },
    { name: 'ETHEREUM', symbol: 'ETH', color: '#627eea', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { name: 'SOLANA', symbol: 'SOL', color: '#14f195', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { name: 'BASE', symbol: 'BASE', color: '#0052ff', logo: '/base.png' },
    { name: 'POLYGON', symbol: 'MATIC', color: '#8247e5', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
    { name: 'OPTIMISM', symbol: 'OP', color: '#ff0420', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png' },
  ];

  const testnetChains = [
    { name: 'MONAD TESTNET', symbol: 'MON_T', color: '#a855f7', logo: '/monad_testnet.png', faucet: 'https://faucet.monad.xyz/' },
    { name: 'SEI NETWORK', symbol: 'SEI', color: '#ff4444', logo: 'https://cryptologos.cc/logos/sei-sei-logo.png', faucet: 'https://atlantic-2.seinetwork.io/faucet' },
    { name: 'TRON TESTNET', symbol: 'TRX_T', color: '#ff0013', logo: 'https://cryptologos.cc/logos/tron-trx-logo.png', faucet: 'https://nileex.io/join/getNile' },
  ];

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
    { lvl: 1, name: 'EXPLORER', color: '#4fd1c5', req: 1 },
    { lvl: 2, name: 'VOYAGER', color: '#6366f1', req: 50 },
    { lvl: 3, name: 'GOLDEN ELITE', color: '#fbbf24', req: 150 },
    { lvl: 4, name: 'THE ARCHITECT', color: '#ff4d4d', req: 400 }
  ];

  // --- LOGIC TRACKER ---
  const getNextMilestone = (currentTxs) => {
    // Cari title yang min-nya di atas transaksi sekarang
    const next = titles.find(t => t.min > currentTxs);
    const current = [...titles].reverse().find(t => t.min <= currentTxs) || titles[0];
    
    if (!next) return { current, next: null, progress: 100 };
    
    const range = next.min - current.min;
    const progress = ((currentTxs - current.min) / range) * 100;
    
    return {
      current,
      next,
      progress: Math.min(progress, 100),
      remaining: next.min - currentTxs
    };
  };

  const milestone = getNextMilestone(userTransactions);
  const ms = {
  container: {
    background: 'rgba(168, 85, 247, 0.05)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '20px',
    padding: '25px',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden'
  },
  label: { fontSize: '9px', letterSpacing: '2px', opacity: 0.5, fontWeight: '800' },
  rankName: { fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' },
  nextName: { fontSize: '14px', fontWeight: '800', color: '#a855f7', marginTop: '4px' },
  maxRank: { color: '#fbbf24', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' },
  barBg: { height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', position: 'relative', overflow: 'hidden', marginTop: '15px' },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' },
  txCount: { fontSize: '11px', fontWeight: '800', opacity: 0.7 },
  remaining: { fontSize: '11px', fontWeight: '800', color: '#a855f7', fontStyle: 'italic' }
};

  return (
    <div style={s.page}>
      <div style={s.bgWrapper}>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;400;600;800&display=swap');
        .orb { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(120px); opacity: 0.12; z-index: 1; animation: float 25s infinite alternate ease-in-out; }
        .orb-1 { background: #a855f7; top: -10%; left: -5%; }
        .orb-2 { background: #4f46e5; bottom: -10%; right: -5%; animation-delay: -7s; }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(120px, 80px) scale(1.15); } }
        
        .chain-card { 
          background: rgba(10, 10, 10, 0.85); 
          backdrop-filter: blur(10px); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          cursor: pointer; padding: 22px; border-radius: 16px; display: flex; align-items: center; gap: 15px; position: relative;
        }
        
        .bar-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmerMove 2s infinite;
        }
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        ${[...mainnetChains, ...testnetChains].map(c => `
          .hover-${c.symbol}:hover { 
            border-color: ${c.color} !important; 
            box-shadow: 0 0 25px ${c.color}66, inset 0 0 10px ${c.color}22;
            transform: translateY(-8px) scale(1.02);
            background: rgba(15, 15, 15, 0.95);
          }
        `).join('')}

        .custom-scroll::-webkit-scrollbar { display: none; }
        .title-row { display: flex; align-items: center; padding: 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); transition: 0.3s; }
        .title-active { border-left: 4px solid #a855f7; background: rgba(168, 85, 247, 0.1); color: #fff; }
      `}</style>

      {/* SIDEBAR */}
      <div style={s.sidebar}>
        <div style={s.logoMini}>Soulbadge</div>
        <div style={s.navGroup}>
          {['OVERVIEW', 'BADGES', 'ACHIEVMENT'].map((item) => (
            <div key={item} onClick={() => setActiveTab(item)} style={activeTab === item ? {...s.navItem, ...s.navActive} : s.navItem}>
              {item}
            </div>
          ))}
        </div>
        <div style={s.logout} onClick={() => {localStorage.clear(); navigate('/');}}>LOGOUT</div>
      </div>

      <div className="custom-scroll" style={s.mainContent}>
        {/* OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ position: 'relative', zIndex: 10, animation: 'fadeIn 0.5s ease', paddingBottom: '160px' }}>
            <header style={{ marginBottom: '50px' }}>
              <h1 style={{ fontSize: '38px', margin: 0 }}>Welcome, <span style={s.nameGradient}>{userName}</span></h1>
              <p style={s.tagline}>ENJOY YOUR PORTFOLIO VISUAL INTERFACE ACTIVE</p>
            </header>

            {/* MILESTONE TRACKER - DEWA LEVEL */}
<div style={ms.container}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-end' }}>
    <div>
      <span style={ms.label}>CURRENT RANK</span>
      <div style={ms.rankName}>{milestone.current.icon} {milestone.current.name}</div>
    </div>
    {milestone.next ? (
      <div style={{ textAlign: 'right' }}>
        <span style={ms.label}>NEXT DESTINATION</span>
        <div style={ms.nextName}>{milestone.next.name} {milestone.next.icon}</div>
      </div>
    ) : (
      <div style={ms.maxRank}>MAX LEVEL REACHED ⚛️</div>
    )}
  </div>
    {/* Sesudah Milestone Bar */}
<div style={{ marginTop: '30px' }}>
  <ActivityChart color="#a855f7" /> 
</div>
  {/* Progress Bar Container */}
  <div style={ms.barBg}>
    <div style={{ 
      ...ms.barFill, 
      width: `${milestone.progress}%`,
      boxShadow: `0 0 20px #a855f766`
    }}>
      <div className="bar-shimmer" />
    </div>
  </div>
</div>

            <p style={s.sectionLabel}>MAINNET NETWORKS</p>
            <div style={s.chainGrid}>
              {mainnetChains.map((c) => (
                <div key={c.name} className={`chain-card hover-${c.symbol}`} onClick={() => setSelectedChain(c)}>
                  <img src={c.logo} style={s.coinImg} alt={c.name} />
                  <div>
                    <div style={{fontSize: '12px', fontWeight: '800'}}>{c.name}</div>
                    <div style={{fontSize: '9px', opacity: 0.4}}>STABLE CONNECTION</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{...s.sectionLabel, marginTop: '40px'}}>TESTNET & DEVNET</p>
            <div style={s.chainGrid}>
              {testnetChains.map((c) => (
                <div key={c.name} className={`chain-card hover-${c.symbol}`} onClick={() => setSelectedChain(c)}>
                  <img src={c.logo} style={s.coinImg} alt={c.name} />
                  <div>
                    <div style={{fontSize: '12px', fontWeight: '800'}}>{c.name}</div>
                    <div style={{fontSize: '9px', color: c.color, fontWeight: '700'}}>{c.name} ACTIVE</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedChain && (
              <div style={{...s.actionArea, border: `1px solid ${selectedChain.color}44` }}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px'}}>
                  <h2 style={{fontSize:'12px', color:selectedChain.color, letterSpacing:'3px', fontWeight:'800'}}>INTERFACE: {selectedChain.name}</h2>
                  <button onClick={() => setSelectedChain(null)} style={s.closeBtn}>✕ CLOSE</button>
                </div>
                <div style={{...s.inputContainer, borderColor: selectedChain.color }}>
                  {/* 2. HAPUS readOnly DAN TAMBAH onChange BIAR BISA DIKETIK MANUAL */}
                  <input 
                    placeholder="ENTER WALLET ADDRESS" 
                    style={s.input} 
                    value={walletAddress} 
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <button onClick={connectWallet} style={{...s.connectBtn, background: selectedChain.color}}>CONNECT</button>
                </div>
                <button 
                  style={{...s.loginFullBtn, opacity: isMinting ? 0.5 : 1}} 
                  onClick={handleClaimNFT}
                  disabled={isMinting}
                >
                  {isMinting ? "MINTING IN PROGRESS..." : "CLAIM NFT"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* BADGES */}
        {activeTab === 'BADGES' && (
          <Badges userTransactions={userTransactions} />
        )}

        {activeTab === 'ACHIEVMENT' && (
          <TheJourney 
            userTransactions={userTransactions} 
            titles={titles} 
          />
        )}
      </div>

      <div style={s.faucetBar}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize:'9px', color:'#a855f7', fontWeight:'800'}}>RESOURCES</span>
          <span style={{fontSize:'12px', fontWeight:'800'}}>GAS FAUCET DIRECTORY</span>
        </div>
        <div style={{display:'flex', gap:'30px'}}>
          {testnetChains.map(t => (
            <a key={t.name} href={t.faucet} target="_blank" rel="noreferrer" style={{...s.faucetLink, color: t.color}}># {t.name}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { height: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden', position: 'relative' },
  bgWrapper: { position: 'absolute', inset: 0, zIndex: 0 },
  sidebar: { width: '240px', padding: '60px 40px', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#000', zIndex: 100 },
  logoMini: { fontSize: '24px', fontWeight: '800', color: '#a855f7', marginBottom: '80px' },
  navGroup: { flex: 1 },
  navItem: { color: 'rgba(255,255,255,0.3)', transition: '0.3s', cursor: 'pointer', fontWeight: '600', letterSpacing: '3px', fontSize: '11px', padding: '15px 0' },
  navActive: { color: '#fff', transform: 'translateX(8px)', textShadow: '0 0 15px #a855f7' },
  logout: { fontSize: '10px', opacity: 0.3, cursor: 'pointer', marginTop: 'auto', letterSpacing: '4px' },
  mainContent: { flex: 1, padding: '40px 80px', overflowY: 'auto',height: 'calc(100vh - 90px)', position: 'relative', zIndex: 10 },
  nameGradient: { background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' },
  tagline: { opacity: 0.5, fontSize: '14px', letterSpacing: '2px' },
  sectionLabel: { fontSize: '9px', letterSpacing: '3px', opacity: 0.3, margin: '30px 0 15px 0', fontWeight: '800', textTransform: 'uppercase' },
  chainGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
  coinImg: { width: '32px', height: '32px', objectFit: 'contain' },
  actionArea: { marginTop: '40px', maxWidth: '580px', padding: '40px', borderRadius: '24px', background: '#0a0a0a' },
  inputContainer: { display: 'flex', background: '#000', border: '2px solid', borderRadius: '14px', overflow: 'hidden' },
  input: { flex: 1, background: 'transparent', border: 'none', padding: '18px', color: '#fff', outline: 'none' },
  connectBtn: { border: 'none', padding: '0 25px', fontWeight: '800', cursor: 'pointer', color: '#000' },
  loginFullBtn: { width: '100%', marginTop: '20px', background: '#fff', color: '#000', border: 'none', padding: '22px', borderRadius: '14px', fontWeight: '800', letterSpacing: '6px', cursor: 'pointer' },
  closeBtn: { background: 'none', border: 'none', color: '#fff', opacity: 0.3, cursor: 'pointer' },
  faucetBar: { position: 'absolute', bottom: 0, left: '240px', right: 0, height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', background: '#0a0a0a', borderTop: '1px solid rgba(168, 85, 247, 0.2)', zIndex: 1000 },
  faucetLink: { fontSize: '11px', textDecoration: 'none', fontWeight: '800' }
};