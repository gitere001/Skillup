import redisClient from '../storage/redis.js';
import Video from '../modules/video.js';

export const addToCart = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { videoId } = req.body;

    try {
        const video = await Video.findOne({ where: { id: videoId } });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const cartKey = `cart_${user.id}`;
        let cart = await redisClient.get(cartKey);

        if (!cart) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }

        if (cart.find(v => v.id === videoId)) {
            return res.status(400).json({ message: 'Video already in cart' });
        }

        cart.push({ id: videoId, title: video.title, price: video.price });
        await redisClient.set(cartKey, JSON.stringify(cart), 3600); // 1 hour expiration

        res.status(200).json({ message: 'Video added to cart', cart });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const viewCart = async (req, res) => {
    const user = req.user;

    try {
        const cartKey = `cart_${user.id}`;
        let cart = await redisClient.get(cartKey);

        if (!cart) {
            return res.status(200).json({ cart: [] });
        }

        cart = JSON.parse(cart);
        res.status(200).json({ cart });
    } catch (err) {
        console.error('Error viewing cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeFromCart = async (req, res) => {
    const user = req.user;
    const { videoId } = req.body;

    try {
        const cartKey = `cart_${user.id}`;
        let cart = await redisClient.get(cartKey);

        if (!cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        cart = JSON.parse(cart);
        const updatedCart = cart.filter(item => item.id !== videoId);

        await redisClient.set(cartKey, JSON.stringify(updatedCart), 3600);
        res.status(200).json({ message: 'Video removed from cart', updatedCart });
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkout = async (req, res) => {
    const user = req.user;

    try {
        const cartKey = `cart_${user.id}`;
        let cart = await redisClient.get(cartKey);

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        cart = JSON.parse(cart);

        // Mark the videos as purchased
        const purchasedVideos = cart.map(item => item.id);

        // Clear the cart
        await redisClient.del(cartKey);

        res.status(200).json({ message: 'Checkout successful', purchasedVideos });
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
