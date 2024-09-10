import User from '../modules/users.js';
import bcrypt from 'bcrypt';

// Create a new user
export const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};
