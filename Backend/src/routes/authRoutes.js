import express from express
import { register, login } from '../controllers/AuthController'

const router = express.Router()

//Route for register
router.post('/register', register)

//Router for login
router.login('/login', login)

export default router