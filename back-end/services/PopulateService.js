const axios = require('axios');
const crypto = require('crypto');

class PopulateService {
    constructor (db){
        this.client = db.sequelize;
        this.Product = db.Product;
        this.Category = db.Category;
        this.Brand = db.Brand;
        this.User = db.User;
        this.Membership = db.Membership;
        this.Role = db.Role;
    }

    async populateDatabase() {
        const messages = [];
        let dataCreated = false;

        try {
            // Check for products in the database, create if not found.
            const countProduct = await this.Product.count();
            if (countProduct > 0) {
                messages.push('Products already exists.')
            } else {
                const response = await axios.get('http://backend.restapi.co.za/items/products');
                const products = response.data.data;

                for (const product of products) {
                    const [brand] = await this.Brand.findOrCreate({
                        where: { Name: product.brand }
                    });

                    const [category] = await this.Category.findOrCreate({
                        where: { Name: product.category }
                    });

                    await this.Product.findOrCreate({
                        where: {
                            Imgurl: product.imgurl,
                            Name: product.name,
                            Description: product.description,
                            Price: product.price,
                            Quantity: product.quantity,
                            BrandId: brand.id,
                            CategoryId: category.id,
                        }
                    });
                }
                messages.push('Created products in the database.')
                dataCreated = true;
            }

             // Check for memberships in the database, create if not found.
            const countMembership = await this.Membership.count();
            if (countMembership > 0) {
                messages.push('Memberships already exists')
            } else {
                const membershipData = [
                    { Status: 'Bronze', MinItems: 0, MaxItems: 15, DiscountPercent: 0 },
                    { Status: 'Silver', MinItems: 16, MaxItems: 30, DiscountPercent: 15 },
                    { Status: 'Gold', MinItems: 31, MaxItems: null, DiscountPercent: 30 },
                ];
              
                for (const membership of membershipData) {
                    await this.Membership.findOrCreate({
                        where: { 
                        Status: membership.Status, 
                        MinItems: membership.MinItems,
                        MaxItems: membership.MaxItems,
                        DiscountPercent: membership.DiscountPercent,
                        },
                    });
                }
                messages.push('Created memberships in the database.');
                dataCreated = true;
            }

            // Check for roles in the database, create if not found.
            const countRole = await this.Role.count();
            if (countRole > 0) {
                messages.push('Roles already exists');
            } else {
                const roles = ['Admin', 'User'];
                for (const role of roles) {
                    await this.Role.findOrCreate({ where: { Name: role } });
                }
                messages.push('Created roles in the database.');
                dataCreated = true;
            }

            // Check for Admin user in the database, create if not found.
            const admin = await this.User.findOne({ where: { username: 'Admin' } });
            if (admin) {
                messages.push('Default Admin user already exists.')
            } else {
                const salt = crypto.randomBytes(16)
                const hashedPassword = await new Promise((resolve, reject) => {
                    crypto.pbkdf2('P@ssword2023', salt, 310000, 32, "sha256", (err, hash) => {
                        if (err) return reject(err)
                        resolve(hash)
                    })
                })
                await this.User.create({ Firstname: 'Admin', Lastname: 'Support', Username: 'Admin', Email: 'admin@noroff.no', EncryptedPassword: hashedPassword, Salt: salt, Address: 'Online', Phone: '911', MembershipId: 3, RoleId: 1, })
                messages.push('Created default Admin user.');
                dataCreated = true;
            }
    
            return { messages, dataCreated }
        } catch (err) {
            console.error('Error initilizing database:', err.message);
            throw new Error('Failed to populate database.');
        }
    }
}

module.exports = PopulateService;