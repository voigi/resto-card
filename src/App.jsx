import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import MenuForm from "./components/MenuForm";
import MenuDisplay from "./components/MenuDisplay";
import MenuPdf from "./components/MenuPdf";
import LoginScreen from "./components/LoginScreen";
import ConfirmationModal from "./components/ConfirmationModal";
import CsvCreatorModal from "./components/CsvCreatorModal";
import MenuComposerModal from "./components/MenuComposerModal";
import HelpChat from "./components/HelpChat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSecureAuth } from "./hooks/useSecureAuth";
import "./styles/app.css";


const themes = {
  tea: {
    id: "tea",
    name: "Salon de Thé",
    categories: ["Thé", "Café", "Pâtisserie", "Jus et Smoothies", "Brunch"],
    labels: {
      title: "Salon de Thé",
      subtitle: "Pause douceur & gourmandise",
      item: "Nom du produit",
      description: "Description (parfums, allergènes...)",
      price: "Prix (€)",
      category: "Catégorie",
      addBtn: "Ajouter à la carte",
      downloadBtn: "Télécharger la carte",
      formTitle: "✨ Ajouter une gourmandise",
      formSubtitle: "Remplissez les détails pour ajouter à la carte",
      itemNamePlaceholder: "Ex: Earl Grey, Cheesecake...",
      itemDescPlaceholder: "Détails sur les saveurs, allergènes...",
      image: "Photo gourmande"
    },
    colors: {
      "--accent": "#a1887f",
      "--bg-input": "#fffaf4",
      "--border": "#d7ccc8",
      "--text-dark": "#4e342e",
      "--text-light": "#795548",
      "--bg-page": "#fffaf4",
      "--bg-wrapper": "#ffffff",
      "--title-color": "#6d4c41"
    },
    pdf: {
      fontHeading: "DancingScript",
      fontBody: "Helvetica",
      colorHeading: "#6e5d59",
      colorAccent: "#a1887f",
      bg: "#fcf9f5",
      logo: "https://cdn-icons-png.flaticon.com/512/5411/5411387.png",
      backgroundImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=80",
      backgroundOpacity: 0.15
    }
  },
  restaurant: {
    id: "restaurant",
    name: "Restaurant",
    categories: ["Entrées", "Plats", "Desserts", "Boissons", "Vins"],
    labels: {
      title: "Restaurant",
      subtitle: "Cuisine raffinée & Authentique",
      item: "Nom du plat",
      description: "Composition & Origine",
      price: "Prix (€)",
      category: "Type de plat",
      addBtn: "Ajouter au menu",
      downloadBtn: "Télécharger le menu",
      formTitle: "🍽️ Ajouter un plat",
      formSubtitle: "Remplissez les champs pour créer votre menu",
      itemNamePlaceholder: "Ex: Burger Maison, Salade César...",
      itemDescPlaceholder: "Ingrédients, cuisson, origine...",
      image: "Photo du plat"
    },
    colors: {
      "--accent": "#c0392b",
      "--bg-input": "#fdf2e9",
      "--border": "#e6b0aa",
      "--text-dark": "#2c3e50",
      "--text-light": "#7f8c8d",
      "--bg-page": "#f4f6f6",
      "--bg-wrapper": "#ffffff",
      "--title-color": "#c0392b"
    },
    pdf: {
      fontHeading: "Times-Bold",
      fontBody: "Times-Roman",
      colorHeading: "#c0392b",
      colorAccent: "#e74c3c",
      bg: "#ffffff",
      logo: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png",
      backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
      backgroundOpacity: 0.12
    }
  },
  
  association: {
    id: "association",
    name: "Association",
    categories: ["Événement", "Atelier", "Autre"],
    labels: {
      title: "Notre Association",
      subtitle: "Ensemble pour agir & partager",
      item: "Intitulé",
      description: "Date, Heure & Détails",
      price: "Tarif (€)",
      category: "Rubrique",
      addBtn: "Ajouter",
      downloadBtn: "Télécharger le document",
      formTitle: "🤝 Ajouter un élément",
      formSubtitle: "Renseignez les informations (événement, atelier...)",
      itemNamePlaceholder: "Ex: Fête du club, Atelier poterie...",
      itemDescPlaceholder: "Lieu, public visé, informations...",
      image: "Visuel / Logo"
    },
    colors: {
      "--accent": "#8e44ad",
      "--bg-input": "#f4ecf7",
      "--border": "#d2b4de",
      "--text-dark": "#4a235a",
      "--text-light": "#8e44ad",
      "--bg-page": "#f5eef8",
      "--bg-wrapper": "#ffffff",
      "--title-color": "#8e44ad"
    },
    pdf: {
      fontHeading: "Helvetica-Bold",
      fontBody: "Helvetica",
      colorHeading: "#4a235a",
      colorAccent: "#8e44ad",
      bg: "#ffffff",
      logo: "https://cdn-icons-png.flaticon.com/512/1256/1256650.png",
      backgroundImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
// Mains qui donnent/reçoivent
      backgroundOpacity: 0.1
    }
  },
  sport: {
    id: "sport",
    name: "Asso Sportive",
    categories: ["Fitness", "Musculation", "Aquatique", "Collectif", "Enfants"],
    labels: {
      title: "Club Sportif",
      subtitle: "Planning des activités",
      item: "Activité",
      description: "Horaires & Détails",
      price: "Cotisation (€)",
      category: "Section",
      addBtn: "Ajouter l'activité",
      downloadBtn: "Télécharger le planning",
      formTitle: "🏃 Ajouter une activité",
      formSubtitle: "Définissez les détails de la séance",
      itemNamePlaceholder: "Ex: Cours de Zumba, Accès Salle...",
      itemDescPlaceholder: "Niveau, matériel, coach...",
      image: "Illustration"
    },
    colors: {
      "--accent": "#27ae60",
      "--bg-input": "#e9f7ef",
      "--border": "#a9dfbf",
      "--text-dark": "#145a32",
      "--text-light": "#196f3d",
      "--bg-page": "#eaeded",
      "--bg-wrapper": "#ffffff",
      "--title-color": "#27ae60"
    },
    pdf: {
      fontHeading: "Helvetica-Bold",
      fontBody: "Helvetica",
      colorHeading: "#145a32",
      colorAccent: "#27ae60",
      bg: "#f2f4f4",
      logo: "https://cdn-icons-png.flaticon.com/512/2964/2964514.png",
      backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
      backgroundOpacity: 0.1
    }
  }
};

