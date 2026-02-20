import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isTrying, setIsTrying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!key || isTrying) return;

    setIsTrying(true);
    setError('');
    const success = await onLogin(key);
    setIsTrying(false);

    if (!success) {
      setError('Clé d\'accès invalide. Veuillez réessayer.');
      // Shake animation on error
      e.target.classList.add('shake');
      setTimeout(() => e.target.classList.remove('shake'), 500);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '20px', textAlign: 'center' }}>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔑</div>
        <h2 style={{ color: '#1e293b', marginBottom: '10px', marginTop: 0 }}>Accès Sécurisé</h2>
        <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '25px' }}>
          Veuillez entrer votre clé d'accès personnelle pour déverrouiller l'application.
        </p>
        <div style={{ backgroundColor: '#fff1f2', color: '#be123c', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid #fecdd3' }}>
          ⚠️ <strong>Attention :</strong> Cette clé est strictement personnelle. Ne la partagez pas.
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Entrez votre clé ici"
            style={{
              width: '100%', padding: '12px 16px', fontSize: '1rem',
              border: `2px solid ${error ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '8px', marginBottom: '15px', boxSizing: 'border-box',
              textAlign: 'center', transition: 'border-color 0.2s'
            }}
          />
          <button
            type="submit"
            disabled={isTrying || !key}
            style={{
              width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none',
              borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
              opacity: (isTrying || !key) ? 0.6 : 1, transition: 'opacity 0.2s, background 0.2s'
            }}
          >
            {isTrying ? 'Vérification...' : 'Déverrouiller'}
          </button>
          {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '15px', marginBottom: 0 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;