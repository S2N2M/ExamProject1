const express = require('express');
const router = express.Router();
const db = require('../models');
const BrandService = require('../services/BrandService');
const brandService = new BrandService(db);
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// GET /brands - Fetch all brands
router.get('/', async (req, res) => {
    /*
        #swagger.tags = ['Brands']
        #swagger.summary = 'Fetch all brands'
        #swagger.description = 'Fetches all brands from the database'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/BrandsFetched'
            }
        }
    */
    try {
        const result = await brandService.brands();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viewing all brands.',
                brands: result
            }
        });

    } catch (err) {
        console.error('Failed to get brands:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting brands.',
            }
        });
    }
})

// POST /brands - Create a new brand (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Brands']
        #swagger.summary = 'Create a new brand'
        #swagger.description = 'Create a new brand. Requires admin authentication'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Brand name to be created',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/CreateBrand'
            }
        }
        #swagger.responses[201] = {
            'schema': {
                $ref: '#/definitions/BrandCreated'
            }
        }
    */
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'name is required.'
            }
        })
    }

    try {

        const brandExists = await brandService.getName(name);

        if (brandExists) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                data: {
                    result: `${brandExists.Name} already exists.`
                }
            });
        }

        const result = await brandService.create(name);

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                result: 'Created new brand.',
                brand: result
            }
        });

    } catch (err) {
        console.error('Failed to create brand:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred creating brand.',
            }
        });
    }
})

// PUT /brands/id - Update an existing brand (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Brands']
        #swagger.summary = 'Update a brand'
        #swagger.description = 'Update a brand name by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the brand to update',
            'required': 'true',
            type: 'integer'    
        }
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Updated brand name',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/UpdateBrand'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/BrandUpdated'
            }
        }
    */

    const id = parseInt(req.params.id);
    const { name } = req.body;
    const brandExists = await brandService.getName(name)

    if (brandExists && brandExists.id !== id) {
        return res.status(409).json({
            status: 'error',
            statusCode: 409,
            data: {
                result: `${brandExists.Name} already exists.`
            }
        });
    }
    

    if (!name) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'name is required.'
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

    

    if (brandExists) {
        return res.status(409).json({
            status: 'error',
            statusCode: 409,
            data: {
                result: 'Brand already exists.'
            }
        });
    }

    try {
        // Check if brand provided exists
        const brand = await brandService.getOne(id);

        if (!brand) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Brand not found.'
                }
            })
        };

        const result = await brandService.update(name, id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Brand is updated.',
                brand: result
            }
        })

    } catch (err) {
        console.error('Failed to update brand:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred updating brand.',
            }
        });
    }
})

// DELETE /brands/id - Delete a brand (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Brands']
        #swagger.summary = 'Delete a brand'
        #swagger.description = 'Delete a brand by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the brand to be deleted'
            'required': 'true',
            type: 'integer'
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/BrandDeleted'
            }
        }
    */

    const id = parseInt(req.params.id);

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
        // Check if brand provided exists
        const brand = await brandService.getOne(id);

        if (!brand) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Brand not found.'
                }
            })
        };

        await brandService.remove(id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Brand is deleted.'
            }
        })

    } catch (err) {
        console.error('Failed to delete brand:', err);

        if (err.message === 'Product with brand is in use.') {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                data: {
                    result: 'A product with the brand name is in use.'
                }
            })
        }
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred deleting brand.',
            }
        });

    }
})

module.exports = router;