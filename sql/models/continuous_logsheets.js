/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('continuousLogsheets', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    isPowerOn: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'is_power_on'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'date'
    },
    receiverId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'receivers',
        key: 'id'
      },
      field: 'receiver_id'
    },
    antennaId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'antennas',
        key: 'id'
      },
      field: 'antenna_id'
    },
    batteryCondition: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'battery_condition'
    },
    chargerCondition: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'charger_condition'
    },
    otherNotes: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'other_notes'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt'
    }
  }, {
    tableName: 'continuous_logsheets'
  });
};
