// MenuDisplay.jsx
import React from "react";

const MenuDisplay = ({ menu, theme, onEdit, onDelete }) => {
  // Vérifie s'il y a des éléments appartenant aux catégories du thème actuel
  const hasItems = menu.some(item => theme.categories.includes(item.categorie));

  return (
    <div className="display-container" style={{ 
      maxHeight: '60vh', 
      overflowY: 'auto', 
      overscrollBehavior: 'contain',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '0 20px 20px 20px',
      backgroundColor: 'var(--bg-wrapper)'
    }}>
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'var(--bg-wrapper)', 
        zIndex: 10, 
        paddingTop: '20px',
        paddingBottom: '15px',
        marginTop: 0,
        borderBottom: '1px solid var(--border)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
      }}>
        <h2 className="main-title" style={{ margin: 0, flex: 1 }}>Aperçu du Catalogue</h2>
        {hasItems && (
          <button 
            onClick={() => onDelete('ALL')} 
            className="btn-danger"
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.8rem', 
              whiteSpace: 'nowrap',
              boxShadow: 'none'
            }}
            title="Tout supprimer"
          >
            Tout supprimer
          </button>
        )}
      </div>

      {theme.categories.map((cat) => {
        const items = menu.filter((item) => item.categorie === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="category-block">
            <h3 className="category-name">{cat}</h3>
            <div className="items-grid">
              {items.map((item, index) => (
                <div key={index} className="card-item">
                  {theme.pdf?.logo && <img src={theme.pdf.logo} alt="" className="theme-icon" />}
                  {item.image && (
                    <div className="card-image">
                         <img src={item.image} className="item-image" alt={item.nom} />
                    </div>
                  )}
                  <div className="card-info">
                    <div className="card-header">
                      <h4>{item.nom}</h4>
                      <span className="price">{parseFloat(item.prix).toFixed(2)} €</span>
                    </div>
                    <p className="description">{item.description}</p>
                    <div className="card-actions" style={{marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                      <button onClick={() => onEdit(item)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em'}} title="Modifier">
                        ✏️
                      </button>
                      <button onClick={() => onDelete(item.id)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em'}} title="Supprimer">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuDisplay;
