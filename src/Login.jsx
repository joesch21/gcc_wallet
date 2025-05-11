import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Authenticating...')

    try {
      const userCredential = isRegister
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password)

      const token = await userCredential.user.getIdToken()
      setStatus('Logged in successfully!')
      onLogin(token) // Pass token up to App

    } catch (err) {
      console.error(err)
      setStatus(err.message)
    }
  }

  return (
    <div className="container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit" className="button primary">
          {isRegister ? 'Create Account' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="button secondary">
        {isRegister ? 'Already have an account? Log in' : 'New? Create account'}
      </button>
      <p className="status">{status}</p>
    </div>
  )
}
