import express from 'express'
import { addToCart, viewCart, removeFromCart, checkout, processOrder} from '../controllers/cartController.js';

const cartRouter = express.Router()

cartRouter.post('/cart/:courseId', addToCart);
cartRouter.get('/cart', viewCart);
cartRouter.delete('/cart/:courseId', removeFromCart);
cartRouter.post('/checkout', checkout);
cartRouter.post('/process-order', processOrder);

export default cartRouter
