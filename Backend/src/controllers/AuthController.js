import User from '../modules/users.js';
import Expert from '../modules/expert.js';
import Admin from '../modules/admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import redisClient from '../storage/redis.js'
import { v4 as uuidv4 } from 'uuid';


// Create a new user
export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    password2,
    role,
    paymentMethod,
    bankName,
    bankAccountNumber,
    mpesaNumber
  } = req.body;


  if (role === 'expert') {
    const expert = await Expert.findOne({ where: { email } });
    if (expert) {
      return res.status(400).json({ message: 'Expert already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const newExpert = await Expert.create({
      firstName,
      lastName,
      email,
      password: hash,
      role,
      paymentMethod,
      bankName,
      bankAccountNumber,
      mpesaNumber

    });
    return res.status(201).json({ expertId: newExpert.id });

  } else if (role === 'learner') {
    const learner = await User.findOne({ where: { email } });
    if (learner) {
      return res.status(400).json({ message: 'Learner already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role
    });
    return res.status(201).json({ learnerId: newUser.id });
  }

}
  // User login controller
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (role === 'admin') {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, admin.id, 7200);
    res.status(200).json({
      message: 'Login successful',
      adminId: admin.id,
      'X-Token': token
    });
  }

  if (role === 'expert') {
    const expert = await Expert.findOne({ where: { email } });
    if (!expert) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, expert.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, expert.id, 18000);
    res.status(200).json({
      message: 'Login successful',
      expertId: expert.id,
      'X-Token': token
    });
  } else if (role === 'learner') {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user.id, 86400);
    res.status(200).json({
      message: 'Login successful',
      learnerId: user.id,
      'X-Token': token
    });
  } else {
    return res.json({ message: 'Invalid role' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers['X-Token'] || req.headers['x-token'];
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Remove the token from Redis
    await redisClient.del(`auth_${token}`);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const userProfile = async (req, res) => {
  const token = req.header('X-Token');
  const key = `auth_${token}`;

  try {
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  const token = req.header('X-Token');
  const key = `auth_${token}`;

  try {
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}