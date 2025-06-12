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
    setStatus(isRegister ? 'Summoning your sovereign key...' : 'Crossing into the field...');

    try {
      let userCredential;

      if (isRegister) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        } catch (err) {
          if (err.code === 'auth/email-already-in-use') {
            setStatus('Email already marked. Re-entering the field...');
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
          setStatus('No record in the field. Consider initiating.');
          break;
        case 'auth/wrong-password':
          setStatus('🔒 The key does not match.');
          break;
        case 'auth/invalid-email':
          setStatus('❌ Not a valid sigil.');
          break;
        case 'auth/invalid-credential':
          setStatus('❌ The spell failed. Check sigils.');
          break;
        default:
          setStatus(`❌ ${err.message}`);
          break;
      }
    }
  };

  return (
    <>
      <button className="navbar-toggle" onClick={toggleMobileMenu}>☰</button>

      <nav className={`navbar ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={closeMobileMenu}>Home</a>
        <a href="https://www.gcc-bsc.online/about.html" onClick={closeMobileMenu}>About</a>
        <a href="https://GIMPS.XYZ" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>PROJECT GIMP</a>
        <a href="https://bnb-gcc-apelp.onrender.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Stake LP</a>
        <a href="https://gcc-staking.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Stake NFT</a>
        <a href="https://www.gimpnftgallery.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Marketplace</a>
        <a href="mailto:GoldCondorCapital@hotmail.com" onClick={closeMobileMenu}>Contact</a>
        <a href="https://www.gcc-bsc.online/Nft_voting_proposal.html" onClick={closeMobileMenu}>Proposals</a>
      </nav>

      <div className="login-container">
        <h1 className="login-title">
          <img src="/gcc-logo.png" alt="GCC Logo" className="gcc-logo" />
          {isRegister ? 'Initiate into the Field' : '🔱 Gold Condor Capital'}
        </h1>

        <div className="info-box">
          <strong>This isn’t Web3 as usual.</strong>
          <p className="info-description">
            GCC is not a product. It’s a sovereign system. A field of refusal. A ritual of becoming.
          </p>
          <ul>
            <li>🔐 Forge your self-custodial wallet</li>
            <li>🦴 Claim your first artifact (NFT)</li>
            <li>💰 Receive GCC tokens upon crossing</li>
            <li>🔮 Coming soon: rituals of staking, choice, and myth</li>
          </ul>
        </div>

        <p className="subtext">
          {isRegister
            ? 'Forge your key. Mark your entry. Do not lose your sigil — no remints, no rescue.'
            : 'Already marked? Re-enter the field and continue becoming.'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="📧 Your sigil (email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="🔒 Your secret key (password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />
          <button type="submit" className="button primary">
            {isRegister ? '🌀 Begin Initiation' : '🔓 Enter the Field'}
          </button>
        </form>

        <button onClick={() => setIsRegister(!isRegister)} className="button secondary">
          {isRegister
            ? '← Already initiated? Re-enter'
            : '→ New to the field? Begin here'}
        </button>

        {status && <p className="status-text">{status}</p>}
      </div>
    </>
  );
}
