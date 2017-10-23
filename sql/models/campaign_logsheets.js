/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('campaignLogsheets', {
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
      field: 'userId'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'date'
    },
    siteId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sites',
        key: 'id'
      },
      field: 'site_id'
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
    heightNorthMeters: {
      type: "DOUBLE",
      allowNull: false,
      field: 'height_north_meters'
    },
    heightEastMeters: {
      type: "DOUBLE",
      allowNull: false,
      field: 'height_east_meters'
    },
    heightSouthMeters: {
      type: "DOUBLE",
      allowNull: false,
      field: 'height_south_meters'
    },
    heightWestMeters: {
      type: "DOUBLE",
      allowNull: false,
      field: 'height_west_meters'
    },
    timeStart: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'time_start'
    },
    timeEnd: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'time_end'
    },
    failureTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'failure_time'
    },
    azimuth: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'azimuth'
    },
    notes: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'notes'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt'
    }
  }, {
    tableName: 'campaign_logsheets'
  });
};
