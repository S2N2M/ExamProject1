const express = require('express');
const router = express.Router();
const db = require('../models');
const MembershipService = require('../services/MembershipService');
const membershipService = new MembershipService(db);
const { authenticate, isAdmin } = require('../middleware/authMiddleware');


// Show all membership status
router.get('/', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Memberships']
        #swagger.summary = 'View all membership status'
        #swagger.description = 'Fetch all available membership status. Requires admin authentication'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/MembershipsFetched'
            }
        }
    */

    try {
        const result = await membershipService.memberships();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viwing all memberships.',
                memberships: result
            }
        });
    } catch (err) {
        console.error('Failed to get memberships:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting memberships.',
            }
        });
    }
})

// Show all users with their membership status
router.get('/users', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Memberships']
        #swagger.summary = 'View all users with their membership status'
        #swagger.description: 'Fetch all users along with their membership status, categorize by membership status. Requires admin authentication'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UsersMembership'
            }
        }
    */

    try {
        const result = await membershipService.allMemberships();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viwing all users membership',
                memberships: result
            }
        });

    } catch (err) {
        console.error('Failed to get memberships:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting memberships.',
            }
        });
    }
})

module.exports = router;