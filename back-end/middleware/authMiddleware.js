const jwt = require('jsonwebtoken');

// Extract user info if token is provided, but not required
const allUsers = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        req.user = null; // No token provided, set user to null (guest)
        return next()
    }

    // Verify if token is from guest or authenticated user
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            req.user = null; 
        } else {
            req.user = decoded; 
        }
        next();
    })
}

// Middleware function to determine if the API endpoint request is from an authenticated user
const authenticate = (req, res, next) => {

    // Get token from Authorization header
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    // Check if token is present
    if (!token) {
        return res.status(401).json({
            status: 'error',
            statusCode: 401,
            data: {
                result: 'Access denied. Token is required.'
            }
        });
    };

    // Verify if token is valid
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {

        // Check if an error occur, and send appropiate error
        if (err) {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                data: {
                    result: 'Invalid or expired token.'
                }
            });
        }

        // Token verified successfully
        req.user = decoded;
        next(); // Continue to next step
    });
}

// Middleware function to determine if the API endpoint request is from an admin
const isAdmin = (req, res, next) => {

    // Check if the request is made from an admin account
    if (req.user.role === 1) {
        next() // Continue to next step if validated
    } else {
        return res.status(403).json({
            status: 'error',
            statusCode: 403,
            data: {
                result: 'Access denied. Admin privileges required.'
            }
        });
    }
}

module.exports = { allUsers, authenticate, isAdmin };