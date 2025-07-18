const express = require('express');
const router = express.Router();
const db = require('../models');
const PopulateService = require('../services/PopulateService');
const populateService = new PopulateService(db)


// Initilize database with data
router.post('/init', async (req, res) => {
    /*
        #swagger.tags = ['Initilize']
        #swagger.summary = 'Initilize database with data'
        #swagger.description = 'Creates default products, memberships, roles and a default admin user if they don\'t already exist'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/Initilize'
            }
        }
    */

    try {
        const result = await populateService.populateDatabase();

        // Statuscode 201(true) if data is created or 200 if data already exists.
        let statusCode = result.dataCreated ? 201 : 200;

        return res.status(statusCode).json({
            status: 'success',
            statusCode: statusCode,
            data: {
                result: result.messages,
            }
        })
    } catch (err) {
        console.error('Failed to initilize database:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                message: 'Error initilizing database',
            }
        })
    }
})

module.exports = router;