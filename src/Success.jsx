// File: src/Success.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Success() {
  const navigate = useNavigate()

  useEffect(() => {
    // Optional: Redirect after a few seconds
    const timer = setTimeout(() => {
      navigate('/')
    }, 8000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container">
      <h1>🎉 Payment Successful!</h1>
      <p>Your GCC Membership NFT is being minted to your wallet.</p>
      <p>Check back shortly to see it in your account.</p>
      <p className="status">Redirecting you back to the dashboard...</p>
    </div>
  )
}
