import React, { useState } from 'react';

const Header = ({
  establishmentName,
  setEstablishmentName,
  activeTheme,
  onShowThemeSelector,
  setIsCsvCreatorOpen,
  handleCsvUpload,
  handleBackgroundUpload,
  customBackground,
  setCustomBackground,
  handleLogoUpload,
  customLogo,
  setCustomLogo
}) => {
  const [showCsvInfo, setShowCsvInfo] = useState(false);

  return (
    <header className="app-header" style={{ 
      backgroundColor: 'var(--bg-wrapper)', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      border: '1px solid var(--border)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
            <img 
              src={customLogo || activeTheme.pdf.logo} 
              alt="Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                borderRadius: '50%', 
                border: '2px solid var(--border)',
                backgroundColor: '#fff',
                padding: '2px'
              }}
            />
            <label 
              style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                background: 'var(--accent)',
                color: '#fff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              title="Changer le logo"
            >
              📷
              <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
            </label>
          </div>
          
          {/* Nom de l'établissement */}
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={establishmentName}
              onChange={(e) => setEstablishmentName(e.target.value)}
              placeholder="Nom de l'établissement"
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: 'var(--title-color)',
                border: 'none',
                background: 'transparent',
                width: '100%',
                marginBottom: '4px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
            <div style={{ color: 'var(--text-light)', fontSize: '13px', fontWeight: '500', opacity: 0.8 }}>
              {activeTheme.labels.subtitle}
            </div>
          </div>
        </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Mode</span>
            <button 
                className="btn-secondary" 
                onClick={onShowThemeSelector}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '8px 16px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    transition: 'all 0.2s ease'
                }}
                title="Changer de mode"
            >
                <img src={activeTheme.pdf.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                {activeTheme.name}
                <span style={{ fontSize: '0.8em', marginLeft: '4px', color: 'var(--text-light)' }}>⇄</span>
            </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Contenu</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => setIsCsvCreatorOpen(true)} style={{ fontSize: '0.9rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span> Création Rapide
                </button>
                
                <button className="btn-secondary" onClick={() => setShowCsvInfo(true)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px' }}>
                <span>📂</span> CSV
                </button>
            </div>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Visuel</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px' }}>
                  <span>📷</span> Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
              </label>
              {customLogo && (
                  <button className="btn-icon-danger" onClick={() => setCustomLogo(null)} title="Supprimer le logo" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, borderRadius: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px' }}>
                  <span>🖼️</span> Fond
                  <input type="file" accept="image/*" onChange={handleBackgroundUpload} hidden />
              </label>
              {customBackground && (
                  <button className="btn-icon-danger" onClick={() => setCustomBackground(null)} title="Supprimer le fond" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, borderRadius: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCsvInfo && (
        <div className="modal-overlay" onClick={() => setShowCsvInfo(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-dark)' }}>Format CSV requis</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>
              Pour importer vos données, votre fichier CSV doit contenir les colonnes suivantes (correspondant au mode <strong>{activeTheme.name}</strong>) :
            </p>
            
            <ul style={{ textAlign: 'left', margin: '0 0 20px 0', padding: '15px 20px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', listStyle: 'none' }}>
              <li style={{ marginBottom: '5px' }}>🔹 <strong>{activeTheme.labels.item}</strong></li>
              <li style={{ marginBottom: '5px' }}>🔹 <strong>{activeTheme.labels.description}</strong></li>
              <li style={{ marginBottom: '5px' }}>🔹 <strong>{activeTheme.labels.price}</strong></li>
              <li style={{ marginBottom: '5px' }}>🔹 <strong>{activeTheme.labels.category}</strong></li>
            </ul>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCsvInfo(false)}>
                Annuler
              </button>
              <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', margin: 0 }}>
                Choisir le fichier
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={(e) => { handleCsvUpload(e); setShowCsvInfo(false); }} 
                  hidden 
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
