module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define('Brand', {
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

    Brand.associate = (models) => {
        Brand.hasMany(models.Product, { foreignKey: { allowNull: false } });
    }
    
    return Brand;
}