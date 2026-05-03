import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          localStorage.setItem('userAddress', accounts[0]);
        }
      } catch (error) {
        console.error("User rejected the request");
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  const handleLogin = () => {
    if (name && address) {
      localStorage.setItem('userName', name);
      navigate('/dashboard');
    } else {
      alert("Please enter your name and connect your wallet first!");
    }
  };

  // Varian Animasi untuk Framer Motion
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Plus+Jakarta+Sans:wght@200;300;400;600;800&display=swap');

        /* AURA GLOW DI BELAKANG */
        .logo-aura {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%);
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
          filter: blur(60px);
        }

        .bg-logo {
  position: fixed;
  /* Lebarnya responsif: 80% layar di HP, tapi maksimal 800px di layar gede */
  width: min(800px, 80vw); 
  height: auto;

  /* RUMUS SAKTI CENTER */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 1;
  opacity: 0.15;
  pointer-events: none;
  filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.4));
  object-fit: contain;
}
        .glass-box {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        /* --- ANIMASI & EFEK HOLO --- */
        @keyframes holo-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .float-group {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .float-group:hover {
          transform: translateY(-5px);
        }

        .holo-bar {
          transition: all 0.5s ease;
          background-position: center;
          background-size: 200% auto;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          background-image: linear-gradient(#050505, #050505), linear-gradient(90deg, #a855f7, #a855f7);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          display: flex;
          align-items: center;
          border-radius: 12px;
          min-height: 58px;
        }

        .float-group:hover .holo-bar {
          border: 1px solid transparent !important;
          background-image: linear-gradient(#050505, #050505), 
                            linear-gradient(90deg, #a855f7, #06b6d4, #f472b6, #a855f7);
          animation: holo-shift 3s linear infinite;
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.4), 0 0 15px rgba(6, 182, 212, 0.2) !important;
        }

        /* --- TOMBOL LOGIN EMERALD --- */
        .login-btn {
          background: linear-gradient(90deg, #06b6d4, #10b981) !important;
          transition: all 0.4s ease;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          color: #fff;
          font-weight: 900;
          cursor: pointer;
          letter-spacing: 8px;
          border-radius: 14px;
          padding: 20px;
          width: 100%;
          font-size: 15px;
          margin-top: 10px;
        }

        .login-btn:hover {
          filter: brightness(1.2) saturate(1.2);
          box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 20px rgba(16, 185, 129, 0.4);
          letter-spacing: 12px;
        }

        .vintage-holo {
          font-family: 'Cormorant Garamond', serif;
          background: linear-gradient(to right, #fff 20%, #a855f7 40%, #06b6d4 60%, #fff 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 5s linear infinite;
          font-style: italic;
        }
        @keyframes shine { to { background-position: 200% center; } }

        .glow-footer {
          color: #fff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          transition: all 0.5s ease;
        }
      `}</style>

      <div className="logo-aura"></div>

      <motion.img 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeOut" }}
        src="/logo.png" 
        className="bg-logo" 
        alt="" 
      />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        style={s.content}
      >
        <motion.div variants={itemVars} style={s.header}>
          <h1 style={s.title} className="vintage-holo">Soulbadge</h1>
          <p style={s.subtitle}>explore the journey and express your contribution on web3</p>
        </motion.div>

        <motion.div 
          variants={itemVars}
          className="glass-box" 
          style={s.formContainer}
          whileHover={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.15)" }}
        >
          {/* BAR YOUR NAME */}
          <div className="float-group">
            <div className="holo-bar">
              <input 
                style={s.inputInternal} 
                placeholder="YOUR NAME" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* BAR WALLET ADDRESS */}
          <div className="float-group">
            <div className="holo-bar" style={{ paddingRight: '8px' }}>
              <input 
                style={s.inputInternal} 
                placeholder="WALLET ADDRESS" 
                value={address} 
                readOnly 
              />
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                style={s.connectBtn} 
                onClick={connectMetaMask}
              >
                {address ? 'CONNECTED' : 'CONNECT'}
              </motion.button>
            </div>
          </div>

          <motion.button 
            variants={itemVars}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="login-btn" 
            onClick={handleLogin}
          >
            LOGIN
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={s.footer}
        className="glow-footer"
      >
        I D E N T I T Y . &nbsp; 
        <span style={{
          color: '#a855f7', 
          textShadow: '0 0 20px rgba(168, 85, 247, 1)',
          fontWeight: '1000'
        }}>
          S O U L .
        </span> 
        &nbsp; W E B 3 .
      </motion.div>
    </div>
  );
}

const s = {
  page: { 
    height: '100vh', 
    backgroundColor: '#000', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative', 
    overflow: 'hidden', 
    fontFamily: '"Plus Jakarta Sans", sans-serif' 
  },
  content: { 
    zIndex: 10, 
    textAlign: 'center', 
    width: '100%' 
  },
  header: { 
    marginBottom: '30px' 
  },
  title: { 
    fontSize: '100px', 
    margin: 0, 
    letterSpacing: '-2px' 
  },
  subtitle: { 
    fontSize: '14px', 
    color: 'rgba(255, 255, 255, 0.4)', 
    marginTop: '5px', 
    fontWeight: '300', 
    letterSpacing: '5px', 
    fontStyle: 'italic' 
  },
  formContainer: { 
    width: '450px', 
    margin: '0 auto', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  inputInternal: { 
    background: 'transparent', 
    border: 'none', 
    padding: '18px 25px', 
    color: '#fff', 
    flex: 1, 
    outline: 'none', 
    fontSize: '11px', 
    letterSpacing: '3px', 
    fontFamily: 'inherit' 
  },
  connectBtn: { 
    backgroundColor: '#fff', 
    color: '#000', 
    border: 'none', 
    borderRadius: '8px', 
    padding: '10px 18px', 
    cursor: 'pointer', 
    fontSize: '10px', 
    fontWeight: '900',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease'
  },
  footer: { 
    position: 'absolute', 
    bottom: '25px', 
    fontSize: '10px', 
    letterSpacing: '4px', 
    fontWeight: '600', 
    opacity: 0.6, 
    color: '#fff' 
  }
};