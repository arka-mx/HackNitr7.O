import jwt from 'jsonwebtoken';
import LocalUser from '../models/LocalUser.js';
import admin from '../config/firebase.js';

const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Try verifying as Custom JWT (Native Auth)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.type === 'local') {
                req.user = await LocalUser.findById(decoded.id).select('-password');
                // Standardize req.user format
                req.user.firebase = { sign_in_provider: 'password' };
                req.user.uid = req.user.uid; // Already in model
                return next();
            }
        } catch (jwtError) {
            // Ignore JWT error and try Firebase
        }

        // Try verifying as Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();

    } catch (error) {
        console.error("Error verifying auth token:", error);
        return res.status(401).json({ error: 'Invalid token', details: error.message });
    }
};

export default verifyToken;
