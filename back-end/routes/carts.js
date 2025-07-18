const express = require('express');
const router = express.Router();
const db = require('../models');
const CartService = require('../services/CartService');
const cartService = new CartService(db);
const OrderService = require('../services/OrderService');
const orderService = new OrderService(db);
const { authenticate } = require('../middleware/authMiddleware');

// GET /carts/ - Fetch the user's cart
router.get('/', authenticate, async (req, res) => {
    /*
        #swagger.tags = ['Carts']
        #swagger.summary = 'Fetch the users cart'
        #swagger.description = 'Fetch logged-in users cart'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/GetCart'
            }
        }
    */
    const id = req.user.id;
    try {
        const cartItems = await cartService.getCartItems(id);

        if (cartItems.length === 0) {
            return res.status(500).json({
            status: 'error',
            statusCode: 500,
            date: {
                result: 'Cart not found.'
            }
        })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Products in cart:',
                cart: cartItems
            }
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            date: {
                result: err.message || 'An error offcured while fetching cart items.'
            }
        })
    }
})

// POST /carts/ - Add items in user's cart
router.post('/', authenticate, async (req, res) => {
    /*
        #swagger.tags = ['Carts']
        #swagger.summary = 'Add items to cart'
        #swagger.description = 'Allows a logged-in user to add items to their cart'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Products to add to cart',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/AddToCart'
            }
        }
        #swagger.responses[201] = {
            'schema': {
                $ref: '#/definitions/CartSuccess'
            }
        }
    */
    const { productId, quantity } = req.body;
    const id = req.user.id;
    
    try {
        
        // Find or create a cart for the user
        let cart = await cartService.findOrCreate(id);

        // Add item to cart
        const cartItem = await cartService.addToCart(cart.id, productId, quantity);

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                result: 'Product added to cart.',
                cart: cartItem
            }
        })
        
    } catch (err) {
        console.error('Failed to add product to cart:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: err.message || 'An error occured adding product to cart.'
            }
        })
    }
});

// POST /carts/checkout/now - Create an order for the user
router.post('/checkout/now', authenticate, async (req, res) => {
    /*
        #swagger.tags = ['Carts']
        #swagger.summary = 'Checkout and create order'
        #swagger.description = 'Creates and checks out an order for logged-in user'
        #swagger.responses[201] = {
            'schema': {
                $ref: '#/definitions/CheckoutOrder'
            }
        }
    */

    const id = req.user.id;

    try {
        const order = await orderService.createOrder(id);

        res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                result: 'Order created.',
                cart: order
            }
        })

    } catch (err) {
        console.error('Failed to create order:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: err.message || 'An error occured creating order.'
            }
        })
    }
})

// DELETE /products - Remove item(s) from the cart
router.delete('/', authenticate, async (req, res) => {
    /*
        #swagger.tags = ['Carts']
        #swagger.summary = 'Remove items from the cart or clear it'
        #swagger.description = 'Removes a specific product from the cart if productId and quantity is provided, otherwise clear the cart'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Provide productId and quantity to remove a specific product from the cart, leave empty to clear cart'
            'required': false,
            'schema': {
                $ref: '#/definitions/RemoveProduct'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/ProductRemoved'
            }
        }
    */

    const id = req.user.id;
    const { productId, quantity } = req.body;

    try {
        // Find user cart
        let cart = await cartService.findOrCreate(id);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Cart not found.'
                }
            })
        }

        if (productId) {
            // Remove product from the cart
            await cartService.removeFromCart(cart.id, productId, quantity);
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                data: {
                    result: 'Product removed from cart.'
                }
            })
        } else {
            // Clear entire cart
            await cartService.clearCart(cart.id);
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                data: {
                    result: 'Cart cleared successfully.'
                }
            })
        }

    } catch (err) {
        console.error('Failed to remove product from cart:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: err.message || 'An error occured while removing product from cart.'
            }
        })
    }
})

module.exports = router;