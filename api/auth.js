// api/auth.js
import crypto from 'crypto';

// Récupération des secrets depuis les variables d'environnement Vercel
const SALT = process.env.SECURE_SALT;
const JWT_SECRET = process.env.JWT_SECRET; // Clé pour signer le token

// Liste des hashs autorisés (à mettre dans une variable d'environnement ALLOWED_HASHES sur Vercel)
// Format attendu pour la variable d'env : ["hash1", "hash2", ...]
const ALLOWED_HASHES = JSON.parse(process.env.ALLOWED_HASHES || "[]");

// Définition de l'origine autorisée pour CORS
// En production sur Vercel, utilise l'URL de déploiement. En local, autorise tout.
const allowedOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '*';

// Fonction pour signer un token (similaire à JWT mais simplifié)
const signToken = (payload) => {
  const data = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(data);
  const signature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64Data = Buffer.from(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64Data}.${signature}`;
};

// Fonction pour vérifier un token
const verifyToken = (token) => {
  const [b64Data, signature] = token.split('.');
  if (!b64Data || !signature) return null;

  const data = Buffer.from(b64Data, 'base64').toString();
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(data);
  const expectedSignature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  if (signature !== expectedSignature) return null;
  return JSON.parse(data);
};

export default async function handler(req, res) {
  // Vérification critique au démarrage de la fonction
  if (!SALT || !JWT_SECRET || ALLOWED_HASHES.length === 0) {
    console.error("Variables d'environnement manquantes : SECURE_SALT, JWT_SECRET ou ALLOWED_HASHES.");
    return res.status(500).json({ error: "Configuration serveur incomplète." });
  }

  // Configuration CORS pour autoriser votre front-end
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, fp, token } = req.body;

  // --- CAS 1 : VÉRIFICATION DE SESSION (Appelé au chargement de la page) ---
  if (token) {
    const session = verifyToken(token);
    
    if (!session) {
      return res.status(401).json({ error: "Token invalide ou falsifié" });
    }

    // Vérification de l'expiration
    if (session.exp < Date.now()) {
      return res.status(401).json({ error: "Session expirée" });
    }

    // VÉRIFICATION CRITIQUE : L'appareil est-il le même ?
    // On compare le fingerprint reçu (fp) avec celui stocké dans le token (session.fp)
    if (session.fp !== fp) {
      return res.status(403).json({ error: "Utilisation sur un autre appareil interdite." });
    }

    // Vérification que le hash est toujours dans la liste (permet la révocation d'accès)
    if (!ALLOWED_HASHES.includes(session.hash)) {
      return res.status(403).json({ error: "Accès révoqué." });
    }

    return res.status(200).json({ status: "ok", valid: true });
  }

  // --- CAS 2 : LOGIN (Appelé avec la clé ?k=...) ---
  if (key) {
    // Hachage sécurisé côté serveur (le SALT ne quitte jamais le serveur)
    const inputHash = crypto.createHash('sha256').update(SALT + key).digest('hex');

    if (ALLOWED_HASHES.includes(inputHash)) {
      // TODO (Optionnel) : Ici, vous pourriez vérifier dans une base de données (Vercel KV)
      // si ce hash est déjà associé à un AUTRE fingerprint pour bloquer le partage de clé.
      
      const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
      
      // On crée un token signé contenant le hash et le fingerprint MATÉRIEL
      const sessionToken = signToken({ hash: inputHash, fp, exp });

      return res.status(200).json({ 
        success: true,
        session: { token: sessionToken, fp, exp } 
      });
    }

    return res.status(401).json({ error: "Clé invalide" });
  }

  return res.status(400).json({ error: "Paramètres manquants" });
}
