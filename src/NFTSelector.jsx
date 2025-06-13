// File: src/NFTSelector.jsx
import React from 'react';
import './NFTSelector.css';

const nftMetadata = {
  1: { priceUsd: 600, gccReward: 100 },
  2: { priceUsd: 600, gccReward: 100 },
  3: { priceUsd: 2400, gccReward: 400 },
  4: { priceUsd: 2400, gccReward: 400 },
  5: { priceUsd: 6000, gccReward: 1000 },
  6: { priceUsd: 6000, gccReward: 1000 },
};

export default function NFTSelector({ availability, selectedTokenId, setSelectedTokenId }) {
  return (
    <div className="nft-carousel">
      {Object.entries(availability)
        .filter(([, isAvailable]) => isAvailable)
        .map(([id]) => {
          id = Number(id);
          const metadata = nftMetadata[id] || {};
          return (
            <div key={id} className="nft-card compact">
              <img src={`/nft${id}.jpeg`} alt={`NFT Token ${id}`} className="nft-image" />
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
  );
}
