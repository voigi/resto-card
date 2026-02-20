import React, { useState, useEffect } from 'react';

const MenuComposerModal = ({ isOpen, onClose, menu, menus = [], onUpdateMenus, theme, menuPageTitle, onUpdateTitle }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempMenu, setTempMenu] = useState(null);

  // Sécurité : on s'assure que menus est bien un tableau
  const safeMenus = Array.isArray(menus) ? menus : [];

  // On ne filtre que les menus du thème actuel pour l'affichage
  const themeMenus = safeMenus.filter(m => m.theme === theme.id);

  // Réinitialiser l'état d'édition à la fermeture pour éviter les conflits entre thèmes
  useEffect(() => {
    if (!isOpen) {
      setEditingId(null);
      setTempMenu(null);
    }
  }, [isOpen]);

  // Ouverture automatique du mode création si aucun menu n'existe
  useEffect(() => {
    if (isOpen && themeMenus.length === 0 && editingId === null) {
      setTempMenu({
        id: Date.now(),
        menuName: "",
        price: "",
        type: "selection",
        formula: "Entrée + Plat + Dessert",
        selectedIds: [],
        theme: theme.id // On associe le menu au thème courant
      });
      setEditingId("NEW");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Gestion de l'édition ---
  const startEditing = (menuToEdit) => {
    if (menuToEdit) {
      setTempMenu({ ...menuToEdit });
      setEditingId(menuToEdit.id);
    } else {
      // Nouveau menu
      setTempMenu({
        id: Date.now(),
        menuName: "",
        price: "",
        type: "selection",
        formula: "Entrée + Plat + Dessert",
        selectedIds: [],
        theme: theme.id // On associe le menu au thème courant
      });
      setEditingId("NEW");
    }
  };

  const saveMenu = () => {
    if (!tempMenu.menuName.trim()) {
      alert("Veuillez donner un nom à votre menu.");
      return;
    }
    if (editingId === "NEW") {
      onUpdateMenus([...safeMenus, tempMenu]);
    } else {
      onUpdateMenus(safeMenus.map(m => m.id === editingId ? tempMenu : m));
    }
    setEditingId(null);
    setTempMenu(null);
  };

  const deleteMenu = (id) => {
    if (window.confirm("Supprimer ce menu ?")) {
      onUpdateMenus(safeMenus.filter(m => m.id !== id));
    }
  };

  const toggleSelection = (id) => {
    const currentSelected = tempMenu.selectedIds || [];
    const newSelection = currentSelected.includes(id)
      ? currentSelected.filter(itemId => itemId !== id)
      : [...currentSelected, id];
    setTempMenu({ ...tempMenu, selectedIds: newSelection });
  };

  // On ne garde que les éléments qui appartiennent aux catégories du thème actuel
  const themeItems = menu.filter(item => theme.categories.includes(item.categorie));

  // Group items by category for better UX
  const itemsByCategory = themeItems.reduce((acc, item) => {
    if (!acc[item.categorie]) acc[item.categorie] = [];
    acc[item.categorie].push(item);
    return acc;
  }, {});

  // --- VUE LISTE ---
  if (editingId === null) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--title-color)' }}>Vos Menus</h3>
              <button 
                className="btn-primary" 
                onClick={() => startEditing(null)}
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
                title="Ajouter un menu"
              >
                +
              </button>
            </div>
            <button className="btn-icon-danger" onClick={onClose} style={{ width: 'auto' }}>✕</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-dark)' }}>Titre de la page (PDF)</label>
            <input 
              type="text" 
              value={menuPageTitle} 
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Par défaut : Nos Menus"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>

          <div style={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: '20px' }}>
            {themeMenus.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)', fontStyle: 'italic' }}>Aucun menu créé.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {themeMenus.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-input)' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{m.menuName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{m.price ? `${m.price} €` : 'Prix non défini'} • {m.type === 'formula' ? 'Formule' : `${m.selectedIds.length} plats`}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn-secondary" onClick={() => startEditing(m)} style={{ padding: '5px 10px' }}>✏️</button>
                      <button className="btn-icon-danger" onClick={() => deleteMenu(m.id)} style={{ width: '32px', height: '32px' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-primary full-width-btn" onClick={() => startEditing(null)} style={{ borderStyle: 'solid' }}>
            + Créer un nouveau menu
          </button>

          <div className="modal-actions" style={{ marginTop: '10px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE ÉDITION ---
  return (
    <div className="modal-overlay" onClick={() => setEditingId(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: 'var(--title-color)' }}>{editingId === "NEW" ? "Nouveau Menu" : "Modifier le Menu"}</h3>
          <button className="btn-icon-danger" onClick={() => setEditingId(null)} style={{ width: 'auto' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-dark)' }}>Nom du Menu</label>
            <input 
              type="text" 
              value={tempMenu.menuName || ''} 
              onChange={(e) => setTempMenu({...tempMenu, menuName: e.target.value})}
              placeholder="Ex: Menu Gourmand"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-dark)' }}>Prix (Optionnel)</label>
            <input 
              type="text" 
              value={tempMenu.price} 
              onChange={(e) => setTempMenu({...tempMenu, price: e.target.value})}
              placeholder="Ex: 25"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="menuType" 
              checked={tempMenu.type === 'selection'} 
              onChange={() => setTempMenu({...tempMenu, type: 'selection'})}
            />
            <span style={{ fontSize: '0.9rem' }}>Sélection à la carte</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="menuType" 
              checked={tempMenu.type === 'formula'} 
              onChange={() => setTempMenu({...tempMenu, type: 'formula'})}
            />
            <span style={{ fontSize: '0.9rem' }}>Formule (Texte)</span>
          </label>
        </div>

        {tempMenu.type === 'formula' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-dark)' }}>Description de la formule</label>
            <textarea 
              value={tempMenu.formula}
              onChange={(e) => setTempMenu({...tempMenu, formula: e.target.value})}
              placeholder="Ex: Entrée + Plat + Dessert au choix parmi la sélection ci-dessous :"
              rows="4"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
            />
          </div>
        )}

        <div style={{ maxHeight: '50vh', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
          {themeItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-light)' }}>
              <p style={{ marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>⚠️ Votre catalogue est vide.</p>
              <p style={{ fontSize: '0.9rem' }}>
                Veuillez d'abord ajouter des éléments dans la section <strong>"Aperçu du Catalogue"</strong> pour pouvoir composer votre menu.
              </p>
            </div>
          ) : (
            Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '15px' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--accent)', 
                  borderBottom: '1px solid var(--border)', 
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  textTransform: 'uppercase'
                }}>
                  {category}
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {items.map(item => (
                    <label 
                      key={item.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '8px', 
                        borderRadius: '6px',
                        backgroundColor: (tempMenu.selectedIds || []).includes(item.id) ? 'var(--bg-input)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={(tempMenu.selectedIds || []).includes(item.id)} 
                        onChange={() => toggleSelection(item.id)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{item.nom}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{(parseFloat(item.prix) || 0).toFixed(2)} €</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          {(tempMenu.selectedIds || []).length > 0 && (
            <button className="btn-secondary" onClick={() => setTempMenu({...tempMenu, selectedIds: []})}>
              Tout désélectionner
            </button>
          )}
          <button className="btn-primary" onClick={saveMenu}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuComposerModal;