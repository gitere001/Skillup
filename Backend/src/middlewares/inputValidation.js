/**
 * Validates the request body and parameters for user registration.
 * Validates that:
 * - firstName and lastName are provided and not empty
 * - email is provided and in a valid format
 * - password is provided and in a valid format (at least 8 characters long and include at least one uppercase letter, one number, and one special character)
 * - password and password2 match
 * - role is provided and is either 'learner' or 'expert'
 * - if role is 'expert', paymentMethod is provided and is either 'bank' or 'mpesa'
 * - if paymentMethod is 'bank', bankName is provided and is one of 'cooperative', 'absa', 'kcb', or 'equity', and bankAccountNumber is provided
 * - if paymentMethod is 'mpesa', mpesaNumber is provided
 * If validation fails, returns a 400 response with an error message.
 * Otherwise, calls `next()` to proceed to the next middleware/controller.
 */
const validateRegistration = (req, res, next) => {
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

	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/;
	const emailRegex = /^[a-zA-Z0-9._+/-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;
	const validRoles = ['learner', 'expert'];

	if (!firstName || firstName.trim() === '') {
	  return res.status(400).json({ error: 'First name is required' });
	}
	if (!lastName || lastName.trim() === '') {
	  return res.status(400).json({ error: 'Last name is required' });
	}
	if (!email || email.trim() === '') {
	  return res.status(400).json({ error: 'Email is required' });
	}
	if (!emailRegex.test(email)) {
	  return res.status(400).json({ error: 'Invalid email format' });
	}
	if (!password || password.trim() === '') {
	  return res.status(400).json({ error: 'Password is required' });
	}
	if (!passwordRegex.test(password)) {
	  return res.status(400).json({ error: 'Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character' });
	}
	if (!password2 || password2.trim() === '') {
	  return res.status(400).json({ error: 'Confirm password is required' });
	}
	if (password !== password2) {
	  return res.status(400).json({ error: 'Passwords do not match' });
	}
	if (!role || role.trim() === '') {
	  return res.status(400).json({ error: 'Role is required' });
	}
	if (!validRoles.includes(role)) {
	  return res.status(400).json({ error: 'Invalid role. Must be "learner" or "expert"' });
	}

	if (role === 'expert') {
	  if (!paymentMethod || paymentMethod.trim() === '') {
		return res.status(400).json({ error: 'Payment method is required for experts' });
	  }
	  if (paymentMethod === 'bank') {
		if (!bankName || !['cooperative', 'absa', 'kcb', 'equity'].includes(bankName)) {
		  return res.status(400).json({ error: 'Invalid or missing bank name for bank payment method' });
		}
		if (!bankAccountNumber || bankAccountNumber.trim() === '') {
		  return res.status(400).json({ error: 'Bank account number is required for bank payment method' });
		}
	  } else if (paymentMethod === 'mpesa') {
		if (!mpesaNumber || mpesaNumber.trim() === '') {
		  return res.status(400).json({ error: 'MPesa number is required for MPesa payment method' });
		}
	  } else {
		return res.status(400).json({ error: 'Invalid payment method. Must be "bank" or "mpesa"' });
	  }
	}

	next();
  };

  export default validateRegistration;
