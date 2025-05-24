const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('User', {
  id : {
    type : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey : true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: DataTypes.STRING(20),
  location: DataTypes.STRING(100),
  university: DataTypes.STRING(100),
  major: DataTypes.STRING(100),
  gpa: DataTypes.STRING(10),
  company: DataTypes.STRING(100),
  jobTitle: DataTypes.STRING(100),
  duration: DataTypes.STRING(100),
  description: DataTypes.TEXT,
  skills: DataTypes.TEXT,
  github: DataTypes.STRING(200),
  linkedin: DataTypes.STRING(200),
  cv_url: DataTypes.STRING(500),
}, {
   timestamps: true,
   tableName : 'Users',
});

module.exports = { User };
