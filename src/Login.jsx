import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { createWalletFromBackend } from './wallet';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [status, setStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const closeOnResize = () => setMobileMenuOpen(false);
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(isRegister ? 'Creating your crypto identity...' : 'Logging in...');

    try {
      let userCredential;

      if (isRegister) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        } catch (err) {
          if (err.code === 'auth/email-already-in-use') {
            setStatus('🔁 Email already registered. Logging you in...');
            userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
          } else {
            throw err;
          }
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      const token = await userCredential.user.getIdToken();
      const result = isRegister
        ? await createWalletFromBackend(token)
        : { address: userCredential.user.uid };

      if (result.mnemonic) {
        navigate('/backup', { state: { wallet: result.address, mnemonic: result.mnemonic } });
      } else {
        navigate('/membership', { state: { wallet: result.address } });
      }
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case 'auth/user-not-found':
          setStatus('⚠️ No account found. Try registering instead.');
          break;
        case 'auth/wrong-password':
          setStatus('❌ Incorrect password.');
          break;
        case 'auth/invalid-email':
          setStatus('❌ Invalid email address.');
          break;
        case 'auth/invalid-credential':
          setStatus('❌ Check your email and password.');
          break;
        default:
          setStatus(`❌ ${err.message}`);
          break;
      }
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="navbar-toggle" onClick={toggleMobileMenu}>
        ☰
      </button>

      {/* Side / Slide-Out Navbar */}
      <nav className={`navbar ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={closeMobileMenu}>Home</a>
        <a href="about.html" onClick={closeMobileMenu}>About</a>
        <a href="https://GIMPS.XYZ" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>PROJECT GIMP</a>
        <a href="https://bnb-gcc-apelp.onrender.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Stake LP</a>
        <a href="https://gcc-staking.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Stake NFT</a>
        <a href="https://www.gimpnftgallery.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Marketplace</a>
        <a href="mailto:GoldCondorCapital@hotmail.com" onClick={closeMobileMenu}>Contact</a>
        <a href="Nft_voting_proposal.html" onClick={closeMobileMenu}>Proposals</a>
      </nav>

      {/* Main Content */}
      <div className="login-container">
        <h1 className="login-title">
          <img src="/gcc-logo.png" alt="GCC Logo" className="gcc-logo" />
          {isRegister ? 'Join the GCC Network' : 'Gold Condor Capital'}
        </h1>

        <div className="info-box">
          <strong>Welcome to the GCC Ecosystem</strong>
          <p className="info-description">
            GCC is a digital commodity — home to unique NFT collectibles and membership rewards.
          </p>
          <ul>
            <li>🔐 Create a self-custodial wallet</li>
            <li>🎫 Buy a collectible NFT</li>
            <li>🎁 Get free GCC with every collectible purchased</li>
            <li>🎮 Coming soon: join our gamified journey to collect, stake, and vote</li>
          </ul>
        </div>

        <p className="subtext">
          {isRegister
            ? 'Create your crypto wallet in seconds. Purchase a collectible NFT and receive 100 free GCC tokens.'
            : 'Don’t have a wallet yet? Create one here — but REMEMBER to save your recovery phrase. No refunds. No replacements!'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="📧 Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />
          <button type="submit" className="button primary">
            {isRegister ? '🚀 Create Wallet' : '🔓 Log In'}
          </button>
        </form>

        <button onClick={() => setIsRegister(!isRegister)} className="button secondary">
          {isRegister
            ? '← Already have an account? Log in'
            : '→ New to GCC? Create an account'}
        </button>

        {status && <p className="status-text">{status}</p>}
      </div>
    </>
  );
}
