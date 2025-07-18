const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

// GET /admin/roles - Fetch all roles
router.get('/', async (req, res) => {
    const token = req.session.token
    try {
        
        // Fetch roles
        const rolesResponse = await axios.get(`${API}/roles`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const roles = rolesResponse.data.data.roles
        
        res.render('roles', { roles })
    } catch (err) {
        console.error('Failed to get roles:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting roles.',
            }
        });
    }
});

module.exports = router;