function App() {
  const { isAuthorized, isLoading, logout, login } = useSecureAuth();

  const [menu, setMenu] = useState(() => {
    try {
      const saved = localStorage.getItem("menuData");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erreur chargement menu", e);
      return [];
    }
  });

  // Chargement initial de la configuration
  const [initialConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("restoConfig");
      return saved ? (JSON.parse(saved) || {}) : {};
    } catch (e) {
      console.error("Erreur chargement config", e);
      return {};
    }
  });

  const [currentTheme, setCurrentTheme] = useState(initialConfig.currentTheme || "tea");
  const [editingDish, setEditingDish] = useState(null);
  
  const activeTheme = themes[currentTheme] || themes.tea;

  const [establishmentNames, setEstablishmentNames] = useState(() => {
    const saved = initialConfig.establishmentNames;
    // Migration from old string format
    if (initialConfig.establishmentName && typeof initialConfig.establishmentName === 'string') {
      const allNames = {};
      for (const themeId in themes) {
        allNames[themeId] = themes[themeId].labels.title;
      }
      allNames[initialConfig.currentTheme || 'tea'] = initialConfig.establishmentName;
      return allNames;
    }
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      const completeState = {};
      for (const themeId in themes) {
        completeState[themeId] = saved[themeId] || themes[themeId].labels.title;
      }
      return completeState;
    }
    // Default initialization
    const initialNames = {};
    for (const themeId in themes) {
      initialNames[themeId] = themes[themeId].labels.title;
    }
    return initialNames;
  });

  const [subtitles, setSubtitles] = useState(() => {
    const saved = initialConfig.subtitles;
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      const completeState = {};
      for (const themeId in themes) {
        completeState[themeId] = saved[themeId] || themes[themeId].labels.subtitle;
      }
      return completeState;
    }
    const initialSubtitles = {};
    for (const themeId in themes) {
      initialSubtitles[themeId] = themes[themeId].labels.subtitle;
    }
    return initialSubtitles;
  });

  const [customBackground, setCustomBackground] = useState(initialConfig.customBackground || null);
  const [customLogo, setCustomLogo] = useState(initialConfig.customLogo || null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });
  const [isCsvCreatorOpen, setIsCsvCreatorOpen] = useState(false);
  const [isMenuComposerOpen, setIsMenuComposerOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isModeLocked, setIsModeLocked] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const effectiveTheme = {
    ...activeTheme,
    pdf: {
      ...activeTheme.pdf,
      backgroundImage: customBackground || activeTheme.pdf.backgroundImage,
      logo: customLogo || activeTheme.pdf.logo
    }
  };

  const [menus, setMenus] = useState(() => {
    const loaded = Array.isArray(initialConfig.menus) ? initialConfig.menus.filter(m => m && typeof m === 'object') : [];
    
    // Chargement des items pour inférer le thème des anciens menus
    let allItems = [];
    try {
      const savedMenu = localStorage.getItem("menuData");
      if (savedMenu) allItems = JSON.parse(savedMenu);
    } catch (e) {}

    const defaultTheme = initialConfig.currentTheme || "tea";
    
    return loaded.map((m, idx) => {
      // Stratégie de réparation : on recalcule le thème en fonction du contenu
      // pour corriger les menus mal attribués lors des versions précédentes
      if (m.selectedIds && m.selectedIds.length > 0) {
        const firstItem = allItems.find(i => i.id === m.selectedIds[0]);
        if (firstItem) {
          for (const t of Object.values(themes)) {
            if (t.categories.includes(firstItem.categorie)) {
              return { ...m, id: m.id || Date.now() + idx, theme: t.id };
            }
          }
        }
      }
      
      // Si le menu est vide ou sans correspondance, on garde son thème s'il existe, sinon 'tea'
      return { ...m, id: m.id || Date.now() + idx, theme: m.theme || "tea" };
    });
  });

  const [menuPageTitle, setMenuPageTitle] = useState(() => {
    const saved = initialConfig.menuPageTitle;
    // Si c'est une chaîne (ancienne version), on initialise un objet avec cette valeur pour tous les thèmes
    if (typeof saved === 'string') {
      return { tea: saved, restaurant: saved, association: saved, sport: saved };
    }
    // Sinon on retourne l'objet sauvegardé ou les valeurs par défaut
    return saved || {
      tea: "Nos Menus",
      restaurant: "Nos Menus",
      association: "Nos Menus",
      sport: "Nos Menus"
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("menuData", JSON.stringify(menu));
    } catch (e) {
      console.error("Erreur sauvegarde menu", e);
      toast.error("Sauvegarde impossible : espace insuffisant (images trop lourdes ?)");
    }
  }, [menu]);

  useEffect(() => {
    const config = { currentTheme, establishmentNames, subtitles, customBackground, customLogo, menus, menuPageTitle };
    try {
      localStorage.setItem("restoConfig", JSON.stringify(config));
    } catch (e) {
      console.error("Erreur sauvegarde config", e);
      toast.error("Sauvegarde config impossible : images trop lourdes.");
    }
  }, [currentTheme, establishmentNames, subtitles, customBackground, customLogo, menus, menuPageTitle]);

  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(activeTheme.colors)) {
      root.style.setProperty(key, value);
    }
  }, [activeTheme]);

  // Fonction utilitaire pour compresser les images
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Largeur max raisonnable pour le web/PDF
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
          
          // Compression JPEG qualité 0.7 (suffisant pour l'affichage)
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setCustomBackground(compressed);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setCustomLogo(compressed);
    }
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const lines = csvText.split(/\r\n|\n/);
        if (lines.length < 2) {
          toast.error("Le fichier CSV semble vide ou ne contient pas d'en-têtes.");
          return;
        }

        // Nettoyage des en-têtes
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
        const newItems = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Découpage CSV intelligent (gère les virgules dans les guillemets)
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => {
            return val.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
          });

          const item = {};
          headers.forEach((header, index) => {
            if (values[index] !== undefined) {
              let key = header;
              // Mapping flexible des colonnes pour accepter différents formats
              // On ajoute les labels du thème actuel pour la correspondance
              const nameKeywords = ['nom', 'name', 'titre', 'produit', 'intitulé', activeTheme.labels.item.toLowerCase()];
              const descKeywords = ['description', 'desc', 'détails', 'infos', activeTheme.labels.description.toLowerCase()];
              const priceKeywords = ['prix', 'price', 'tarif', 'montant', activeTheme.labels.price.toLowerCase()];
              const catKeywords = ['categorie', 'category', 'catégorie', 'rubrique', 'section', activeTheme.labels.category.toLowerCase()];
              const imgKeywords = ['image', 'photo', 'img', 'visuel', 'url', activeTheme.labels.image.toLowerCase()];

              if (nameKeywords.some(k => header.includes(k))) key = 'nom';
              else if (descKeywords.some(k => header.includes(k))) key = 'description';
              else if (priceKeywords.some(k => header.includes(k))) key = 'prix';
              else if (catKeywords.some(k => header.includes(k))) key = 'categorie';
              else if (imgKeywords.some(k => header.includes(k))) key = 'image';
              
              item[key] = values[index];
            }
          });

          if (item.nom) {
            newItems.push({
              id: Date.now() + i + Math.random(), // ID unique
              nom: item.nom,
              description: item.description || "",
              prix: item.prix ? parseFloat(item.prix.toString().replace(',', '.')) : 0,
              categorie: item.categorie || "Divers",
              image: item.image || null
            });
          }
        }

        if (newItems.length > 0) {
          setMenu(prev => [...prev, ...newItems]);
          toast.success(`${newItems.length} éléments importés avec succès !`);
        } else {
          toast.warning("Aucun élément valide trouvé dans le CSV.");
        }
      } catch (error) {
        console.error("Erreur CSV", error);
        toast.error("Erreur lors de l'import du CSV.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset de l'input
  };

  const handleManualImport = (newItems) => {
    if (newItems.length > 0) {
      const processedItems = newItems.map(item => ({
        ...item,
        prix: parseFloat(item.prix) || 0,
        image: item.image || null
      }));
      setMenu(prev => [...prev, ...processedItems]);
      toast.success(`${newItems.length} éléments ajoutés !`);
    }
  };

  const addDish = (dish) => {
    setMenu([...menu, dish]);
    toast.success("Élément ajouté avec succès !");
  };

  const updateDish = (updatedDish) => {
    setMenu(menu.map(item => item.id === updatedDish.id ? updatedDish : item));
    setEditingDish(null);
    toast.success("Élément modifié avec succès !");
  };

  const requestDelete = (id) => {
    setDeleteModal({ isOpen: true, itemId: id });
  };

  const confirmDelete = () => {
    if (deleteModal.itemId === 'ALL') {
      // On ne supprime que les éléments appartenant aux catégories du thème actif
      const categoriesToDelete = activeTheme.categories;
      const idsToDelete = menu.filter(item => categoriesToDelete.includes(item.categorie)).map(item => item.id);

      // Nettoyer les menus composés qui contiennent les éléments supprimés
      setMenus(prevMenus => prevMenus.map(m => ({
        ...m,
        selectedIds: m.selectedIds.filter(id => !idsToDelete.includes(id))
      })));

      setMenu(menu.filter(item => !categoriesToDelete.includes(item.categorie)));
      setEditingDish(null);
      toast.info(`Le menu ${activeTheme.name} a été vidé.`);
    } else if (deleteModal.itemId) {
      setMenu(menu.filter(item => item.id !== deleteModal.itemId));
      if (editingDish && editingDish.id === deleteModal.itemId) {
        setEditingDish(null);
      }
      // Nettoyer les menus qui contiennent cet élément
      setMenus(prevMenus => prevMenus.map(m => ({
        ...m,
        selectedIds: m.selectedIds.filter(id => id !== deleteModal.itemId)
      })));
      toast.info("Élément supprimé.");
    }
    setDeleteModal({ isOpen: false, itemId: null });
  };

  const handleThemeSelect = (themeId) => {
    if (isModeLocked && themeId !== currentTheme) return;
    setCurrentTheme(themeId);
    setIsModeLocked(true);
    setIsThemeSelectorOpen(false);
    setEditingDish(null);
  };

  const handleUpdateEstablishmentName = (newName) => {
    setEstablishmentNames(prev => ({
      ...prev,
      [currentTheme]: newName
    }));
  };

  const handleUpdateSubtitle = (newSubtitle) => {
    setSubtitles(prev => ({
      ...prev,
      [currentTheme]: newSubtitle
    }));
  };

  const handleUpdateTitle = (newTitle) => {
    setMenuPageTitle(prev => ({
      ...prev,
      [currentTheme]: newTitle
    }));
  };

  // Filtrage des données pour le rendu (PDF et Modale) en fonction du thème actif
  const currentThemeMenus = menus.filter(m => m.theme === currentTheme);
  const currentThemeTitle = menuPageTitle[currentTheme] || "Nos Menus";
  const establishmentName = establishmentNames[currentTheme] || activeTheme.labels.title;
  const subtitle = subtitles[currentTheme] || activeTheme.labels.subtitle;

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>Chargement...</div>;
  }

  if (!isAuthorized) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div 
      className="full-page" 
      style={{ 
        backgroundColor: "var(--bg-page)", 
        backgroundImage: `url(${effectiveTheme.pdf.backgroundImage})`,
        backgroundBlendMode: "multiply",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        transition: "background 0.3s ease-in-out" 
      }}
    >
      <div className="form-wrapper">
        <Header
          establishmentName={establishmentName}
          setEstablishmentName={handleUpdateEstablishmentName}
          subtitle={subtitle}
          setSubtitle={handleUpdateSubtitle}
          activeTheme={activeTheme}
          onShowThemeSelector={() => { setIsModeLocked(true); setIsThemeSelectorOpen(true); }}
          setIsCsvCreatorOpen={setIsCsvCreatorOpen}
          handleCsvUpload={handleCsvUpload}
          handleBackgroundUpload={handleBackgroundUpload}
          customBackground={customBackground}
          setCustomBackground={setCustomBackground}
  handleLogoUpload={handleLogoUpload}
          customLogo={customLogo}
          setCustomLogo={setCustomLogo}
          onLogout={() => setIsLogoutModalOpen(true)}
        />

        <MenuForm 
          onAddDish={addDish} 
          onUpdateDish={updateDish} 
          editingDish={editingDish} 
          onCancelEdit={() => setEditingDish(null)}
          theme={effectiveTheme} 
        />

        <div className="preview-container">
          <MenuDisplay 
            menu={menu} 
            theme={effectiveTheme} 
            onEdit={setEditingDish} 
            onDelete={requestDelete} 
            onComposeMenu={() => setIsMenuComposerOpen(true)}
          />
          {menu.length > 0 && (
            <PDFDownloadLink
              key={`${currentTheme}-${menu.length}-${JSON.stringify(currentThemeMenus)}-${currentThemeTitle}-${establishmentName}-${subtitle}`}
              document={<MenuPdf menu={menu} theme={effectiveTheme} establishmentName={establishmentName} subtitle={subtitle} menus={currentThemeMenus} menuPageTitle={currentThemeTitle} />}
              fileName="carte_restaurant.pdf"
              className="pdf-link"
            >
              {({ loading }) =>
                loading ? "..." : `📄 ${effectiveTheme.labels.downloadBtn || "Télécharger"}`
              }
            </PDFDownloadLink>
          )}
        </div>

        <ConfirmationModal 
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
          onConfirm={confirmDelete}
          title={deleteModal.itemId === 'ALL' ? `Vider le menu ${activeTheme.name} ?` : "Supprimer l'élément ?"}
          message={deleteModal.itemId === 'ALL' 
            ? `Attention, vous allez supprimer tous les éléments du mode ${activeTheme.name}. Les éléments des autres modes seront conservés.` 
            : "Cette action est irréversible. Voulez-vous vraiment retirer cet élément de votre carte ?"}
        />

        <ConfirmationModal 
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={logout}
          title="Se déconnecter ?"
          message="Vous êtes sur le point de quitter votre session sécurisée. Voulez-vous continuer ?"
        />

        <CsvCreatorModal 
          isOpen={isCsvCreatorOpen}
          onClose={() => setIsCsvCreatorOpen(false)}
          onImport={handleManualImport}
          theme={effectiveTheme}
        />

        <MenuComposerModal
          isOpen={isMenuComposerOpen}
          onClose={() => setIsMenuComposerOpen(false)}
          menu={menu}
          theme={effectiveTheme}
          menus={menus}
          onUpdateMenus={setMenus}
          menuPageTitle={currentThemeTitle}
          onUpdateTitle={handleUpdateTitle}
        />

        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          theme="colored" 
          toastStyle={{ whiteSpace: "nowrap", width: "auto" }}
         
        />
      </div>

      {/* Intégration du composant de chat sécurisé */}
      <HelpChat />

      {/* Modale de sélection de thème */}
      {isThemeSelectorOpen && (
        <div className="modal-overlay" onClick={() => setIsThemeSelectorOpen(false)}>
          <div className="modal-content theme-selector-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '10px', color: 'var(--title-color)' }}>Choisissez votre univers</h2>
            <p style={{ marginBottom: '30px', color: 'var(--text-light)' }}>
              {isModeLocked 
                ? "Mode actuel verrouillé. Réinitialisez pour changer." 
                : "Sélectionnez le mode adapté à votre activité"}
            </p>
            
            <div className="theme-grid">
              {Object.values(themes).map(t => {
                const isDisabled = isModeLocked && currentTheme !== t.id;
                return (
                  <div 
                    key={t.id} 
                    className={`theme-card ${currentTheme === t.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && handleThemeSelect(t.id)}
                  >
                    <div className="theme-icon-wrapper" style={{ backgroundColor: t.colors['--bg-input'], borderColor: t.colors['--border'] }}>
                      <img src={t.pdf.logo} alt={t.name} />
                    </div>
                    <h4 style={{ color: t.colors['--title-color'] }}>{t.name}</h4>
                    {currentTheme === t.id && <span className="active-badge">Actif</span>}
                  </div>
                );
              })}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px', justifyContent: 'center', gap: '15px' }}>
              {isModeLocked && (
                <button 
                  className="btn-secondary" 
                  onClick={() => setIsModeLocked(false)}
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  🔄 Changer de mode
                </button>
              )}
              <button className="btn-secondary" onClick={() => setIsThemeSelectorOpen(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
