import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

export default function WalletOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletInfo, setWalletInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn('No user is logged in');
        navigate('/');
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet_overview`, {
          method: 'POST',
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
    });

    return () => unsubscribe();
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
      {walletInfo.nftIds && walletInfo.nftIds.length > 0 ? (
        <div className="nft-gallery">
          {walletInfo.nftIds.map((id) => (
            <div key={id} className="nft-card compact">
              <img
                src={`/nft${id}.png`}
                alt={`GCC NFT #${id}`}
                className="nft-image"
              />
              <p>GCC NFT #{id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No NFTs owned.</p>
      )}

      <h2>💰 GCC Token Balance</h2>
      <p>{walletInfo.balance ?? '0.0000'} GCC</p>

      <button className="button secondary" onClick={() => navigate('/membership')}>
        ← Back to Membership
      </button>
    </div>
  );
}
