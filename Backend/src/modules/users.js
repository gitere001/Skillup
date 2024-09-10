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
    unique: true
  },
  lastName: {
	type: DataTypes.STRING,
	allowNull: false,
	unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('learner', 'instructor'),
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'users'
});

export default User;
