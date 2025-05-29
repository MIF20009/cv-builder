const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const { User } = require('./User');

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company: DataTypes.STRING(150),
  job_title: DataTypes.STRING(100),
  duration: DataTypes.STRING(100),
  description: DataTypes.TEXT,
}, {
  timestamps: true,
  tableName: 'Experience'
});

// Set up relationship
User.hasMany(Experience, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Experience.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { Experience };
