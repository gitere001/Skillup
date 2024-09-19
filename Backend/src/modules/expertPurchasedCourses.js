import { DataTypes } from 'sequelize';
import sequelize from '../storage/db.js';
import { v4 as uuidv4 } from 'uuid';

const ExpertPurchasedCourse = sequelize.define('ExpertPurchasedCourse', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    expertId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'experts',
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.ENUM('not disbursed', 'disbursed'),
        defaultValue: 'not disbursed',
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'expert_purchased_courses'
});

export default ExpertPurchasedCourse;
