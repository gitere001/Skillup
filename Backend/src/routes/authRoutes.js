import express from 'express';
import { register, login, logout } from '../controllers/AuthController.js'
import AppController from '../controllers/AppController.js';
import validateRegistration from '../middlewares/inputValidation.js';


const authRouter = express.Router()

authRouter.get('/status', AppController.getStatus);
authRouter.post('/register', validateRegistration, register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
export default authRouter