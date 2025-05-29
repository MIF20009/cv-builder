const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const { User } = require('./User');

const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  degree: DataTypes.STRING(100),
  university: DataTypes.STRING(150),
  gpa: DataTypes.DECIMAL(3, 2),
}, {
  timestamps: true,
  tableName: 'Education'
});

// Set up relationship
User.hasMany(Education, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Education.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { Education };
