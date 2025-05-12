// File: src/Cancel.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Cancel() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 6000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container">
      <h1>❌ Payment Cancelled</h1>
      <p>Your GCC Membership NFT was not purchased.</p>
      <p>You can try again anytime by logging in and clicking “Buy Membership NFT.”</p>
      <p className="status">Returning to dashboard shortly...</p>
    </div>
  )
}
