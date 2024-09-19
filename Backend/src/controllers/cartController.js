import redisClient from '../storage/redis.js';
import FileController from './FileController.js';
import Course from '../modules/course.js';
import Cart from '../modules/Cart.js';
import Order from '../modules/order.js';
import UserPurchasedCourse from '../modules/purchasedCourse.js';
import processPayment from '../utils/processPayment.js';
import { validate as isUuid } from 'uuid';
import { processExpertOrders } from '../utils/expertOrderProcessor.js';

/**
 * Adds a course to the user's cart.
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with new cart item or an error.
 */
export const addToCart = async (req, res) => {
    try {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const courseId = req.params.courseId;
        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findByPk(courseId);
        if (course.status !== 'approved') {
            return res.status(400).json({ error: 'Course is not ready for purchase' });
        }
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const existingCart = await Cart.findOne({ where: { userId: user.id, courseId } });
        if (existingCart) {
            return res.status(409).json({ error: 'Course already in cart' });
        }

        const newCart = await Cart.create({ userId: user.id, courseId });
        return res.status(201).json({ newCart });

    } catch (error) {
        console.error('Error adding course to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Fetches the cart items for the authenticated user and returns a JSON response with the cart items.
 * @param {Object} req - The request object containing headers.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with the cart items or an error.
 */
export const viewCart = async (req, res) => {
    try {
        // Get the user from the request
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch the cart items for the authenticated user
        const cartItems = await Cart.findAll({
            where: { userId: user.id },
            attributes: ['courseId']
        });
        const courseIds = cartItems.map(cart => cart.courseId);
        const courses = await Course.findAll({
            where: { id: courseIds },
            attributes: ['id', 'topic', 'description']
        });

        // Respond with the cart items including course details
        return res.status(200).json({ courses});

    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving the cart.' });
    }
};
/**
 * Removes a course from the authenticated user's cart.
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with success message or an error.
 */
export const removeFromCart = async (req, res) => {
    try {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const courseId = req.params.courseId;
        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const cart = await Cart.findOne({ where: { userId: user.id, courseId } });
        if (!cart) {
            return res.status(404).json({ error: 'Course not found in cart' });
        }

        await cart.destroy();
        return res.status(200).json({ message: 'Course removed from cart' });

    } catch (error) {
        console.error('Error removing course from cart:', error);
        return res.status(500).json({ error: 'An error occurred while removing the course from the cart.' });
    }
};

/**
 * Creates an order and processes payment for the given course(s).
 * @param {Object} req - The request object containing the course ID or 'fromCart' flag.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with the order ID, total amount, and message, or an error.
 */
export const checkout = async (req, res) => {
    try {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId, fromCart } = req.body;
        if (courseId === undefined && fromCart === undefined) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (courseId) {
            if (!isUuid(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }
        }
        if (typeof fromCart !== 'boolean') {
            return res.status(400).json({ error: 'Invalid fromCart value' });
        }

        let courseIds = [];
        let totalAmount = 0;

        const purchasedCourses = await UserPurchasedCourse.findAll({ where: { userId: user.id } });
        const purchasedCourseIds = purchasedCourses.map(pc => pc.courseId);

        if (fromCart) {
            const cartItems = await Cart.findAll({ where: { userId: user.id } });
            if (cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            courseIds = cartItems.map(item => item.courseId);
            const newCourseIds = courseIds.filter(cid => !purchasedCourseIds.includes(cid));
            if (newCourseIds.length !== courseIds.length) {
                return res.status(400).json({ error: 'Some courses are already purchased' });
            }
            courseIds = newCourseIds.map(id => id.toString());
            const courses = await Course.findAll({ where: { id: newCourseIds } });
            const unapprovedCourse = courses.find(course => course.status !== 'approved');
            if (unapprovedCourse) {
                return res.status(400).json({ error: `${unapprovedCourse.title} is not ready for purchase` });
            }
            totalAmount = courses.reduce((total, course) => total + course.price, 0);

        } else if (courseId) {
            const course = await Course.findByPk(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            if (purchasedCourseIds.includes(courseId)) {
                return res.status(400).json({ error: 'Course already purchased' });
            }
            courseIds = [courseId.toString()];
            totalAmount = course.price;
        } else {
            return res.status(400).json({ error: 'Course ID or cart must be provided' });
        }

        // Create the order with a 'pending' status and store the course IDs
        const order = await Order.create({
            userId: user.id,
            totalAmount,
            courseIds, // Store the course IDs from the cart or single course
            paymentDetails: null
        });

        return res.status(201).json({
            message: 'Order created successfully',
            orderId: order.id,
            totalAmount
        });

    } catch (error) {
        console.error('Error during checkout:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

        /**
         * Processes an order after payment confirmation.
         * The request body should contain the order ID and a boolean 'paid' flag.
         * If the order is found and the flag is true, the order is updated to 'completed',
         * and the purchased courses are added to the user's purchased courses.
         * If the flag is false, the order is updated to 'canceled'.
         * In case of any errors, a 500 status is returned with an error message.
         * @param {Object} req - The request object containing the order ID and paid flag.
         * @param {Object} res - The response object.
         * @returns {Object} - JSON response with a success message or an error.
         */
export const processOrder = async (req, res) => {
    try {
        const { orderId, paid } = req.body; // Extract both from request body

        if (typeof paid !== 'boolean') {
            return res.status(400).json({ error: 'Invalid paid flag' });
        }
        console.log('orderId:', orderId, 'paid:', paid);

        // Fetch the order to process
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        console.log('order:', order);

        // Check if the order is already completed or failed
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Order is not pending or already processed' });
        }

        if (paid) {
            // Confirm payment
            const paymentData = await processPayment(order.totalAmount, order.id);
            if (paymentData.status === 'failed') {
                // Update order status to 'failed'
                await Order.update({ status: 'failed' }, { where: { id: order.id } });
                return res.status(500).json({ error: 'Payment processing failed' });
            }

            // Update the order status to 'completed' and store payment details
            await Order.update({
                status: 'completed',
                paymentDetails: paymentData
            }, { where: { id: order.id } });

            // Add purchased courses for the user
            await Promise.all(order.courseIds.map(courseId =>
                UserPurchasedCourse.create({
                    userId: order.userId,
                    courseId,
                    purchaseDate: new Date()
                })
            ));
            console.log('purchased courses:', order.courseIds);

            await processExpertOrders(order);

            // Clear the cart if the purchase was from the cart
            if (order.courseIds.length > 0) {
                await Cart.destroy({ where: { userId: order.userId } });
            }

            return res.status(200).json({
                message: 'Order processed successfully'
            });

        } else {
            // If payment was not confirmed, handle the cancellation
            // Check if payment was made already to avoid inconsistencies
            const paymentData = await processPayment(order.totalAmount, order.id);
            if (paymentData.status === 'success') {
                // If payment was successful, update order status to 'failed'
                await Order.update({ status: 'refund-requested' }, { where: { id: order.id } });
                return res.status(500).json({ error: 'Payment was processed, but cancellation requested' });
            }

            // Update the order status to 'canceled'
            await Order.update({ status: 'canceled' }, { where: { id: order.id } });

            // Handle any additional cancellation logic, such as restocking items

            return res.status(200).json({
                message: 'Order canceled successfully'
            });
        }

    } catch (error) {
        console.error('Error processing order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

