module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
        Status: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        MinItems: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        MaxItems: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
        },
        DiscountPercent: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
    );

    Membership.associate = (models) => {
        Membership.hasMany(models.User, { foreignKey: { allowNull: false } });
    };
    
    return Membership
}