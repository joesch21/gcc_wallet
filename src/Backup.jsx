// File: src/Backup.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import './Membership.css';
import { useEffect, useState } from 'react';

export default function Backup() {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = location.state?.wallet;
  const mnemonic = location.state?.mnemonic;
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!wallet || !mnemonic) {
      console.warn('Missing wallet or mnemonic in navigation state');
    }
  }, [wallet, mnemonic]);

  const handleAcknowledge = () => {
    if (acknowledged) {
      navigate('/membership', { state: { wallet } });
    }
  };

  if (!wallet || !mnemonic) {
    return <div className="container">Missing wallet or mnemonic data.</div>;
  }

  return (
    <div className="backup-wrapper">
      <div className="backup-container">
        <h2>🔐 Backup Your Wallet</h2>
        <p>
          This is your seed phrase. Store it somewhere <strong>safe and offline</strong>.
        </p>
        <div className="mnemonic-box">{mnemonic}</div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            id="acknowledge"
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          I understand this is the <strong>only way</strong> to recover my wallet.
        </label>

        <button
          id="continue"
          className="button primary"
          onClick={handleAcknowledge}
          disabled={!acknowledged}
          style={{ marginTop: '1.5rem' }}
        >
          Continue to Membership
        </button>
      </div>
    </div>
  );
}
