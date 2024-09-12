import { DataTypes } from "sequelize";
import sequelize from "../storage/db.js";
import { v4 as uuidv4 } from "uuid";

const categories = [
    'Finance & investment',
    'Business & Entrepreneurship',
    'Technology & programming',
    'Agriculture',
    'Education',
    'Health & wellness',
    'Legal & Regulatory',
    'Personal Development',
    'Others'
];

const Course = sequelize.define("LessionFolder", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false
    },
    expertId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM(...categories),
        allowNull: false,
        defaultValue: 'Others'
    },
    coursePath: {
        type: DataTypes.STRING,
        allowNull: true

    },
	status: {
		type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'rejected'),
		defaultValue: 'draft'
	  }
}, {
    timestamps: true,
    tableName: "courses"
});

export default Course;
