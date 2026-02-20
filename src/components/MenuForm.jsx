// MenuForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const safeTextRegex = /^[a-zA-ZÀ-ÿ0-9\s''\-()]+$/;

const MenuForm = ({ onAddDish, onUpdateDish, editingDish, onCancelEdit, theme }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const isPriceOptional = theme.id === 'association' || theme.id === 'sport';

  const schema = React.useMemo(() => yup.object().shape({
    nom: yup
      .string()
      .required("Le nom est requis")
      .max(50, "Maximum 50 caractères")
      .matches(safeTextRegex, "Caractères non autorisés"),
    description: yup
      .string()
      .required("La description est requise")
      .max(300, "Maximum 300 caractères"),
    prix: isPriceOptional
      ? yup.number().transform(value => (isNaN(value) || value === null) ? null : value).nullable().min(0, "Le prix doit être positif ou nul")
      : yup.number().typeError("Veuillez entrer un prix valide").positive("Le prix doit être positif").required("Le prix est requis"),
    categorie: yup.string().required("La catégorie est requise"),
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test("fileSize", "La photo ne doit pas dépasser 5MB", (value) => {
        if (typeof value === 'string') return true;
        return !value || !value[0] || value[0].size <= 5242880;
      })
      .test("fileType", "Format non supporté (JPG, PNG, WEBP)", (value) => {
        if (typeof value === 'string') return true;
        return (
          !value ||
          !value[0] ||
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(value[0].type)
        );
      }),
  }), [isPriceOptional]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const imageFile = watch("image");
  const description = watch("description");
  const descriptionLength = description ? description.length : 0;

  // États pour les modes événementiels (Horaires + Détails)
  const isEventBasedTheme = theme.id === 'sport' || theme.id === 'association';
  const [sportDate, setSportDate] = useState("");
  const [sportStartHour, setSportStartHour] = useState("10");
  const [sportStartMin, setSportStartMin] = useState("00");
  const [sportEndHour, setSportEndHour] = useState("11");
  const [sportEndMin, setSportEndMin] = useState("00");
  const [sportDetails, setSportDetails] = useState("");

  // Synchroniser les champs événementiels vers la description du formulaire
  React.useEffect(() => {
    if (isEventBasedTheme) {
      let dateStr = "";
      if (sportDate) {
        const [y, m, d] = sportDate.split('-');
        dateStr = `${d}/${m}/${y} - `;
      }
      const startTime = `${sportStartHour}h${sportStartMin}`;
      const endTime = `${sportEndHour}h${sportEndMin}`;
      const desc = `${dateStr}de ${startTime} à ${endTime}${sportDetails ? ' - ' + sportDetails : ''}`;
      setValue("description", desc, { shouldValidate: true, shouldDirty: true });
    }
  }, [isEventBasedTheme, sportDate, sportStartHour, sportStartMin, sportEndHour, sportEndMin, sportDetails, setValue]);

  // Initialiser les champs événementiels en cas d'édition
  React.useEffect(() => {
    if (isEventBasedTheme && editingDish && editingDish.description) {
      // Regex pour extraire la date (optionnelle), les heures et les détails (optionnels)
      const match = editingDish.description.match(/^(?:(\d{2}\/\d{2}\/\d{4})\s*-\s*)?de\s+(\d{1,2})h(\d{2})\s+à\s+(\d{1,2})h(\d{2})(?: - (.*))?$/);
      if (match) {
        if (match[1]) {
          const [d, m, y] = match[1].split('/');
          setSportDate(`${y}-${m}-${d}`);
        } else {
          setSportDate("");
        }
        setSportStartHour(match[2].padStart(2, '0'));
        setSportStartMin(match[3]);
        setSportEndHour(match[4].padStart(2, '0'));
        setSportEndMin(match[5]);
        setSportDetails(match[6] ? match[6].trim() : "");
      } else {
        // Fallback si le format ne correspond pas (ex: entrée manuelle)
        setSportDetails(editingDish.description);
        setSportDate("");
      }
    } else if (isEventBasedTheme && !editingDish) {
      setSportStartHour("10");
      setSportStartMin("00");
      setSportEndHour("11");
      setSportEndMin("00");
      setSportDetails("");
      setSportDate("");
    }
  }, [editingDish, isEventBasedTheme]);

  React.useEffect(() => {
    if (imageFile && imageFile[0] && typeof imageFile !== 'string') {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (typeof imageFile === 'string') {
      setImagePreview(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  React.useEffect(() => {
    if (editingDish) {
      reset(editingDish);
      setImagePreview(editingDish.image);
    } else {
      reset({ nom: "", description: "", prix: "", categorie: "", image: null });
      setImagePreview(null);
    }
  }, [editingDish, reset, theme.id]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600; // Suffisant pour une vignette de menu
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let imageResult = data.image;
      
      if (typeof data.image !== 'string') {
        if (data.image && data.image[0]) {
          const file = data.image[0];
          imageResult = await compressImage(file);
        } else {
          imageResult = null;
        }
      }

      if (editingDish) {
        onUpdateDish({ ...editingDish, ...data, image: imageResult });
      } else {
        onAddDish({ 
          ...data, 
          image: imageResult,
          id: Date.now(),
          createdAt: new Date().toISOString()
        });
        reset();
        setImagePreview(null);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (editingDish && onCancelEdit) {
      onCancelEdit();
    } else {
      reset();
      setImagePreview(null);
    }
  };

  return (
    <div className="form-content">
      <form onSubmit={handleSubmit(onSubmit)} className="modern-form" noValidate style={{ gap: '8px' }}>
        <div className="form-header" style={{ marginBottom: '5px' }}>
          <h2 className="form-title" style={{ fontSize: '1.3rem', marginBottom: '2px' }}>
            {editingDish ? "✏️ Modifier l'élément" : theme.labels.formTitle}
          </h2>
          <p className="form-subtitle" style={{ fontSize: '0.85rem' }}>
            {editingDish ? "Modifiez les informations ci-dessous" : theme.labels.formSubtitle}
          </p>
        </div>

        <div className="form-grid" style={{ gap: '10px' }}>
          <div className="input-group">
            <label htmlFor="nom" className="input-label" style={{ fontSize: '0.85rem' }}>
              {theme.labels.item} <span className="required">*</span>
            </label>
            <input
              id="nom"
              {...register("nom")}
              placeholder={theme.labels.itemNamePlaceholder}
              className={errors.nom ? "input-error" : ""}
              disabled={isSubmitting}
              style={{ padding: '8px' }}
            />
            {errors.nom && (
              <span className="error-hint">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {errors.nom.message}
              </span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="prix" className="input-label" style={{ fontSize: '0.85rem' }}>
              {theme.labels.price} {isPriceOptional ? <span style={{ fontSize: '0.85em', color: 'var(--text-light)', fontWeight: 'normal', marginLeft: '4px' }}>(Optionnel)</span> : <span className="required">*</span>}
            </label>
            <div className="price-input-wrapper">
              <input
                id="prix"
                type="number"
                step="0.01"
                min="0"
                {...register("prix")}
                placeholder="0.00 €"
                className={errors.prix ? "input-error" : ""}
                disabled={isSubmitting}
                style={{ padding: '8px' }}
              />
            </div>
            {errors.prix && (
              <span className="error-hint">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {errors.prix.message}
              </span>
            )}
          </div>

          <div className="input-group full-width">
            <label htmlFor="categorie" className="input-label" style={{ fontSize: '0.85rem' }}>
              {theme.labels.category} <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="categorie"
                {...register("categorie")}
                className={errors.categorie ? "input-error" : ""}
                disabled={isSubmitting}
                style={{ padding: '8px' }}
              >
                <option value="">Sélectionnez une catégorie</option>
                {theme.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <svg className="select-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {errors.categorie && (
              <span className="error-hint">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {errors.categorie.message}
              </span>
            )}
          </div>

          <div className="input-group full-width">
            {isEventBasedTheme ? (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="input-label" style={{ marginBottom: '2px', display: 'block', fontSize: '0.85rem' }}>Date <span className="required">*</span></label>
                    <input 
                      type="date" 
                      value={sportDate}
                      onChange={(e) => setSportDate(e.target.value)}
                      disabled={isSubmitting}
                      style={{ padding: '6px' }}
                    />
                  </div>
                  <div style={{ flex: 0.9 }}>
                    <label className="input-label" style={{ marginBottom: '2px', display: 'block', fontSize: '0.85rem' }}>Heure de Début <span className="required">*</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <select 
                        value={sportStartHour} 
                        onChange={(e) => setSportStartHour(e.target.value)}
                        style={{ flex: 1, padding: '6px', minWidth: '45px' }}
                        disabled={isSubmitting}
                      >
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.8rem' }}>h</span>
                      <select 
                        value={sportStartMin} 
                        onChange={(e) => setSportStartMin(e.target.value)}
                        style={{ flex: 1, padding: '6px', minWidth: '45px' }}
                        disabled={isSubmitting}
                      >
                        {['00', '15', '30', '45'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ flex: 0.9 }}>
                    <label className="input-label" style={{ marginBottom: '2px', display: 'block', fontSize: '0.85rem' }}> Heure de Fin <span className="required">*</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <select 
                        value={sportEndHour} 
                        onChange={(e) => setSportEndHour(e.target.value)}
                        style={{ flex: 1, padding: '6px', minWidth: '45px' }}
                        disabled={isSubmitting}
                      >
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.8rem' }}>h</span>
                      <select 
                        value={sportEndMin} 
                        onChange={(e) => setSportEndMin(e.target.value)}
                        style={{ flex: 1, padding: '6px', minWidth: '45px' }}
                        disabled={isSubmitting}
                      >
                        {['00', '15', '30', '45'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <label className="input-label" style={{ fontSize: '0.85rem' }}>Détails <span className="required">*</span></label>
                <textarea
                  value={sportDetails}
                  onChange={(e) => setSportDetails(e.target.value)}
                  placeholder={theme.labels.itemDescPlaceholder}
                  rows="1"
                  style={{ height: '38px', minHeight: '38px', padding: '8px' }}
                  disabled={isSubmitting}
                />
                {/* Champ caché pour la validation react-hook-form */}
                <input type="hidden" {...register("description")} />
              </>
            ) : (
              <>
                <label htmlFor="description" className="input-label" style={{ fontSize: '0.85rem' }}>
                  {theme.labels.description} <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder={theme.labels.itemDescPlaceholder}
                  rows="3"
                  className={errors.description ? "input-error" : ""}
                  disabled={isSubmitting}
                />
                <div className="char-count" style={{
                  color: descriptionLength > 300 ? "var(--danger)" : descriptionLength >= 280 ? "#e67e22" : "var(--text-light)",
                  fontWeight: descriptionLength >= 280 ? "600" : "400"
                }}>
                  {descriptionLength}/300
                </div>
              </>
            )}
            
            {errors.description && (
              <span className="error-hint">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="file-upload-group full-width">
            <label htmlFor="image" className="input-label" style={{ fontSize: '0.85rem' }}>
              {theme.labels.image} <span style={{ fontSize: '0.85em', color: 'var(--text-light)', fontWeight: 'normal', marginLeft: '4px' }}>(Optionnel)</span>
            </label>
            <label
              className={`custom-file-upload ${errors.image ? "file-error" : ""} ${
                imagePreview ? "has-image" : ""
              }`}
              htmlFor="file-input"
              style={{ height: '70px', padding: '5px' }}
            >
              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                {...register("image")}
                disabled={isSubmitting}
              />
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Aperçu" />
                  <div className="image-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Changer la photo</span>
                    <span>Changer</span>
                  </div>
                </div>
              ) : (
                <div className="file-content" style={{ gap: '2px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="upload-primary" style={{ fontSize: '0.85rem' }}>Cliquez pour ajouter une photo</span>
                </div>
              )}
            </label>
            {errors.image && (
              <span className="error-hint center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {errors.image.message}
              </span>
            )}
          </div>
        </div>

        <div className="form-actions" style={{ paddingTop: '10px', marginTop: 'auto' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            {editingDish ? "Annuler" : "Réinitialiser"}
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting || descriptionLength > 300}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {editingDish ? "Modification..." : "Ajout en cours..."}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {editingDish ? "Mettre à jour" : (theme.labels.addBtn || "Ajouter au menu")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuForm;