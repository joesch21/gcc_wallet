import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import './Membership.css';
import { stripeCheckout } from './stripeHandler';

const nftMetadata = {
  1: { priceUsd: 600, gccReward: 100 },
  2: { priceUsd: 600, gccReward: 100 },
  3: { priceUsd: 2400, gccReward: 400 },
  4: { priceUsd: 2400, gccReward: 400 },
  5: { priceUsd: 6000, gccReward: 1000 },
  6: { priceUsd: 6000, gccReward: 1000 },
};


export default function Membership() {
  const location = useLocation();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(location.state?.wallet || null);
  const [loading, setLoading] = useState(!wallet);
  const [purchased, setPurchased] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create_wallet`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setWallet(data.address);
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (!wallet) fetchWallet();
  }, [wallet, navigate]);

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/check_purchase`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setPurchased(data.purchased);
      } catch (err) {
        console.error('Failed to check purchase status:', err);
      }
    };

    if (wallet) checkPurchase();
  }, [wallet]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/available_nfts`);
        const data = await res.json();
        setAvailability(data);
      } catch (err) {
        console.error('❌ Failed to fetch availability:', err);
      }
    };

    fetchAvailability();
  }, []);

  const handleSendNFT = async (tokenId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send_nft`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId }),
      });
      const data = await res.json();
      alert(`✅ ${data.message}`);
    } catch (err) {
      console.error('❌ NFT send failed:', err);
      alert('❌ Failed to send NFT. Check console or try again.');
    }
  };

  const handleBuyNFT = async () => {
    try {
      const result = await stripeCheckout(wallet, selectedTokenId);
      window.location.href = result.url;
    } catch (err) {
      console.error('❌ Checkout failed:', err);
      alert('❌ Failed to start checkout session');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) return <div className="membership-container">Loading membership data...</div>;

  return (
    <div className="membership-container">
      <h1>🎉 Welcome to the GCC Members Area</h1>
      <p>Your wallet address:</p>
      <code className="wallet-address">{wallet}</code>

      <p>You now hold a wallet eligible for the GCC Membership NFT.</p>

      <div className="nft-carousel">
        {Object.entries(availability)
          .filter(([, isAvailable]) => isAvailable)
          .map(([id]) => {
            id = Number(id);
            const metadata = nftMetadata[id] || {};
            return (
              <div key={id} className="nft-card compact">
                <img src={`/nft${id}.png`} alt={`NFT Token ${id}`} className="nft-image" />
                <p className="nft-price">${(metadata.priceUsd / 100).toFixed(2)} USD</p>
                <p className="nft-reward">🎁 {metadata.gccReward} GCC FREE</p>

                <button
                  className={`button ${selectedTokenId === id ? 'primary' : 'secondary'}`}
                  onClick={() => setSelectedTokenId(id)}
                >
                  {selectedTokenId === id ? 'Selected' : `Select NFT #${id}`}
                </button>
              </div>
            );
          })}
      </div>

      <div className="button-group">
        <button
          className="button primary"
          disabled={selectedTokenId === null || availability[selectedTokenId] === false}
          onClick={handleBuyNFT}
        >
          💳 Buy Selected NFT
        </button>
        <button className="button secondary" onClick={handleLogout}>
          Log out
        </button>
        <Link to="/wallet">
          <button className="button secondary">🔍 View My Wallet</button>
        </Link>
      </div>

      {purchased && (
        <div className="button-group">
          <h3>🎁 You have purchased your NFT. Now you can claim it:</h3>
          {Object.keys(availability).map((id) => (
            <button
              key={id}
              className="button primary"
              onClick={() => handleSendNFT(Number(id))}
              disabled={!purchased || availability[id] === false}
            >
              Send NFT #{id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
