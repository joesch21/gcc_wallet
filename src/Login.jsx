import { useState } from 'react';
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
  const navigate = useNavigate();

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
      const result = await createWalletFromBackend(token);

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
    <div className="login-container">
      <h1>{isRegister ? '🔑 Join the GCC Network' : '👋 Welcome Back'}</h1>
      <p className="subtext">
        {isRegister
          ? 'Create your crypto wallet in seconds. Receive 100 free GCC tokens and an exclusive Membership NFT.'
          : 'Log in to manage your wallet, NFTs, and unlock premium GCC features.'}
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
  );
}
