import LearnerController from "../controllers/LearnerController.js";

import express from 'express';
const learnerRouter = express.Router();
learnerRouter.get('/learner/welcome-note', LearnerController.getWelcomeNote);
learnerRouter.get('/learner/available-courses', LearnerController.getAvailableCourses);
learnerRouter.get('/learner/search', LearnerController.searchCourse);
learnerRouter.get('/learner/purchased-courses', LearnerController.getLearnerPurchasedCourses);
learnerRouter.get('/learner/courses/:courseId/lessons', LearnerController.getLessonsBasedOnCourseId);
export default learnerRouter