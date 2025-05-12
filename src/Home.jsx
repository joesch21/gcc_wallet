// File: src/Home.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stripeCheckout } from './stripeHandler'
import { createWalletFromBackend } from './wallet'
import Login from './Login'
import './App.css'

function Home() {
  const [status, setStatus] = useState('')
  const [userToken, setUserToken] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (token) => {
    setUserToken(token)
    setStatus('Requesting wallet...')

    try {
      const newWallet = await createWalletFromBackend(token)

      setStatus('✅ Wallet ready! Redirecting...')
      setTimeout(() => {
        navigate('/membership', { state: { wallet: newWallet.address } })
      }, 500)
    } catch (err) {
      console.error('❌ Wallet creation failed:', err.message)
      setStatus('❌ Wallet creation failed.')
    }
  }

  if (!userToken) return <Login onLogin={handleLogin} />

  return (
    <div className="container">
      <h1>Preparing Membership...</h1>
      <p className="status">{status}</p>
    </div>
  )
}

export default Home
