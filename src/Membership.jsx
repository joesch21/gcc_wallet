// File: src/Membership.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from './firebase'
import { signOut } from 'firebase/auth'
import './App.css'

export default function Membership() {
  const location = useLocation()
  const navigate = useNavigate()
  const wallet = location.state?.wallet

  // If wallet is missing (e.g. user refreshed), redirect home
  if (!wallet) {
    navigate('/')
    return null
  }

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

  return (
    <div className="container">
      <h1>🎉 Welcome to the GCC Members Area</h1>
      <p>Your wallet address is:</p>
      <code style={{ wordBreak: 'break-word', fontSize: '1rem' }}>
        {wallet}
      </code>

      <p style={{ marginTop: '1.5rem' }}>
        You now hold a wallet eligible for the GCC Membership NFT.
      </p>

      <button className="button secondary" onClick={handleLogout}>
        Log out
      </button>
    </div>
  )
}
