module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        Firstname: { 
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Lastname: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        EncryptedPassword: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
        Salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
        Address: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Phone: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Order, { foreignKey: { allowNull: false } });
        User.belongsTo(models.Membership, { foreignKey: { allowNull: false } });
        User.belongsTo(models.Role, { foreignKey: { allowNull: false } });
        User.hasOne(models.Cart, { foreignKey: { allowNull: false } });
    };

    return User;
}