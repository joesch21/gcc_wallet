import React, { useState } from 'react';
import './CondorGPT.css';

const faq = [
  {
    q: "What is Gold Condor Capital (GCC)?",
    a: "GCC is a digital commodity fund backed by smart contract tokenomics. It features locked liquidity until 2030, ensuring long-term stability. GCC accrues value through adoption, token burn, reflections (passive income), and income streams from lending, borrowing, options trading, and AI-enhanced market activity."
  },
  {
    q: "Is GCC a cryptocurrency?",
    a: "Yes, but more specifically, it is a digital commodity token. Unlike typical cryptocurrencies, GCC is structured as a long-term store of value with embedded financial mechanisms like burns, reflections, and locked liquidity to support value appreciation."
  },
  {
    q: "How do I buy GCC?",
    a: "You can receive GCC for free when purchasing a Membership NFT via the GCC website. The NFT comes with an airdrop of GCC tokens sent directly to your crypto wallet."
  },
  {
    q: "What is a wallet?",
    a: "A crypto wallet stores your digital assets like NFTs and tokens. It’s protected by a private key or seed phrase, which must be saved securely."
  },
  {
    q: "Why is my seed phrase important?",
    a: "Your seed phrase is the only way to access or recover your wallet. If lost, your assets are unrecoverable. Keep it private and offline."
  },
  {
    q: "What do I get when I purchase a Membership NFT?",
    a: "You receive a unique NFT and a bundle of GCC tokens airdropped to your wallet. This NFT acts as your access pass and proof of participation in the GCC ecosystem."
  },
  {
    q: "Is GCC backed by anything?",
    a: "Yes, GCC is backed by smart contract-locked liquidity until 2030 and supported by real yield from options trading and DeFi financial activity."
  }
];

const CondorGPT = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleChat = () => {
    setVisible(!visible);
    if (!visible) {
      setMessages([{ role: 'assistant', content: "Hello Condarian! How is your day going?" }]);
    }
  };

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

  const handleSuggestedClick = (suggestion) => {
    setInput(suggestion);
    sendMessage();
  };

  const suggestedQuestions = [
    "What is GCC?",
    "How do I buy GCC?",
    "What is a wallet?",
    "Why is my seed phrase important?",
    "What do I get with the Membership NFT?"
  ];

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

          <div className="suggested-questions">
            {suggestedQuestions.map((q, i) => (
              <button key={i} onClick={() => handleSuggestedClick(q)}>{q}</button>
            ))}
          </div>

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
