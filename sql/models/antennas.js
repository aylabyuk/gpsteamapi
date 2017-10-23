/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('antennas', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    antennaModelId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'antenna_models',
        key: 'id'
      },
      field: 'antenna_modelId'
    },
    serialNumber: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: 'serial_number'
    },
    partNumber: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'part_number'
    },
    retirementDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'retirement_date'
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
    }
  }, {
    tableName: 'antennas'
  });
};
