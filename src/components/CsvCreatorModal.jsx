import React, { useState, useEffect } from 'react';

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};

const CsvCreatorModal = ({ isOpen, onClose, onImport, theme }) => {
  const [rows, setRows] = useState([]);

  // Initialiser avec une ligne vide à l'ouverture si la liste est vide
  useEffect(() => {
    if (isOpen && rows.length === 0) {
      setRows([{ id: Date.now(), nom: '', description: '', prix: '', categorie: theme.categories[0] || '', image: '' }]);
    }
  }, [isOpen, theme]);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([...rows, { 
      id: Date.now() + Math.random(), 
      nom: '', 
      description: '', 
      prix: '', 
      categorie: theme.categories[0] || '',
      image: ''
    }]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    } else {
      // Si c'est la dernière ligne, on la vide juste
      setRows([{ id: Date.now(), nom: '', description: '', prix: '', categorie: theme.categories[0] || '', image: '' }]);
    }
  };

  const handleChange = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleImageUpload = async (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const compressed = await compressImage(file);
      handleChange(id, 'image', compressed);
    }
  };

  const handleSave = () => {
    // On ne garde que les lignes qui ont au moins un nom
    const validRows = rows.filter(row => row.nom.trim() !== '');
    if (validRows.length > 0) {
      onImport(validRows);
      setRows([]); // Reset
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content csv-modal" onClick={e => e.stopPropagation()}>
        <h3>Création rapide</h3>
        <p>Remplissez ce tableau pour ajouter plusieurs éléments d'un coup.</p>
        
        <div className="csv-table-container">
          <table className="csv-table">
            <thead>
              <tr>
                <th>{theme.labels.item}</th>
                <th>{theme.labels.description}</th>
                <th style={{width: '100px'}}>{theme.labels.price}</th>
                <th style={{width: '150px'}}>{theme.labels.category}</th>
                <th style={{width: '130px'}}>Image <span style={{ fontSize: '0.8em', fontWeight: 'normal', color: 'var(--text-light)' }}>(Optionnel)</span></th>
                <th style={{width: '40px'}}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input 
                      type="text" 
                      value={row.nom} 
                      onChange={(e) => handleChange(row.id, 'nom', e.target.value)}
                      placeholder="Nom..."
                      autoFocus={rows.length === 1 && !row.nom}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={row.description} 
                      onChange={(e) => handleChange(row.id, 'description', e.target.value)}
                      placeholder="Description..."
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      value={row.prix} 
                      onChange={(e) => handleChange(row.id, 'prix', e.target.value)}
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td>
                    <select 
                      value={row.categorie} 
                      onChange={(e) => handleChange(row.id, 'categorie', e.target.value)}
                    >
                      {theme.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} title="Ajouter une image">
                      {row.image ? (
                        <img src={row.image} alt="img" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>📷</span>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(row.id, e)} hidden />
                    </label>
                  </td>
                  <td>
                    <button 
                      className="btn-icon-danger" 
                      onClick={() => handleRemoveRow(row.id)} 
                      title="Supprimer la ligne"
                      tabIndex="-1"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn-secondary full-width-btn" onClick={handleAddRow}>
          + Ajouter une ligne
        </button>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Valider et Générer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvCreatorModal;