// src/components/HelpChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getDeviceFingerprint } from '../hooks/useSecureAuth'; // On importe la fonction partagée
import '../styles/HelpChat.css'; // Nous allons créer ce fichier juste après

const HelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        sender: 'bot',
        text: 'Bonjour ! Je suis votre assistant. Posez-moi une question.'
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll vers le bas à chaque nouveau message
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    const newMessages = [...messages, { id: Date.now(), sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const storedSession = localStorage.getItem("app_secure_session");
      if (!storedSession) {
        throw new Error("Session non trouvée. Veuillez vous reconnecter.");
      }
      
      const session = JSON.parse(storedSession);
      const fp = getDeviceFingerprint();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session.token, fp, message: userMessage })
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue.");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.response }]);

    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: `Erreur : ${error.message}` }]);
    }
  };

  return (
    <div className="help-chat-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Aide & Support</h3>
            <button onClick={() => setIsOpen(false)} className="close-chat-btn">&times;</button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <p className="typing-indicator">
                  <span></span><span></span><span></span>
                </p>
              </div>
            )}
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </form>
        </div>
      )}
      <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path></svg>
        )}
      </button>
    </div>
  );
};

export default HelpChat;
