const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

class SearchService {
    constructor(db) {
        this.client = db.sequelize;
    }

    /* Fetch all products based on search query with category and brand names using RAW SQL
    If user is not an admin, only show non-deleted products */
    async searchProds(searchParam, adminUser = false) {
        const { productName, categoryName, brandName } = searchParam;
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

        // Conditions based on search
        const data = [];

        if (productName) data.push(`p.Name LIKE '%${productName}%'`);
        if (categoryName) data.push(`c.Name = '${categoryName}'`);
        if (brandName) data.push(`b.Name = '${brandName}'`);
        
        if (data.length > 0) {
            query += adminUser ? ' WHERE ' : ' AND '
            query += data.join(' AND ')
        }
        
        const results = await sequelize.query(query, { type: QueryTypes.SELECT } );

        return { count: results.length, items: results };
    }

}

module.exports = SearchService;