module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        OrderNumber: {
            type: Sequelize.DataTypes.STRING(8),
            unique: true,
            allowNull: false,
        },
        Status: {
            type: Sequelize.DataTypes.ENUM('In Progress', 'Ordered', 'Completed'),
            defaultValue: 'In Progress',
        },
        MembershipStatus: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        TotalPrice: {
            type: Sequelize.DataTypes.DECIMAL(8,2),
            allowNull: false
        }
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, { foreignKey: { allowNull: false } } );
        Order.hasMany(models.OrderItem, { foreignKey: { allowNull: false } } );
    };

    return Order;
}