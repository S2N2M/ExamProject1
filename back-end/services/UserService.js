const { Op } = require('sequelize');

class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Role = db.Role;
        this.Membership = db.Membership;
    }

    // Fetch user by username
    async getOne(username) {
        try {
            return await this.User.findOne({
                where: { Username: username }
            })
        } catch (err) {
            console.error('Error finding username:', err.message);
            throw new Error('Failed to find username');
        }
    }
    
    // Verifies if a user exists by checking email and username
    async verifyUser(userData) {
        try {
            return await this.User.findOne({
                where: {
                    [Op.or]: {
                        Email: userData.email,
                        Username: userData.username,
                    }
                }
            });
        } catch (err) {
            console.error('Error finding user:', err.message);
            throw new Error('Failed to find user');
        }
    }

    // Create a new user
    async create(userData, encryptedPassword, salt) {
        try {
            return await this.User.create({
                Firstname: userData.firstname,
                Lastname: userData.lastname,
                Username: userData.username,
                Email: userData.email,
                EncryptedPassword: encryptedPassword,
                Salt: salt,
                Address: userData.address,
                Phone: userData.phone,
                MembershipId: 1, // Default Bronze membership
                RoleId: 2, // Default User role
            });
        } catch (err) {
            console.error('Error creating email', err.message);
            throw new Error('Failed to create user');
        }
    }

    // Fetch all users with necessary data
    async users() {
        try {
            const users = await this.User.findAll({
                attributes: { exclude: ['EncryptedPassword', 'Salt', 'createdAt', 'updatedAt'] }, // Exclude from User table
                include: [
                    {
                        model: this.Membership,
                        attributes: ['Status'] // Include Name column from Membership
                    },
                    {
                        model: this.Role,
                        attributes: ['Name'] // Include Name column from Role
                    }
                ]
            })
            return users;   
        } catch (err) {
            console.error('Error getting users:', err.message);
            throw new Error('Failed to get users')
        }
    }

    // Fetch user by ID
    async getUser(id) {
        try {
            return await this.User.findByPk(id, {
                attributes: { exclude: ['EncryptedPassword', 'Salt'] } // Exclude password and salt from table
            })
        } catch (err) {
            console.error('Error finding user:', err.message);
            throw new Error('Failed to find user');
        }
    }

    // Update an existing User
    async update(userData, id) {
        try {
            const [updateUser] = await this.User.update({
                Firstname: userData.firstname,
                Lastname: userData.lastname,
                Username: userData.username,
                Email: userData.email,
                Address: userData.address,
                Phone: userData.phone,
                MembershipId: userData.membershipId,
                RoleId: userData.roleId
            }, { where: { id: id } });

            if (!updateUser) {
                throw new Error('User not found or no changes made.')
            }

            return await this.User.findByPk(id, {
                attributes: { exclude: ['EncryptedPassword', 'Salt', 'createdAt', 'updatedAt'] }
            });
        } catch (err) {
            console.error('Error updating user:', err.message);
            throw err;
        }
    }
}

module.exports = UserService;