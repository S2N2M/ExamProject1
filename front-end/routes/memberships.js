var express = require('express');
var router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

// GET /admin/memberships - Fetch all memberships
router.get('/', async (req, res) => {
    const token = req.session.token
    try {
        
        // Fetch memberships
        const response = await axios.get(`${API}/memberships/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const memberships = response.data.data.memberships
        
        res.render('memberships', { memberships })
    } catch (err) {
        console.error('Failed to get memberships:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting memberships.',
            }
        });
    }
});



module.exports = router;