// File: src/Membership.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from './firebase'
import { signOut } from 'firebase/auth'
import './Membership.css'
import { stripeCheckout } from './stripeHandler'

export default function Membership() {
  const location = useLocation()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(location.state?.wallet || null)
  const [loading, setLoading] = useState(!wallet)
  const [purchased, setPurchased] = useState(false)

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

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        const token = await auth.currentUser.getIdToken()
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/check_purchase`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        setPurchased(data.purchased)
      } catch (err) {
        console.error('Failed to check purchase status:', err)
      }
    }

    if (wallet) checkPurchase()
  }, [wallet])

  const handleSendNFT = async (tokenId) => {
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send_nft`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId }),
      })
      const data = await res.json()
      alert(`✅ ${data.message}`)
    } catch (err) {
      console.error('❌ NFT send failed:', err)
      alert('❌ Failed to send NFT. Check console or try again.')
    }
  }

  const handleBuyNFT = async () => {
    try {
      const result = await stripeCheckout(wallet)
      window.location.href = result.url
    } catch (err) {
      console.error('❌ Checkout failed:', err)
      alert('❌ Failed to start checkout session')
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

      <div className="nft-gallery">
        <div className="nft-card compact">
          <img src="/nft0.png" alt="NFT Token 0" className="nft-image" />
          <button className="button primary" onClick={() => handleSendNFT(0)} disabled={!purchased}>
            Send NFT #0
          </button>
        </div>
        <div className="nft-card compact">
          <img src="/nft1.png" alt="NFT Token 1" className="nft-image" />
          <button className="button primary" onClick={() => handleSendNFT(1)} disabled={!purchased}>
            Send NFT #1
          </button>
        </div>
      </div>

      <div className="button-group">
        <button className="button primary" onClick={handleBuyNFT}>
          💳 Buy NFT via Stripe
        </button>
        <button className="button secondary" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
