// File: src/Backup.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import './Membership.css'

export default function Backup() {
  const location = useLocation()
  const navigate = useNavigate()
  const wallet = location.state?.wallet
  const mnemonic = location.state?.mnemonic

  const handleAcknowledge = () => {
    navigate('/membership', { state: { wallet } })
  }

  if (!wallet || !mnemonic) {
    return <div className="container">Missing wallet or mnemonic data.</div>
  }

  return (
    <div className="container">
      <h2>🔐 Backup Your Wallet</h2>
      <p>This is your seed phrase. Store it somewhere <strong>safe and offline</strong>.</p>
      <div className="mnemonic-box">{mnemonic}</div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          id="acknowledge"
          onChange={(e) => {
            document.getElementById('continue').disabled = !e.target.checked
          }}
        />
        I understand this is the <strong>only way</strong> to recover my wallet.
      </label>

      <button
        id="continue"
        className="button primary"
        onClick={handleAcknowledge}
        disabled
        style={{ marginTop: '1.5rem' }}
      >
        Continue to Membership
      </button>
    </div>
  )
}
