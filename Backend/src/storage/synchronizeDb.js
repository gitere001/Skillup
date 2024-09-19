import sequelize from './db.js';

import User from '../modules/users.js';
import Expert from '../modules/expert.js';
import Course from '../modules/course.js';
import Lesson from '../modules/lesson.js';
import Cart from '../modules/Cart.js';
import Order from '../modules/order.js';
import UserPurchasedCourse from '../modules/purchasedCourse.js';
import Admin from '../modules/admin.js';


const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

export default syncDatabase;
