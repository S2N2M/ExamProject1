const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductService = require('../services/ProductService');
const productService = new ProductService(db);
const { allUsers, authenticate, isAdmin } = require('../middleware/authMiddleware');

// Validators for adding and updating products
function validateProduct(data) {
    const errors = [];
    const { imgurl, name, description, price, quantity, categoryId, brandId } = data;

    if (!imgurl) errors.push('Missing property: imgurl');
    if (!name) errors.push('Missing property: name');
    if (!description) errors.push('Missing property: description');
    if (!price) errors.push('Missing property: price');
    if (!quantity) errors.push('Missing property: quantity');
    if (!categoryId) errors.push('Missing property: categoryId');
    if (!brandId) errors.push('Missing property: brandId');
    
    if (isNaN(price) || price < 0) {
        errors.push('Invalid price. Must be a non-negative number.')
    };

    if (isNaN(quantity) || quantity < 0) {
        errors.push('Invalid quantity. Must be a non-negative integer.')
    };

    if (isNaN(categoryId)) {
        errors.push('Invalid categoryId. Must be a non-negative number.')
    };

    if (isNaN(brandId)) {
        errors.push('Invalid brandId. Must be a non-negative number.')
    }

    return errors;
}

// GET /products - Fetch all products, show deleted products if user is an Admin
router.get('/', allUsers, async (req, res) => {
    /*
        #swagger.tags = ['Products']
        #swagger.summary = 'Fetch all products'
        #swagger.description = 'Fetch all products from the database. Requires admin authentication to see soft-deleted products'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/ProductsFetched'
            }
        }
    */

    try {
        const adminUser = req.user?.role === 1; // Check if role is 1 (Admin)

        const result = await productService.products(adminUser);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Viwing all products.',
                products: result
            }
        });
    } catch (err) {
        console.error('Failed to get products:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting products.',
            }
        });
    }
})

// GET /products/id - Fetch product by ID (Admin only)
router.get('/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Products']
        #swagger.summary = 'Fetch a product'
        #swagger.description = 'Fetch a product by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the product to view'
            'required': 'true',
            type: 'integer'
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/ProductFetched'
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
        const result = await productService.getProd(id);

        if (!result) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Product not found.'
                }
            });
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Product found:',
                product: result
            }
        });
    } catch (err) {
        console.error('Failed to get product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred getting product.',
            }
        });
    }
})

// POST /products - Add a new product (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Products']
        #swagger.summary = 'Add a new product'
        #swagger.description = 'Add a new product to the collection. Requires admin authentication'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Add product',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/CreateProduct'
            }
        }
        #swagger.responses[201] = {
            'schema': {
                $ref: '#/definitions/ProductCreated'
            }
        }
    */
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'Product data is required to add a new product.'
            }
        });
    }

    const productData = req.body;
    const errors = validateProduct(productData);

    if (errors.length) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: errors.join(', ')
            }
        });
    }

    try {

        const productExists = await productService.getName(productData);

        if (productExists) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                data: {
                    result: 'Product already exists.'
                }
            });
        }
        

        const result = await productService.create(productData);

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                result: 'Created a new product:',
                product: result
            }
        })
    } catch (err) {
        console.error('Failed to create product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred creating product.'
            }
        })
    }
})

// PUT /products/id - Update an existing product (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    /*  
        #swagger.tags = ['Products']
        #swagger.summary = 'Update a product'
        #swagger.description = 'Update a product by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the product to update',
            'required': 'true',
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Update a product',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/UpdateProduct'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/ProductUpdated'
            }
        }
    */
    const id = parseInt(req.params.id);

    // Validate if request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'Product data is required for update.'
            }
        });
    }
    const productData = req.body;
    const errors = validateProduct(productData);
    const productExists = await productService.getName(productData);

    if (productExists && productExists.id !== id) {
        return res.status(409).json({
            status: 'error',
            statusCode: 409,
            data: {
                result: 'Product already exists.'
            }
        });
    }

    if (errors.length) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: errors.join(', ')
            }
        });
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
        const product = await productService.getOne(id)

        if (!product) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Product not found.'
                }
            })
        };

        const result = await productService.update(productData, id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Product is updated.',
                product: {
                    result
                }
            }
        })

    } catch (err) {
        console.error('Failed to update product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred updating product.'
            }
        })
    } 
})

// DELETE /products/id - Soft-delete an existing product (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Products']
        #swagger.summary = 'Delete a product'
        #swagger.description = 'Soft-delete a product by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the product to delete',
            'required': 'true',
            type: 'integer'
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/ProductDeleted'
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
        // Check if product with provided ID exists
        const product = await productService.getOne(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Product not found.'
                }
            })
        };

        await productService.softDelete(id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Product is deleted.'
            }
        })
        

    } catch (err) {
        console.error('Failed to delete product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred deleting product.'
            }
        })
    }
})

// PUT /products/restore/id - Restore soft-deleted product (Admin only)
router.put('/restore/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Products']
        #swagger.summary = 'Restore a product'
        #swagger.description = 'Restore a soft-deleted product by ID. Requires admin authentication'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the product to restore',
            'required': 'true',
            type: 'integer'
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/ProductRestored'
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
        // Check if product with provided ID exists
        const product = await productService.getOne(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'Product not found.'
                }
            })
        };

        await productService.restore(id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Product is restored.'
            }
        })
        

    } catch (err) {
        console.error('Failed to restore product:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred restoring product.'
            }
        })
    }
})

module.exports = router;