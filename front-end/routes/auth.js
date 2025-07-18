const express = require('express');
const router = express.Router();
const axios = require('axios');

const API = 'http://localhost:3000'

// GET / - Render the login page
router.get('/', async (req, res) => {
    try {
        res.render('auth', { error: null })
    } catch (err) {
        console.error(err)
        res.render('auth', { error: null });
    }
})

// POST / - Process login by calling the back-end login endpoint
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body

        const response = await axios.post(`${API}/auth/login`, { username, password });
        
        // Check if user has authorization
        const role = response.data.data.role
        if (role !== 1) {
            return res.render('auth', { error: "Invalid username or password" });
        }
        // Save token to session
        req.session.token = response.data.data.token

        return res.redirect('/admin/products');
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(401).render('auth', { error: 'Invalid username or password' });
    }
})

module.exports = router;