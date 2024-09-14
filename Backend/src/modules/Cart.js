import { DataTypes } from "sequelize"
import sequelize from "../storage/db"
import user from "./users"
//import video from './video.js

const Cart = sequelize.define('Cart', {
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,

    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
})

//relationship between users and videos
Cart.belongsTo(user)
Cart.belongsTo(Video)

export default Cart