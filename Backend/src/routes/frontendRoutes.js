import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const frontendRouter = express.Router();

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example route to serve the frontend
frontendRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../Frontend/views/landing-page/index.html'));
});

frontendRouter.get('/register-expert', (req, res) => {
	console.log('Registering an expert');
	res.sendFile(path.join(__dirname, '../../../Frontend/views/landing-page/expertForm.html'));
});
frontendRouter.get('/register-learner', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/landing-page/learnerForm.html'));
});
frontendRouter.get('/loginUsers', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/landing-page/login.html'));
});
frontendRouter.get('/author-profile', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/landing-page/Portfolio-Website/index.html'));
})
frontendRouter.get('/expert-dashboard', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/expertDashboard.html'));
});
frontendRouter.get('/create-course', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/courseCreation.html'));

})
frontendRouter.get('/lessons/:courseId', (req, res) => {
	const courseId = req.params.courseId; // Retrieve course ID from route params
	if (!courseId) {
	  return res.status(400).send('Course ID is required');
	}

	// Use the courseId to load course-specific data
	res.sendFile(path.join(__dirname, '../../../Frontend/views/lessons.html'));
  });

export default frontendRouter;
