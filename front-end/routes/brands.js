const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

// GET /admin/brands - Fetch all brands
router.get('/', async (req, res) => {
    const token = req.session.token
    try {
        
        // Fetch brands
        const response = await axios.get(`${API}/brands`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const brands = response.data.data.brands
        
        res.render('brands', { brands, error: null, success: null })
    } catch (err) {
        console.error('Failed to get brands:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting brands.',
            }
        });
    }
});

// POST /admin/brands/id/delete - Delete a brand
router.post('/:id/delete', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;

    try {

        const brandsResponse = await axios.get(`${API}/brands`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const brands = brandsResponse.data.data.brands
        
        const response = await axios.delete(`${API}/brands/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return res.render('brands', {
            brands,
            success: response.data.data.result,
            error: null
        })

    } catch (err) {
        console.error('Failed to delete brand:', err.message);

        const brandsResponse = await axios.get(`${API}/brands`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const brands = brandsResponse.data.data.brands

        return res.render('brands', {
            brands,
            success: null,
            error: err.response.data.data.result || 'An error occurred deleting brands.'
        })
    }
})

// POST /admin/brands/edit/id - Update brand
router.post('/edit/:id', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;
    const { name } = req.body;
    try {
        const brandsResponse = await axios.get(`${API}/brands`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const brands = brandsResponse.data.data.brands

        const response = await axios.put(`${API}/brands/${id}`, 
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return res.render('brands', {
            brands,
            success: response.data.data.result,
            error: null,
        })
    } catch (err) {
        console.error('Failed to update brand:', err.message);
        return res.render('brands', {
            brands,
            success: null,
            error: err.response.data.data.result || 'An error occurred updating brand.'
        })
    }
});

// POST /admin/brands/add - Add new brand
router.post('/add', async (req, res) => {
    const token = req.session.token;
    const { name } = req.body;

    try {

        const brandsResponse = await axios.get(`${API}/brands`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const brands = brandsResponse.data.data.brands

        const response = await axios.post(`${API}/brands`,
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return res.render('brands', {
            brands,
            success: response.data.data.result,
            error: null
        })
    } catch (err) {
        console.error('Failed to add brand:', err.message);
        
        const brandsResponse = await axios.get(`${API}/brands`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const brands = brandsResponse.data.data.brands;

        return res.render('brands', {
            brands,
            success: null,
            error: err.response.data.data.result || 'An error occurred adding brand.'
        })
    }
})

module.exports = router;