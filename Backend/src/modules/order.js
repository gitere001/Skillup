import { DataTypes } from 'sequelize';
import sequelize from '../storage/db.js';
import { generateOrderId } from '../utils/orderIdCreation.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING,
        defaultValue: () => generateOrderId(),
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'learners',
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'canceled', 'refund-requested'),
        defaultValue: 'pending'
    },
    paymentDetails: {
        type: DataTypes.JSONB, // Storing payment details as a JSON object
        allowNull: true
    },
    courseIds: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true
    },
}, {
    timestamps: true,
    tableName: 'orders'
});

export default Order;
