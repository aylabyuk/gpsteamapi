/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sites', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    name: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      unique: true,
      field: 'name'
    },
    markerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'markers',
        key: 'id'
      },
      field: 'marker_id'
    },
    surveyTypeId: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      references: {
        model: 'survey_types',
        key: 'id'
      },
      field: 'survey_type_id'
    },
    dateEstablished: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_established'
    },
    latitude: {
      type: "DOUBLE",
      allowNull: true,
      field: 'latitude'
    },
    longitude: {
      type: "DOUBLE",
      allowNull: true,
      field: 'longitude'
    },
    location: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'location'
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'description'
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
    tableName: 'sites'
  });
};
