import React, { useState } from 'react';
import './CondorGPT.css';

const faq = [
  {
    q: "What is Gold Condor Capital (GCC)?",
    a: "GCC is a digital commodity fund with locked token liquidity until 2030. It gains value through adoption, reflection rewards, a burn mechanism, and income from trading strategies like options and lending."
  },
  {
    q: "What happens when I buy an NFT?",
    a: "You receive a free airdrop of GCC tokens along with your NFT. This bundles utility with your digital collectible."
  },
  {
    q: "What is a wallet?",
    a: "A crypto wallet stores your digital assets like NFTs and tokens. It’s protected by a private key or seed phrase, which must be saved securely."
  },
  {
    q: "Why is my seed phrase important?",
    a: "Your seed phrase is the only way to access or recover your wallet. If lost, your assets are unrecoverable. Keep it private and offline."
  }
];

const CondorGPT = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleChat = () => setVisible(!visible);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/condor_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ GPT failed to reply." }]);
    }
  };

  return (
    <>
      <div onClick={toggleChat} className="chat-toggle">💬</div>

      {visible && (
        <div className="chat-box">
          <button onClick={() => setShowFAQ(!showFAQ)} className="faq-toggle">
            {showFAQ ? 'Hide FAQ' : 'Show FAQ'}
          </button>

          {showFAQ && (
            <div className="faq-section">
              {faq.map((item, i) => (
                <div key={i} className="faq-item">
                  <strong>Q: {item.q}</strong>
                  <p>A: {item.a}</p>
                </div>
              ))}
            </div>
          )}

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'CondorGPT'}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask CondorGPT..."
          />
        </div>
      )}
    </>
  );
};

export default CondorGPT;
