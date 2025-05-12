// Home.jsx
import { useState } from 'react'
import { stripeCheckout } from './stripeHandler'
import { createWalletFromBackend } from './wallet'
import Login from './Login'
import './App.css'

function Home() {
  const [wallet, setWallet] = useState(null)
  const [status, setStatus] = useState('')
  const [userToken, setUserToken] = useState(null)

  const handleLogin = async (token) => {
    setUserToken(token)
    setStatus('Requesting wallet...')
    const newWallet = await createWalletFromBackend(token)
    setWallet(newWallet)
  }

  const handleBuyMembership = async () => {
    if (!wallet) {
      setStatus('Please create a wallet first.')
      return
    }

    setStatus('Processing payment...')
    const session = await stripeCheckout(wallet.address)
    window.location.href = session.url
  }

  if (!userToken) return <Login onLogin={handleLogin} />

  return (
    <div className="container">
      <h1>GCC Membership NFT</h1>
      {wallet && (
        <>
          <div className="wallet-info">Wallet: <code>{wallet.address}</code></div>
          <button onClick={handleBuyMembership} className="button secondary">
            Buy Membership NFT
          </button>
        </>
      )}
      <p className="status">{status}</p>
    </div>
  )
}

export default Home
