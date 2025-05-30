import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  const params = new URLSearchParams(window.location.search);
  const wallet = params.get('wallet');
  const tokenId = params.get('token');

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          navigate('/membership');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="container">
      <h1>🎉 Payment Successful</h1>
      <p>Your NFT <strong>#{tokenId}</strong> has been delivered to:</p>
      <p><code>{wallet}</code></p>
      <p>💸 You’ve also received <strong>100 GCC tokens</strong> as a bonus reward.</p>
      <p>Redirecting to your membership page in {countdown} seconds...</p>
    </div>
  );
}
