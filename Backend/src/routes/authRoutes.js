import express from 'express';
import { register } from '../controllers/AuthController.js'
import AppController from '../controllers/AppController.js';
import FileController from '../controllers/FileController.js';
import validateRegistration from '../middlewares/inputValidation.js';
import validateCourseCreation from '../middlewares/creatingCourse.js';
import validateLesson from '../middlewares/addLessonValidation.js';

const router = express.Router()

router.get('/status', AppController.getStatus);

//Route for register
router.post('/register', validateRegistration, register)
router.post('/courses', validateCourseCreation, FileController.createNewCourse)
router.post('/courses/:courseId/lessons', validateLesson, FileController.addLesson)

//Router for login
//router.login('/login', login)

export default router