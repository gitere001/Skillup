// src/routes/courseCreationRouter.js
import express from 'express';
import FileController from '../controllers/FileController.js';
import validateCourseCreation from '../middlewares/creatingCourse.js';
import validateLesson from '../middlewares/addLessonValidation.js';
import uploadFiles from '../utils/parseForm.js';

const courseCreationRouter = express.Router();

courseCreationRouter.get('/expert/welcome-note', FileController.getWelcomeNote);

courseCreationRouter.post('/courses', validateCourseCreation, FileController.createNewCourse);
courseCreationRouter.get('/courses', FileController.getExpertCourses);
courseCreationRouter.get('/expert-paid-courses', FileController.getExpertPaidCourses);
courseCreationRouter.post('/courses/:courseId/lessons', uploadFiles, validateLesson, FileController.addLesson);
courseCreationRouter.delete('/courses/:courseId', FileController.deleteCourse);
courseCreationRouter.delete('/courses/:courseId/lessons/:lessonId', FileController.deleteLesson);
courseCreationRouter.get('/expert/courses/:courseId/lessons', FileController.getLessonsByCourse);
courseCreationRouter.put('/courses/:courseId/lessons/:lessonId', FileController.updateLesson);
courseCreationRouter.post('/courses/:courseId/submit', FileController.submitCourse);


export default courseCreationRouter
