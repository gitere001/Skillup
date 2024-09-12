import sequelize from './db.js';

import User from '../modules/users.js';
import Course from '../modules/course.js';
import Lesson from '../modules/lesson.js';


const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

export default syncDatabase;
