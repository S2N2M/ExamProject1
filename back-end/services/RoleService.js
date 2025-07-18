class RoleService {
    constructor(db) {
        this.client = db.sequelize
        this.Role = db.Role
        this.User = db.User
    }

    // Fetch all roles
    async roles() {
        try {
            return await this.Role.findAll();
        } catch (err) {
            console.error('Error getting roles.');
            throw new Error('Failed to get roles.');
        }
    }

    // Fetch user's role
    async getUserRole(id) {
        try {
            const user = await this.User.findByPk(id);
            if (!user) {
                throw new Error('User not found.');
            }
            return await this.Role.findByPk(user.RoleId);
        } catch (err) {
            console.error('Error getting users role:', err.message);
            throw new Error('Failed to get the users role');
        }
    }
}

module.exports = RoleService;