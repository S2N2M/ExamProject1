class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Product = db.Product;
    }

    // Fetch all categories from the database
    async categories() {
        try {
            return await this.Category.findAll({
                order: [['id', 'ASC']]
            });
        } catch (err) {
            console.error('Error getting categories:', err.message);
            throw new Error('Failed to get categories');
        }
    }

    // Fetch category by name
    async getName(name) {
        try {
            return await this.Category.findOne({
                where: { Name: name }
            })
        } catch (err) {
            console.error('Error finding name:', err.message);
            throw new Error('Failed to find category name.')
        }
    }

    // Fetch category by ID
    async getOne(id) {
        try {
            return await this.Category.findByPk(id);
        } catch (err) {
            console.error('Error finding category by ID:', err.message);
            throw new Error('Failed to find category by ID.')
        }
    }

    // Create a new category
    async create(name) {
        try {
            return await this.Category.create({
                Name: name
            })
        } catch (err) {
            console.error('Error creating category:', err.message);
            throw new Error('Failed to create new category.')
        }
    }

    // Update an existing category's name
    async update(name, id) {
        try {
            const [updateCategory] = await this.Category.update({
                Name: name
            }, { where: { id: id } });

            if (!updateCategory) {
                throw new Error('category not found or no changes made.')
            }

            return this.Category.findByPk(id);
        } catch (err) {
            console.error('Error updating category:', err.message);
            throw new Error('Failed to update category.');
        }
    }

    // Remove the category
    async remove(id) {
        try {
            // Check if category is used by any products
            const categoryUsed = await this.Product.findAll({
                where: { CategoryId: id }
            });

            // If category is not used, remove the category
            if (categoryUsed.length === 0) {
                await this.Category.destroy({ where: { id } })
            } else {
                throw new Error('Product with category is in use.')
            }
        } catch (err) {
            console.error('Error deleting category:', err.message);
            throw err;
        }
    }

}

module.exports = CategoryService;