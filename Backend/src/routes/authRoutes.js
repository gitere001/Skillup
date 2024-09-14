import express from 'express';
import { register } from '../controllers/AuthController.js'
import AppController from '../controllers/AppController.js';
import FileController from '../controllers/FileController.js';
import validateRegistration from '../middlewares/inputValidation.js';
import validateCourseCreation from '../middlewares/creatingCourse.js';
import validateLesson from '../middlewares/addLessonValidation.js';
import parseForm from '../utils/parseForm.js';

const router = express.Router()

router.get('/status', AppController.getStatus);

//Route for register
router.post('/register', validateRegistration, register)
router.post('/courses', validateCourseCreation, FileController.createNewCourse)
router.get('/courses', FileController.getUserCourses)
router.post('/courses/:courseId/lessons', parseForm, validateLesson, FileController.addLesson)
router.delete('/courses/:courseId', FileController.deleteCourse);
router.delete('/courses/:courseId/lessons/:lessonId', FileController.deleteLesson);
router.get('/courses/:courseId/lessons', FileController.getLessonsByCourse);
router.put('/courses/:courseId/lessons/:lessonId', FileController.updateLesson);



//Router for login
//router.login('/login', login)

export default router