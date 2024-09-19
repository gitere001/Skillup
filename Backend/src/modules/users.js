import { DataTypes } from 'sequelize';
import sequelize from '../storage/db.js';
import { v4 as uuidv4 } from 'uuid';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
	type: DataTypes.STRING,
	allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'learner',
    allowNull: false
  },
}, {
  timestamps: true,
  tableName: 'learners'
});

export default User;
