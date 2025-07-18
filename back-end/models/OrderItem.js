module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        Quantity: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        PriceAtTime: {
            type: Sequelize.DataTypes.DECIMAL(8,2),
            allowNull: false,
        }
    });

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, { foreignKey: { allowNull: false } });
        OrderItem.belongsTo(models.Product, { foreignKey: { allowNull: false } });
    };

    return OrderItem;
}