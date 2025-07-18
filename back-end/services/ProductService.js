const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

class ProductService {
    constructor (db) {
        this.client = db.sequelize;
        this.Product = db.Product;
        this.Category = db.Category;
        this.Brand = db.Brand;
    }

    
    /* Fetch all products with category and brand names using RAW SQL
    If user is not an admin, only show non-deleted products */
    async products(adminUser = false) {
        try {
            let query = `SELECT 
                p.id AS id,
                p.Name,
                p.Description,
                p.Price,
                p.Quantity,
                b.Name AS Brand,
                p.BrandId,
                c.Name AS Category,
                p.CategoryId,
                p.Imgurl,
                p.IsDeleted,
                p.DataAdded,
                p.updatedAt
            FROM products p
            JOIN brands b ON p.BrandId = b.id
            JOIN categories c ON p.CategoryId = c.id`

            // If the user is not an, filter out deleted products
            if (!adminUser) {
                query += ` WHERE p.IsDeleted = false`
            }
            
            const result = await sequelize.query(query, { type: QueryTypes.SELECT } );
            return result;
        } catch (err) {
            console.error('Error getting products:', err.message);
            throw new Error('Failed to get products.')
        }
    }

    // Fetch product by ID using RAW SQL
    async getProd(id) {
        try {
            let query = `
            SELECT 
                p.id AS id,
                p.Name AS Name,
                p.Description,
                p.Price,
                p.Quantity,
                b.Name AS Brand,
                p.BrandId,
                c.Name AS Category,
                p.CategoryId,
                p.Imgurl,
                p.IsDeleted,
                p.DataAdded,
                p.updatedAt
            FROM products p
            JOIN brands b ON p.BrandId = b.id
            JOIN categories c ON p.CategoryId = c.id
            WHERE p.id = ${id}`

            const [result] = await sequelize.query(query, { type: QueryTypes.SELECT } );
            return result;
        } catch (err) {
            console.error('Error getting product:', err.message);
            throw new Error('Failed to get product.')
        }
    }

    // Create a new product
    async create(productData) {
        try {
            return await this.Product.create({
                Imgurl: productData.imgurl,
                Name: productData.name,
                Description: productData.description,
                Price: productData.price,
                Quantity: productData.quantity,
                CategoryId: productData.categoryId,
                BrandId: productData.brandId
            })
        } catch (err) {
            console.error('Error creating products:', err.message);
            throw new Error('Failed to create product.')
        }
    }

    // Fetch product by ID
    async getOne(id) {
        try {
            return await this.Product.findByPk(id)
        } catch (err) {
            console.error('Error finding product by ID:', err.message);
            throw new Error('Failed to find PK.')
        }
    }

    // Update an existing product
    async update(productData, id) {
        try {
            const [updateProduct] = await this.Product.update({
                Imgurl: productData.imgurl,
                Name: productData.name,
                Description: productData.description,
                Price: productData.price,
                Quantity: productData.quantity,
                CategoryId: productData.categoryId,
                BrandId: productData.brandId
            }, { where: { id: id } });

            if (!updateProduct) {
                throw new Error('Product not found or no changes made.')
            }

            return await this.Product.findByPk(id);
        } catch (err) {
            console.error('Error updating product:', err.message);
            throw err;
        }
    }

    // Fetch product by name
    async getName(productData) {
        try {
            return await this.Product.findOne({
                where: { Name: productData.name }
            })
        } catch (err) {
            console.error('Error finding product:', err.message);
            throw new Error('Failed to find product name.');
        }
    }

    // Soft delete a product by setting IsDeleted to true
    async softDelete(id) {
        try {
            return await this.Product.update(
                { IsDeleted: true },
                { where: { id: id } });
        } catch (err) {
            console.error('Error deleting product:', err.message);
            throw new Error('Failed to delete product.')
        }
    }

    // Add product back by setting IsDeleted to false
    async restore(id) {
        try {
            return await this.Product.update(
                { IsDeleted: false },
                { where: { id: id } }

            )
        } catch (err) {
            console.error('Error restoring product:', err.message);
            throw new Error('Failed to restore product.')
        }
    }
}

module.exports = ProductService;