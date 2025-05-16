import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

export default function WalletOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletInfo, setWalletInfo] = useState(null);

  useEffect(() => {
    const fetchWalletOverview = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet_overview`, {
          method: 'POST', // ✅ CORRECT METHOD
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        setWalletInfo(data);
      } catch (err) {
        console.error('❌ Failed to fetch wallet overview:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletOverview();
  }, [navigate]);

  if (loading) {
    return <div className="container">Loading your wallet details...</div>;
  }

  if (!walletInfo) {
    return <div className="container">❌ Failed to load wallet info.</div>;
  }

  return (
    <div className="container">
      <h1>🔐 Wallet Overview</h1>
      <p><strong>Address:</strong></p>
      <code className="wallet-address">{walletInfo.wallet}</code>

      <h2>🖼️ Owned NFTs</h2>
      <p>{walletInfo.nftCount ?? 0} NFT(s) owned</p>

      <h2>💰 GCC Token Balance</h2>
      <p>{walletInfo.balance ?? '0.0000'} GCC</p>

      <button className="button secondary" onClick={() => navigate('/membership')}>
        ← Back to Membership
      </button>
    </div>
  );
}
