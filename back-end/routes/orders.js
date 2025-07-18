const express = require('express');
const router = express.Router();
const db = require('../models');
const OrderService = require('../services/OrderService');
const orderService = new OrderService(db);
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// GET /orders/ - Fetch the user's order
router.get('/', authenticate, async (req, res) => {
    /*
        #swagger.tags = ['Orders']
        #swagger.summary = 'Fetch the logged-in user's order'
        #swagger.description = 'A list of the logged-in user's orders'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UserOrder'
            }
        }
    */

    const id = req.user.id;
    
    try {
        const result = await orderService.getOrder(id);

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'No orders found.'
                }
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viewing all orders from user',
                orders: result
            }
        })
    } catch (err) {
        console.error('Failed to fetch orders:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting orders.'
            }
        })
    }
})

// GET /orders/ - Fetch all orders made
router.get('/all-orders', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Orders']
        #swagger.summary = 'Fetch all orders'
        #swagger.description = 'A list of orders made by all users. Requires Admin authentication'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/AllOrders'
            }
        }
    */

    try {
        const result = await orderService.getOrders();

        if (!result) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Orders not found.'
                }
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viewing all orders:',
                orders: result
            }
        })
    } catch (err) {
        console.error('Failed to fetch orders:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting orders.'
            }
        })
    }
})

// PUT /orders/ - Update the user's order (Admin only)
router.put('/:id/', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Orders']
        #swagger.summary = 'Update status of an order'
        #swagger.description = 'Update the status of an order, only options available are \'In Progress\', \'Ordered\', \'Completed\'. Requires Admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the order to update',
            'required': 'true',
            type: 'integer'    
        }
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Update status to an order',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/OrderStatus'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UpdateOrder'
            }
        }
    */

    const allowedStatus = ['In Progress', 'Ordered', 'Completed']
    const id = parseInt(req.params.id);
    const { status } = req.body;

    // Status validation
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'Invalid status.'
            }
        })
    }
    
    if (isNaN(id)) {
        return res.status(422).json({
            status: 'error',
            statusCode: 422,
            data: {
                result: 'ID is not in correct format.'
            }
        })
    }

    if (!id) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'ID is required.'
            }
        })
    }

    try {
        const result = await orderService.updateStatus(id, status);

        if (!result) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'No orders found.'
                }
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Order has been updated:',
                orders: result
            }
        })
    } catch (err) {
        console.error('Failed update order status:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred updating order status.'
            }
        })
    }
})

module.exports = router;