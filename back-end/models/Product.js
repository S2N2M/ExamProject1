module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
        Imgurl: { 
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Price: {
            type: Sequelize.DataTypes.DECIMAL(8,2),
            allowNull: false,
        },
        Quantity: { 
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        DataAdded: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.DataTypes.NOW
        },
        IsDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        createdAt: false
    }
    );

    Product.associate = (models) => {
        Product.belongsTo(models.Brand, { foreignKey: { allowNull: false } });
        Product.belongsTo(models.Category, { foreignKey: { allowNull: false } });
        Product.hasMany(models.OrderItem, { foreignKey: { allowNull: false } });
        Product.hasMany(models.CartItem, { foreignKey: { allowNull: false } });
    }

    return Product;
}