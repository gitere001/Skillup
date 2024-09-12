import { DataTypes } from "sequelize";
import sequelize from "../storage/db.js";

const Lesson = sequelize.define("Lesson", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
