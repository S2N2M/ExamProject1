module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        Quantity: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        }
    }
    );

    CartItem.associate = (models) => {
        CartItem.belongsTo(models.Product, { foreignKey: { allowNull: false } });
        CartItem.belongsTo(models.Cart, { foreignKey: { allowNull: false } });
    }

    return CartItem;
}