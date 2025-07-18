const express = require('express');
const router = express.Router();
const db = require('../models');
const CategoryService = require('../services/CategoryService');
const categoryService = new CategoryService(db);
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// GET /categories - Fetch all categories
router.get('/', async (req, res) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = 'Fetch all categories'
        #swagger.description = 'Fetches all categories from the database'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/CategoriesFetched'
            }
        }
    */
    try {
        const result = await categoryService.categories();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viwing all categories.',
                categories: result

            }
        });

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
})

// POST /categories - Create a new category (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = 'Create a new category'
        #swagger.description = 'Create a new category. Requires admin authentication'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Category name to be created',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/CreateCategory'
            }
        }
        #swagger.responses[201] = {
            'schema': {
                $ref: '#/definitions/CategoryCreated'
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

        const categoryExists = await categoryService.getName(name);

        if (categoryExists) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                data: {
                    result: `${categoryExists.Name} already exists.`
                }
            });
        }

        const result = await categoryService.create(name);

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                result: 'Created new category.',
                category: result
            }
        });

    } catch (err) {
        console.error('Failed to create category:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred creating category.',
            }
        });
    }
})

// PUT /categories/id - Update an existing category(Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = 'Update a category'
        #swagger.description = 'Update a category name by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the category to update',
            'required': 'true',
            type: 'integer'    
        }
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Updated category name',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/UpdateCategory'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/CategoryUpdated'
            }
        }
    */
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const categoryExists = await categoryService.getName(name)

    if (categoryExists && categoryExists.id !== id) {
        return res.status(409).json({
            status: 'error',
            statusCode: 409,
            data: {
                result: `${categoryExists.Name} already exists.`
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

    try {
        // Check if category provided exists
        const category = await categoryService.getOne(id);

        if (!category) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Category not found.'
                }
            })
        };

        const result = await categoryService.update(name, id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Category is updated.',
                category: result
            }
        })

    } catch (err) {
        console.error('Failed to update category:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred updating category.',
            }
        });
    }
})

// DELETE /categories/:id - Delete a category (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = 'Delete a category'
        #swagger.description = 'Delete a category by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the category to be deleted'
            'required': 'true',
            type: 'integer'
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/CategoryDeleted'
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
        // Check if category provided exists
        const category = await categoryService.getOne(id);

        if (!category) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Category not found.'
                }
            })
        };

        await categoryService.remove(id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Category is deleted.'
            }
        })

    } catch (err) {
        console.error('Failed to delete category:', err);

        if (err.message === 'Product with category is in use.') {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                data: {
                    result: 'A product with the category name is in use.'
                }
            })
        }
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred deleting category.',
            }
        });

    }
})

module.exports = router;