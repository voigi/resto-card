import { useState, useEffect, useCallback } from 'react';


// Configuration de sécurité
const SECURITY_CONFIG = {
  STORAGE_KEY: "app_secure_session",
  EXPIRATION_TIME: 24 * 60 * 60 * 1000, // 24 heures
  SALT: import.meta.env.VITE_SECURE_SALT // Grain de sel via variable d'environnement
};

// Fonction utilitaire pour hasher une chaîne en SHA-256
const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Génération d'un fingerprint plus robuste (incluant hardware et vendor)
const getDeviceFingerprint = () => {
  return btoa([
    `${window.screen.width}x${window.screen.height}`,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown'
  ].join('||'));
};

export const useSecureAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allowedHashes, setAllowedHashes] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!SECURITY_CONFIG.SALT) {
        console.error("Sécurité critique : La variable VITE_SECURE_SALT n'est pas définie dans le .env");
        setIsLoading(false);
        return;
      }

      // 1. Chargement dynamique de la liste des clients (Fichier JSON externe)
      let loadedHashes = [];
      try {
        // On ajoute un timestamp pour éviter que le navigateur ne mette le fichier en cache
        // Cela permet de prendre en compte les nouveaux clients immédiatement
        const response = await fetch(`${import.meta.env.BASE_URL}clients.json?t=${Date.now()}`);
        if (response.ok) {
          loadedHashes = await response.json();
        }
      } catch (e) {
        console.error("Erreur chargement clients.json", e);
        // Fallback : on essaie quand même le .env si le fichier json échoue
        loadedHashes = JSON.parse(import.meta.env.VITE_SECRET_HASHES || "[]");
      }
      setAllowedHashes(loadedHashes);

      if (!loadedHashes || loadedHashes.length === 0) {
        console.error("Sécurité : Aucune liste de clients trouvée (ni clients.json, ni .env).");
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get('k');
      const storedSession = localStorage.getItem(SECURITY_CONFIG.STORAGE_KEY);
      const now = Date.now();

      // Création d'un fingerprint navigateur robuste
      // Combine UserAgent, Langue, Résolution écran et Timezone pour éviter le vol de localStorage simple
      const fingerprint = getDeviceFingerprint();

      // DEBUG : Affiche la signature unique de l'appareil dans la console
      // Vous verrez qu'elle est différente entre Chrome et Firefox
      console.log("🔒 Signature de l'appareil (Fingerprint) :", fingerprint);

      let authorized = false;

      // 1. Tentative de connexion via URL (Prioritaire)
      if (urlKey) {
        const inputHash = await sha256(SECURITY_CONFIG.SALT + urlKey);
        
        if (loadedHashes.includes(inputHash)) {
          // Succès : on stocke la session sécurisée
          const sessionData = {
            hash: inputHash, // On stocke le hash, pas la clé en clair
            fp: fingerprint,
            exp: now + SECURITY_CONFIG.EXPIRATION_TIME
          };
          localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
          authorized = true;

          // Nettoyage de l'URL pour ne pas laisser la clé visible (Sécurité visuelle)
          params.delete('k');
          const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
          window.history.replaceState({}, '', newUrl);
        }
      } 
      // 2. Vérification de la session existante
      else if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          
          // Validation stricte : Clé correcte + Fingerprint identique + Non expiré
          const isValidToken = loadedHashes.includes(session.hash);
          const isValidFingerprint = session.fp === fingerprint;
          const isNotExpired = session.exp > now;

          if (isValidToken && isValidFingerprint && isNotExpired) {
            authorized = true;
          } else {
            // Session invalide, expirée ou volée (fingerprint différent) : on nettoie
            console.warn("Session invalide ou expirée");
            localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEY);
          }
        } catch (e) {
          localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEY);
        }
      }

      setIsAuthorized(authorized);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (key) => {
    if (!key || !SECURITY_CONFIG.SALT || allowedHashes.length === 0) {
      console.warn("Login impossible : Configuration manquante ou liste vide.");
      return false;
    }

    const inputHash = await sha256(SECURITY_CONFIG.SALT + key);
    
    if (allowedHashes.includes(inputHash)) {
      const now = Date.now();
      const fingerprint = getDeviceFingerprint();

      const sessionData = {
        hash: inputHash,
        fp: fingerprint,
        exp: now + SECURITY_CONFIG.EXPIRATION_TIME
      };
      localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
      setIsAuthorized(true);
      return true;
    }
    return false;
  }, [allowedHashes]);

  const logout = useCallback(() => {
    localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEY);
    setIsAuthorized(false);
    window.location.href = window.location.pathname; // Recharge la page proprement
  }, []);

  return { isAuthorized, isLoading, logout, login };
};