// File: src/Membership.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from './firebase'
import { signOut } from 'firebase/auth'
import './Membership.css'

export default function Membership() {
  const location = useLocation()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(location.state?.wallet || null)
  const [loading, setLoading] = useState(!wallet)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = await auth.currentUser.getIdToken()
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create_wallet`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        setWallet(data.address)
      } catch (err) {
        console.error('Failed to fetch wallet:', err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    if (!wallet) fetchWallet()
  }, [wallet, navigate])

  const handleTestTransaction = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/test_transaction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      alert(`✅ ${data.message}`)
    } catch (err) {
      console.error('❌ Test transaction failed:', err)
      alert('❌ Test failed. Check console or try again.')
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  if (loading) return <div className="container">Loading membership data...</div>

  return (
    <div className="membership-container">
      <h1>🎉 Welcome to the GCC Members Area</h1>
      <p>Your wallet address:</p>
      <code className="wallet-address">{wallet}</code>

      <p>You now hold a wallet eligible for the GCC Membership NFT.</p>

      <div className="button-group">
        <button className="button primary" onClick={handleTestTransaction}>
          🔁 Trigger Test Transaction
        </button>
        <button className="button secondary" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
