/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'username'
    },
    password: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'password'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedAt'
    },
    staffId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'people',
        key: 'id'
      },
      field: 'staff_id'
    },
    accessLevelId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'access_levels',
        key: 'id'
      },
      field: 'access_level_id'
    }
  }, {
    tableName: 'users'
  });
};
