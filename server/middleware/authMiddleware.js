import jwt from 'jsonwebtoken';

// --- Middleware for REGULAR USERS ---
export const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.user.id;
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Alias for consistency
export const authenticateToken = protect;


// --- NEW Middleware for ADMINS ONLY ---
export const protectAdmin = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET2);

            if (decoded.user && decoded.user.role === 'admin') {
                req.adminId = decoded.user.id;
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Admin access only' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};