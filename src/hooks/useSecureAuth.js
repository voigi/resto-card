import { useState, useEffect, useCallback } from 'react';


// Configuration de sécurité
const SECURITY_CONFIG = {
  STORAGE_KEY: "app_secure_session",
};

// Génération d'un fingerprint plus robuste (incluant hardware et vendor)
export const getDeviceFingerprint = () => {
  return btoa([
    `${window.screen.width}x${window.screen.height}`,
    navigator.language, // Plus stable que les dimensions d'écran (évite les erreurs lors du resize/devtools)
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown'
  ].join('||'));
};

export const useSecureAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEY);
    setIsAuthorized(false);
    // Nettoyage de l'URL si nécessaire
    const url = new URL(window.location);
    if (url.searchParams.has('k')) {
      url.searchParams.delete('k');
      window.history.replaceState({}, '', url);
    }
    window.location.reload();
  }, []);

  const login = useCallback(async (key) => {
    if (!key) return false;

    try {
      const fp = getDeviceFingerprint();
      // Appel à l'API Serverless pour le login
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, fp })
      });

      if (response.ok) {
        const data = await response.json();
        // On stocke le token signé renvoyé par le serveur
        localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(data.session));
        setIsAuthorized(true);
        return true;
      }
    } catch (e) {
      console.error("Erreur login", e);
    }
    return false;
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get('k');
      const storedSession = localStorage.getItem(SECURITY_CONFIG.STORAGE_KEY);

      // 1. Tentative de connexion via URL (Prioritaire)
      if (urlKey) {
        const success = await login(urlKey);
        if (success) {
          // Nettoyage de l'URL pour ne pas laisser la clé visible (Sécurité visuelle)
          params.delete('k');
          const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
          window.history.replaceState({}, '', newUrl);
        }
        setIsLoading(false);
      } 
      // 2. Vérification de la session existante via l'API
      else if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const currentFp = getDeviceFingerprint();
          
          // Pré-vérification locale rapide du fingerprint
          if (session.fp !== currentFp) {
            throw new Error("Fingerprint mismatch");
          }

          // Vérification cryptographique côté serveur
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: session.token, fp: currentFp })
          });

          if (response.ok) {
            setIsAuthorized(true);
          } else {
            throw new Error("Session invalid server-side");
          }
        } catch (e) {
          console.warn("Session invalide ou expirée", e);
          localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEY);
          setIsAuthorized(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [login]);

  return { isAuthorized, isLoading, logout, login };
};