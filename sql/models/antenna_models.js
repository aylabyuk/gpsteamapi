/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('antennaModels', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'name'
    },
    equipmentBrandId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'equipment_brands',
        key: 'id'
      },
      field: 'equipment_brandId'
    }
  }, {
    tableName: 'antenna_models'
  });
};
