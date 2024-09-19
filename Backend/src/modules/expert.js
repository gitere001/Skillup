// models/Expert.js
import { DataTypes } from 'sequelize';
import sequelize from '../storage/db.js';
import { v4 as uuidv4 } from 'uuid';

const Expert = sequelize.define('Expert', {
	id: {
		type: DataTypes.UUID,
		defaultValue: uuidv4,
		primaryKey: true,
		allowNull: false
	},
  firstName: {
	type: DataTypes.STRING,
	allowNull: false
  },
  lastName: {
	type: DataTypes.STRING,
	allowNull: false
  },
  email: {
	type: DataTypes.STRING,
	allowNull: false
  },
  password: {
	type: DataTypes.STRING,
	allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('mpesa', 'bank'),
    allowNull: false
  },
  bankName: {
    type: DataTypes.ENUM('cooperative', 'absa', 'kcb', 'equity'),
    allowNull: true
  },
  bankAccountNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
	type: DataTypes.STRING,
	defaultValue: 'expert',
	allowNull: false

  },
  mpesaNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: true,
  tableName: 'experts'
});


export default Expert;
