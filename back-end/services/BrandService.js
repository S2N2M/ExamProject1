class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
        this.Product = db.Product;
    }

    // Fetch all brands from the database
    async brands() {
        try {
            return await this.Brand.findAll({
                order: [['id', 'ASC']]
            });
        } catch (err) {
            console.error('Error getting brands:', err.message);
            throw new Error('Failed to get brands');
        }
    }

    // Fetch brand by name
    async getName(name) {
        try {
            return await this.Brand.findOne({
                where: { Name: name }
            })
        } catch (err) {
            console.error('Error finding name:', err.message);
            throw new Error('Failed to find brand name.')
        }
    }

    // Fetch brand by ID
    async getOne(id) {
        try {
            return await this.Brand.findByPk(id);
        } catch (err) {
            console.error('Error finding brand by ID:', err.message);
            throw new Error('Failed to find brand by ID.')
        }
    }

    // Create a new brand
    async create(name) {
        try {
            return await this.Brand.create({
                Name: name
            })
        } catch (err) {
            console.error('Error creating brand:', err.message);
            throw new Error('Failed to create new brand.')
        }
    }

    // Update an existing brand's name
    async update(name, id) {
        try {
            const [updateBrand] = await this.Brand.update({
                Name: name
            }, { where: { id: id } });

            if (!updateBrand) {
                throw new Error('Brand not found or no changes made.')
            }

            return this.Brand.findByPk(id);
        } catch (err) {
            console.error('Error updating brand:', err.message);
            throw new Error('Failed to update brand.');
        }
    }

    // Remove the brand
    async remove(id) {
        try {
            // Check if brand is used by any products
            const brandUsed = await this.Product.findAll({
                where: { BrandId: id }
            });

            // If brand is not used, delete the brand
            if (brandUsed.length === 0) {
                await this.Brand.destroy({ where: { id } })
            } else {
                throw new Error('Product with brand is in use.')
            }
        } catch (err) {
            console.error('Error deleting brand:', err.message);
            throw err;
        }
    }

}

module.exports = BrandService;