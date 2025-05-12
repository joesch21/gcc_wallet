import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from './firebase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(isRegister ? 'Creating account...' : 'Logging in...')

    try {
      let userCredential

      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
      }

      const token = await userCredential.user.getIdToken()
      setStatus('✅ Success! Wallet is being prepared...')
      onLogin(token)
    } catch (err) {
      console.error(err)

      switch (err.code) {
        case 'auth/email-already-in-use':
          setStatus('⚠️ Email already registered. Switching to login...')
          setIsRegister(false)
          break
        case 'auth/user-not-found':
          setStatus('⚠️ No account found. Try registering instead.')
          break
        case 'auth/wrong-password':
          setStatus('❌ Incorrect password.')
          break
        case 'auth/invalid-email':
          setStatus('❌ Please enter a valid email address.')
          break
        case 'auth/invalid-credential':
          setStatus('❌ Invalid login. Please check your email and password.')
          break
        default:
          setStatus(`❌ ${err.message}`)
          break
      }
    }
  }

  const handleToggle = () => {
    setIsRegister(!isRegister)
    setStatus('')
  }

  return (
    <div className="container">
      <h2>{isRegister ? 'Create Your Account' : 'Welcome Back'}</h2>

      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        {isRegister
          ? 'Register with your email to create a crypto wallet and receive your GCC Membership NFT.'
          : 'Log in to access your wallet and claim your GCC Membership NFT.'}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit" className="button primary">
          {isRegister ? 'Register & Get Wallet' : 'Login to Wallet'}
        </button>
      </form>

      <button onClick={handleToggle} className="button secondary">
        {isRegister
          ? '← Already have an account? Log in'
          : '→ New here? Create an account'}
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  )
}
