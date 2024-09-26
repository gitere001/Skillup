import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const frontendRouter = express.Router();

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example route to serve the frontend
frontendRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../Frontend/views/index.html'));
});

frontendRouter.get('/register-expert', (req, res) => {
	console.log('Registering an expert');
	res.sendFile(path.join(__dirname, '../../../Frontend/views/expertForm.html'));
});
frontendRouter.get('/register-learner', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/learnerForm.html'));
});
frontendRouter.get('/loginUsers', (req, res) => {
	console.log('login triggered')
	res.sendFile(path.join(__dirname, '../../../Frontend/views/login.html'));
});
frontendRouter.get('/expert-dashboard', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/expertDashboard.html'));
});
frontendRouter.get('/create-course', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../Frontend/views/courseCreation.html'));

})
export default frontendRouter;
