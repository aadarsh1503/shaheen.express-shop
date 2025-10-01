import jwt from 'jsonwebtoken';

// --- Middleware for REGULAR USERS ---
// This middleware checks for a valid token but does not check for a specific role.
export const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Assumes user tokens are signed with JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.user.id;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


// --- NEW Middleware for ADMINS ONLY ---
// This middleware is built according to your adminAuthController.
export const protectAdmin = (req, res, next) => {
    let token;

    // 1. Check if token exists in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the ADMIN'S secret key (JWT_SECRET2)
            const decoded = jwt.verify(token, process.env.JWT_SECRET2);

            // 3. **CRITICAL CHECK**: Verify if the user's role is 'admin' inside the token
            if (decoded.user && decoded.user.role === 'admin') {
                // If the role is 'admin', attach the admin's ID to the request and proceed
                req.adminId = decoded.user.id;
                next();
            } else {
                // If the token is valid but the role is not 'admin', deny access
                // 403 Forbidden is the correct status code here
                res.status(403).json({ message: 'Forbidden: Admin access only' });
            }
        } catch (error) {
            // This will catch errors if the token is expired, invalid, or signed with the wrong secret
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};