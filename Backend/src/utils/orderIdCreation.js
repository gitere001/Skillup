import { customAlphabet } from 'nanoid';

// Create a custom alphabet for uppercase letters and numbers
const generateOrderId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export { generateOrderId };
