import express from 'express';
import { register } from '../controllers/AuthController.js'
import checkDatabaseConnection from '../controllers/AppController.js';

const router = express.Router()

router.get('/status', checkDatabaseConnection);

//Route for register
router.post('/register', register)

//Router for login
//router.login('/login', login)

export default router