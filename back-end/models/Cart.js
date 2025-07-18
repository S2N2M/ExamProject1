module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
       
    }
    );

    Cart.associate = (models) => {
        Cart.belongsTo(models.User, { foreignKey: { allowNull: false } });
        Cart.hasMany(models.CartItem, { foreignKey: { allowNull: false } });
    }

    return Cart;
}