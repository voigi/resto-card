import React, { useState } from 'react';

const Header = ({
  establishmentName,
  setEstablishmentName,
  subtitle,
  setSubtitle,
  activeTheme,
  onShowThemeSelector,
  setIsCsvCreatorOpen,
  handleCsvUpload,
  handleBackgroundUpload,
  customBackground,
  setCustomBackground,
  handleLogoUpload,
  customLogo,
  setCustomLogo,
  onLogout
}) => {
  const [showCsvInfo, setShowCsvInfo] = useState(false);
  const [imageUploadModal, setImageUploadModal] = useState({ isOpen: false, type: null, title: '' });

  return (
    <header className="app-header" style={{ 
      backgroundColor: 'var(--bg-wrapper)', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px', alignItems: 'center', marginBottom: '25px' }}>
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
            <button
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: 0
              }}
              title="Changer le logo"
              onClick={() => setImageUploadModal({ isOpen: true, type: 'logo', title: 'Changer le logo' })}
            >
              📷
            </button>
          </div>
          
          {/* Nom de l'établissement */}
          <div>
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
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Sous-titre de l'établissement"
              style={{
                color: 'var(--text-light)',
                fontSize: '13px',
                fontWeight: '500',
                opacity: 0.8,
                border: 'none',
                background: 'transparent',
                width: '100%',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>
        </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            alignItems: 'center'
        }}>
            <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Type d'établissement</span>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Outils d'import</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => setIsCsvCreatorOpen(true)} style={{ fontSize: '0.9rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span> Création Rapide
                </button>

                <button className="btn-secondary" onClick={() => setShowCsvInfo(true)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px' }}>
                <span>📂</span> CSV
                </button>
            </div>
        </div>

        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Personnalisation</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button className="btn-secondary" onClick={() => setImageUploadModal({ isOpen: true, type: 'logo', title: 'Changer le logo' })} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px' }}>
                  <span>📷</span> Logo
              </button>
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
              <button className="btn-secondary" onClick={() => setImageUploadModal({ isOpen: true, type: 'background', title: "Changer l'image de fond" })} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px' }}>
                  <span>🖼️</span> Fond
              </button>
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

        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Session</span>
          <button className="btn-secondary" onClick={onLogout} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', padding: '8px 12px', gap: '6px', color: 'var(--danger)', borderColor: 'var(--border)' }} title="Fermer la session sécurisée">
              <span>🔒</span> Déconnexion
          </button>
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

      {imageUploadModal.isOpen && (
        <div className="modal-overlay" onClick={() => setImageUploadModal({ isOpen: false, type: null, title: '' })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-dark)' }}>{imageUploadModal.title}</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '25px' }}>
              Choisissez une nouvelle image depuis votre ordinateur. Les images sont automatiquement compressées.
            </p>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setImageUploadModal({ isOpen: false, type: null, title: '' })}>
                Annuler
              </button>
              <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', margin: 0 }}>
                Parcourir...
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (imageUploadModal.type === 'logo') {
                        handleLogoUpload(e);
                    } else {
                        handleBackgroundUpload(e);
                    }
                    setImageUploadModal({ isOpen: false, type: null, title: '' });
                  }} 
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
