import React, { useState } from 'react';
import './CondorGPT.css';

const CondorGPT = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setVisible(!visible);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/condor_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      if (data.error) {
        console.error('❌ GPT backend error:', data);
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.detail || 'GPT failed to reply.'}` }]);
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('❌ Network error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ GPT connection error." }]);
    }
  };

  return (
    <>
      <div onClick={toggleChat} className="chat-toggle">💬</div>

      {visible && (
        <div className="chat-box">
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
