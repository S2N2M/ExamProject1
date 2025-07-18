module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        Name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
    );

    Category.associate = (models) => {
        Category.hasMany(models.Product, { foreignKey: { allowNull: false } });
    }

    return Category;
}