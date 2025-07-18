module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        Name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false,
        }
    },
    {
        timestamps: false
    }
    );

    Role.associate = (models) => {
        Role.hasMany(models.User, { foreignKey: { allowNull: false } });
    };

    return Role
}