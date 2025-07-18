class MembershipService {
    constructor(db) {
        this.client = db.sequelize
        this.Membership = db.Membership
        this.User = db.User
    }

    // Fetch all membership status
    async memberships() {
        try {
            return await this.Membership.findAll();
        } catch (err) {
            console.error('Error getting memberships.');
            throw new Error('Failed to get memberships.');
        }
    }

    // Fetch all users membership status
    async allMemberships() {
        try {
            const users = await this.User.findAll({
                attributes: ['Firstname', 'Lastname', 'Username', 'Email'],
                include: [
                    {
                        model: this.Membership,
                        attributes: ['Status']
                    }
                ]
            })

            const membershipStatus = { Gold: [], Silver: [], Bronze: [] };

            users.forEach((user) => {
                const status = user.Membership.Status;
                if (status && membershipStatus[status]) {
                    membershipStatus[status].push(user);
                }
            })

            return membershipStatus;
            
        } catch (err) {
            console.error('Error getting users memberships');
            throw new Error('Failed to get users memberships')
        }
    }

    // Fetch user's membership
    async getUserMembership(id) {
        try {
            const user = await this.User.findByPk(id);
            if (!user) {
                throw new Error('User not found.');
            }
            return await this.Membership.findByPk(user.MembershipId);
        } catch (err) {
            console.error('Error getting users membership');
            throw new Error('Failed to get the users membership');
        }
    }

    // Update the user's membership status based on total items purchased
    async updateMembership(id, totalPurchases) {
        // Sort by MinItems in ascending order
        const memberships = await this.Membership.findAll({
            order: [['MinItems', 'ASC']]
        })

        // Default to lowest membership status (bronze)
        let updatedMembership = memberships[0];

        // Loop through to determine correct status
        memberships.forEach(m => {
            if (totalPurchases >= m.MinItems && (!m.MaxItems || totalPurchases < m.MaxItems)) {
                updatedMembership = m;
            }
        })

        // Update the user's membership status
        await this.User.update(
            { MembershipId: updatedMembership.id },
            { where: { id: id } },
        )

        // Return the updated membership information 
        return updatedMembership;
    }
    
}

module.exports = MembershipService;