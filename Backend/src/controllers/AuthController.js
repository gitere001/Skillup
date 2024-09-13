import User from '../modules/users.js';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import redisClient from '../storage/redis.js'


// Create a new user
export const register = async (req, res) => {
  const { firstName, lastName, email, password, password2, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }


    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
        role
      });

    // Create a new user
    res.status(201).json({
        message: 'User successfully registered!',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role
        }
      });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}

  // User login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      // Token expires in 1 hour
      { expiresIn: '1h' } 
    );

    // Store token in Redis with a 1-hour expiration
    await redisClient.set(user.id, token, 3600); 

    // Send the token and user data back to the client
    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



