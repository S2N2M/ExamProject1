const express = require('express');
const router = express.Router();
const db = require('../models');
const RoleService = require('../services/RoleService');
const roleService = new RoleService(db);
const { authenticate, isAdmin } = require('../middleware/authMiddleware');


// Show all roles
router.get('/', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Roles']
        #swagger.summary = 'Fetch all roles'
        #swagger.description = 'Fetches all roles in the database. Requires admin authentication'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/RolesFetched'
            }
        }
    */
    try {
        const result = await roleService.roles();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viwing all roles:',
                roles: result
            }
        });
    } catch (err) {
        console.error('Failed to get roles:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting roles.',
            }
        });
    }
})

module.exports = router;