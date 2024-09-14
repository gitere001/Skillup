import { DataTypes } from "sequelize";
import sequelize from "../storage/db.js";
import { v4 as uuidv4 } from "uuid";

const Lesson = sequelize.define("Lesson", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "courses",
            key: "id"
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contentPath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    videoPath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: "lessons"
});

export default Lesson;
