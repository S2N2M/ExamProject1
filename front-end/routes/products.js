const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

// GET /admin/products - Fetch all products
router.get('/', async (req, res) => {
    const token = req.session.token
    try {
        
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
            await axios.get(`${API}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${API}/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${API}/brands`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])

        const products = productsResponse.data.data.products
        const categories = categoriesResponse.data.data.categories;
        const brands = brandsResponse.data.data.brands;

        res.render('products', { products, categories, brands, query: {} })
    } catch (err) {
        console.error('Failed to get products:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting products.',
            }
        });
    }
});

// GET /products/search? - Search for products, categories and/or brands
router.get('/search', async (req, res) => {
    const token = req.session.token
    try {
        
        const { product, category, brand } = req.query;

        const response = await axios.get(`${API}/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { productName: product, categoryName: category, brandName: brand }
        });

        const [categoriesResponse, brandsResponse] = await Promise.all([
            axios.get(`${API}/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${API}/brands`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])

        const products = response.data.data.search.items;
        const categories = categoriesResponse.data.data.categories;
        const brands = brandsResponse.data.data.brands;
        res.render('products', { products, categories, brands, query: req.query });
        
    } catch (err) {
        console.error('Failed to get products:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting products.',
            }
        });
    }
})

// POST /admin/products/id/delete - Soft-delete product
router.post('/:id/delete', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;

    try {
        await axios.delete(`${API}/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        res.redirect('/admin/products');

    } catch (err) {
        console.error('Failed to delete product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured deleting products.',
            }
        });
    }
})

// POST /admin/products/id/restore - Restore soft-deleted product
router.post('/:id/restore', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;

    try {
        await axios.put(`${API}/products/restore/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })

        res.redirect('/admin/products');

    } catch (err) {
        console.error('Failed to restore product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured restoring products',
            }
        });
    }
})

// POST /admin/products/edit/id - Update products
router.post('/edit/:id', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;
    const { name, description, price, quantity, categoryId, brandId, imgurl } = req.body;

    try {
        await axios.put(`${API}/products/${id}`, 
            { name, description, price, quantity, categoryId, brandId, imgurl },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.redirect('/admin/products');
    } catch (err) {
        console.error('Failed to update product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured updating product',
            }
        });
    }
});

// POST /admin/products/add - Add new product
router.post('/add', async (req, res) => {
    const token = req.session.token;
    const { name, description, price, quantity, categoryId, brandId, imgurl } = req.body;

    try {
        await axios.post(`${API}/products`,
            { name, description, price, quantity, categoryId, brandId, imgurl },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        res.redirect('/admin/products');
    } catch (err) {
        console.error('Failed to add product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured adding product',
            }
        });
    }
})

module.exports = router;
