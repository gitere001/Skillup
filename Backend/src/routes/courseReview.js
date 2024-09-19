import CourseReviewController from "../controllers/CourseReview.js";

import express from 'express';

const courseReviewRouter = express.Router();
courseReviewRouter.get('/admin/welcome-note', CourseReviewController.getWelcomeNote);
courseReviewRouter.get('/admin/courses', CourseReviewController.getCoursesOfAdminExpertise);
courseReviewRouter.post('/admin/courses/:courseId/approve', CourseReviewController.approveCourse);
courseReviewRouter.post('/admin/courses/:courseId/reject', CourseReviewController.rejectCourse);

export default courseReviewRouter