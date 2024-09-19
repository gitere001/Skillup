import { DataTypes } from 'sequelize';
import sequelize from '../storage/db.js';
import { v4 as uuidv4 } from 'uuid';

const UserPurchasedCourse = sequelize.define('UserPurchasedCourse', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'learners',  // Assuming your users table is named 'users'
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'courses',  // Assuming your courses table is named 'courses'
            key: 'id'
        }
    },
    purchaseDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'user_purchased_courses'
});

export default UserPurchasedCourse;
