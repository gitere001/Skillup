import { DataTypes } from "sequelize";
import sequalize from "../storage/db.js";
import { v4 as uuidv4 } from "uuid";

const Admin = sequalize.define("Admin", {
	id: {
		type: DataTypes.UUID,
		defaultValue: uuidv4,
		primaryKey: true
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
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	role: {
		type: DataTypes.ENUM('admin'),
		allowNull: false,
		defaultValue: "admin"
	},
	category: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
	timestamps: true,
	tableName: 'admins'
});


export default Admin;
