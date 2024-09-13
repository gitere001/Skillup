import express from 'express'
import {addToCart, viewCart, removeFromCart } from '../controllers/cartController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

//Route to add a video to the cart
router.post('/add', authMiddleware, addToCart)

//Route to view the cart
router.get('/view', authMiddleware, viewCart)

//Route to remove a video
router.get('/remove', authMiddleware, removeFromCart)

export default router
