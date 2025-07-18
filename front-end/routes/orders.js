const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

router.get('/', async (req, res) => {
    const token = req.session.token
    try {
        
        // Fetch orders
        const orderResponse = await axios.get(`${API}/orders/all-orders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const orders = orderResponse.data.data.orders
        
        res.render('orders', { orders, error: null, success: null })
    } catch (err) {
        console.error('Failed to get orders:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting orders.',
            }
        });
    }
})

// POST /admin/orders/edit/id - Update order status
router.post('/edit/:id', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;
    const { status } = req.body;
    try {
        // Fetch orders
        const orderResponse = await axios.get(`${API}/orders/all-orders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const orders = orderResponse.data.data.orders

        // Update order status
        const response = await axios.put(`${API}/orders/${id}`, 
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return res.render('orders', {
            orders,
            success: response.data.data.result,
            error: null
        })
    } catch (err) {
        console.error('Failed to update status:', err);
        const orderResponse = await axios.get(`${API}/orders/all-orders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const orders = orderResponse.data.data.orders

        return res.render('orders', {
            orders,
            success: null,
            error: err.response.data.data.result || 'Error updating order status.'
        })
    }
});

module.exports = router;