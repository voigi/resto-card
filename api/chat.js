// api/chat.js
import crypto from 'crypto';

// Récupération des secrets depuis les variables d'environnement Vercel
const JWT_SECRET = process.env.JWT_SECRET;

// Définition de l'origine autorisée pour CORS
const allowedOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '*';

// Fonction pour vérifier un token (doit être identique à celle dans /api/auth.js)
const verifyToken = (token) => {
  if (!token) return null;
  const [b64Data, signature] = token.split('.');
  if (!b64Data || !signature) return null;

  try {
    const data = Buffer.from(b64Data, 'base64').toString();
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (signature !== expectedSignature) {
      console.warn("Signature de token invalide");
      return null;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Erreur lors de la vérification du token", e);
    return null;
  }
};

// Logique de réponse simple du bot (FAQ)
const getBotResponse = (message) => {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
  }
  if (lowerCaseMessage.includes('supprimer')) {
    return "Pour supprimer un élément, cliquez sur l'icône de corbeille à côté de celui-ci. Pour vider une catégorie entière, utilisez l'option dans le menu de gestion.";
  }
  if (lowerCaseMessage.includes('pdf') || lowerCaseMessage.includes('télécharger')) {
    return "Vous pouvez télécharger votre menu au format PDF en cliquant sur le bouton 'Télécharger la carte' situé sous l'aperçu de votre menu.";
  }
  if (lowerCaseMessage.includes('thème') || lowerCaseMessage.includes('mode')) {
    return "Pour changer de mode (thème), cliquez sur l'icône en haut à gauche, puis sur 'Changer de mode' pour déverrouiller la sélection.";
  }
  if (lowerCaseMessage.includes('image') || lowerCaseMessage.includes('logo')) {
    return "Vous pouvez personnaliser le logo et l'image de fond via le menu de configuration (icône d'engrenage en haut à droite).";
  }
  if (lowerCaseMessage.includes('merci')) {
    return "De rien ! N'hésitez pas si vous avez d'autres questions.";
  }

  return "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ? Vous pouvez me poser des questions sur la suppression d'éléments, le téléchargement de PDF, ou le changement de thème.";
};


export default async function handler(req, res) {
  // Vérification critique au démarrage
  if (!JWT_SECRET) {
    console.error("Variable d'environnement manquante : JWT_SECRET.");
    return res.status(500).json({ error: "Configuration serveur incomplète." });
  }

  // Configuration CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, fp, message } = req.body;

  if (!token || !fp || !message) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  // 1. Vérification du token
  const session = verifyToken(token);
  if (!session) {
    return res.status(401).json({ error: "Session invalide" });
  }

  // 2. Vérification de l'expiration
  if (session.exp < Date.now()) {
    return res.status(401).json({ error: "Session expirée" });
  }

  // 3. VÉRIFICATION CRITIQUE : Fingerprint
  if (session.fp !== fp) {
    return res.status(403).json({ error: "Conflit de session. Veuillez vous reconnecter." });
  }

  // 4. Si tout est OK, on génère une réponse
  const botResponse = getBotResponse(message);

  return res.status(200).json({ response: botResponse });
}
