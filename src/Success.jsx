// File: src/Success.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Success() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/membership')
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container">
      <h1>🎉 Payment Successful</h1>
      <p>Thanks for your purchase! Your NFT is being delivered...</p>
    </div>
  )
}
