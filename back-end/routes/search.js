const express = require('express');
const router = express.Router();
const db = require('../models');
const SearchService = require('../services/SearchService');
const searchService = new SearchService(db);
const { allUsers } = require('../middleware/authMiddleware');

// GET /search - All users can search, only Admin can see deleted items
router.get('/', allUsers, async (req, res) => {
    const searchParam = req.query;
    try {
        const adminUser = req.user?.role === 1;
        
        const result = await searchService.searchProds(searchParam, adminUser);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Search request:',
                search: result
            }
        });
    } catch (err) {
        console.error('Error searching for product:', err)
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: err.message || 'Failed to search.'
            }
        });
    }
})


module.exports = router;