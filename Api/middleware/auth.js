// Middleware d'authentification personnalisé (style JWT) utilisant le module natif 'crypto' de Node.js
const crypto = require('crypto');

const SECRET_KEY = "KilometreSanteSecretToken2026_Key!";

// Helpers pour l'encodage et le décodage en base 64 URL-safe
function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
}

// Générer un jeton signé
function generateToken(payload) {
    const payloadStr = JSON.stringify({
        ...payload,
        exp: Date.now() + 24 * 60 * 60 * 1000 // Jeton expire dans 24 heures
    });
    const encodedPayload = base64UrlEncode(payloadStr);
    
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(encodedPayload);
    const signature = hmac.digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
        
    return `${encodedPayload}.${signature}`;
}

// Vérifier un jeton signé
function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 2) return null;
        
        const [encodedPayload, signature] = parts;
        
        const hmac = crypto.createHmac('sha256', SECRET_KEY);
        hmac.update(encodedPayload);
        const expectedSignature = hmac.digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
            
        if (signature !== expectedSignature) {
            return null; // Signature invalide
        }
        
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        
        // Vérifier l'expiration
        if (payload.exp && Date.now() > payload.exp) {
            return null; // Jeton expiré
        }
        
        return payload;
    } catch (e) {
        return null;
    }
}

// Middleware Express même si express est interdit 
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ erreur: "Accès refusé. Aucun jeton fourni." });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ erreur: "Format de jeton invalide (doit être 'Bearer <token>')." });
    }

    const token = parts[1];
    const userPayload = verifyToken(token);

    if (!userPayload) {
        return res.status(401).json({ erreur: "Jeton invalide ou expiré." });
    }

    // On attache l'utilisateur à la requête
    req.user = userPayload;
    next();
}

module.exports = {
    authMiddleware,
    generateToken,
    verifyToken
};
