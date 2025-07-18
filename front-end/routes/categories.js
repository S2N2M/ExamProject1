const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

// GET /admin/categories - Fetch all categories
router.get('/', async (req, res) => {
    const token = req.session.token
    try {
        
        // Fetch categories
        const response = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const categories = response.data.data.categories
        
        res.render('categories', { categories, error: null, success: null })
    } catch (err) {
        console.error('Failed to get categories:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting categories.',
            }
        });
    }
});

// POST /admin/categories/id/delete - Delete a category
router.post('/:id/delete', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;

    try {
        const responseCategories = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    
        const categories = responseCategories.data.data.categories
        
        const response = await axios.delete(`${API}/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return res.render('categories', {
            categories,
            success: response.data.data.result,
            error: null
        })
    } catch (err) {
        console.error('Failed to delete category:', err.message);
        const responseCategories = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const categories = responseCategories.data.data.categories

        return res.render('categories', {
            categories,
            success: null,
            error: err.response.data.data.result || 'An error occurred deleting category.'
        })
    }
})

// POST /admin/categories/edit/id - Update category
router.post('/edit/:id', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;
    const { name } = req.body;

    
    try {
        const responseCategories = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    
        const categories = responseCategories.data.data.categories

        const response = await axios.put(`${API}/categories/${id}`, 
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return res.render('categories', {
            categories,
            success: response.data.data.result,
            error: null
        })
    } catch (err) {
        console.error('Failed to update category:', err.message);
        const responseCategories = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const categories = responseCategories.data.data.categories

        return res.render('categories', {
            categories,
            success: null,
            error: err.response.data.data.result || 'An error occurred updating category.'
        })
    }
});

// POST /admin/categories/add - Add new category
router.post('/add', async (req, res) => {
    const token = req.session.token;
    const { name } = req.body;

    try {
        const responseCategories = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const categories = responseCategories.data.data.categories

        const response = await axios.post(`${API}/categories`,
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return res.render('categories', {
            categories,
            success: response.data.data.result,
            error: null
        })
    } catch (err) {
        console.error('Failed to add category:', err.message);

        const responseCategories = await axios.get(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const categories = responseCategories.data.data.categories

        return res.render('categories', {
            categories,
            success: null,
            error: err.response.data.data.result || 'An error occurred adding category.'
        })
    }
})

module.exports = router;