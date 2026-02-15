// MenuForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const safeTextRegex = /^[a-zA-ZÀ-ÿ0-9\s''\-()]+$/;

const schema = yup.object().shape({
  nom: yup
    .string()
    .required("Le nom est requis")
    .max(50, "Maximum 50 caractères")
    .matches(safeTextRegex, "Caractères non autorisés"),
  description: yup
    .string()
    .required("La description est requise")
    .max(300, "Maximum 300 caractères"),
  prix: yup
    .number()
    .typeError("Veuillez entrer un prix valide")
    .positive("Le prix doit être positif")
    .required("Le prix est requis"),
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
});

const MenuForm = ({ onAddDish, onUpdateDish, editingDish, onCancelEdit, theme }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const imageFile = watch("image");
  const description = watch("description");
  const descriptionLength = description ? description.length : 0;

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
      <form onSubmit={handleSubmit(onSubmit)} className="modern-form" noValidate>
        <div className="form-header">
          <h2 className="form-title">
            {editingDish ? "✏️ Modifier l'élément" : theme.labels.formTitle}
          </h2>
          <p className="form-subtitle">
            {editingDish ? "Modifiez les informations ci-dessous" : theme.labels.formSubtitle}
          </p>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="nom" className="input-label">
              {theme.labels.item} <span className="required">*</span>
            </label>
            <input
              id="nom"
              {...register("nom")}
              placeholder={theme.labels.itemNamePlaceholder}
              className={errors.nom ? "input-error" : ""}
              disabled={isSubmitting}
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
            <label htmlFor="prix" className="input-label">
              {theme.labels.price} <span className="required">*</span>
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
            <label htmlFor="categorie" className="input-label">
              {theme.labels.category} <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="categorie"
                {...register("categorie")}
                className={errors.categorie ? "input-error" : ""}
                disabled={isSubmitting}
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="">Sélectionner...</option>
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
            <label htmlFor="description" className="input-label">
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
            <label htmlFor="image" className="input-label">
              {theme.labels.image} <span style={{ fontSize: '0.85em', color: 'var(--text-light)', fontWeight: 'normal', marginLeft: '4px' }}>(Optionnel)</span>
            </label>
            <label
              className={`custom-file-upload ${errors.image ? "file-error" : ""} ${
                imagePreview ? "has-image" : ""
              }`}
              htmlFor="file-input"
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
                <div className="file-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="upload-text">
                    <span className="upload-primary">Cliquez pour ajouter une photo</span>
                    <span className="upload-primary">Cliquez pour ajouter</span>
                    <span className="upload-secondary">ou glissez-déposez</span>
                  </p>
                  <p className="upload-hint">JPG, PNG ou WEBP • Max 5MB</p>
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

        <div className="form-actions">
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