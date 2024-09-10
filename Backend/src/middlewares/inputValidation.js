const validateRegistration = (req, res, next) => {
	const { firstName, lastName, email, password, password2, role } = req.body;
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/;
	const emailRegex = /^[a-zA-Z0-9._+/-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;
	const validRoles = ['learner', 'instructor'];

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
	  return res.status(400).json({ error: 'Invalid role. Must be "learner" or "instructor"' });
	}

	next();
  };

  export default validateRegistration;
