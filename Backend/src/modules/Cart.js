import { DataTypes } from "sequelize"
import sequelize from "../storage/db.js"
import User from "./users.js"
import Course from "./course.js"

const Cart = sequelize.define('Cart', {
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,

    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'learners',
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
}, { timestamps: true,
    tableName: 'carts'
 });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Course.hasMany(Cart, { foreignKey: 'courseId' });
Cart.belongsTo(Course, { foreignKey: 'courseId' });


export default Cart