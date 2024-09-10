
import express from 'express';
import checkDatabaseConnection from '../controllers/AppController.js';

const router = express.Router();

router.get('/status', checkDatabaseConnection);


export default router;
