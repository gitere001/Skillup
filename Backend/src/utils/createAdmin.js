import sequelize from '../storage/db.js';
import Admin from '../modules/admin.js';
import bcrypt from 'bcrypt';

async function createAdmin(firstName, lastName, email, password, category) {
	const categories = [
		'Finance & investment',
		'Business & Entrepreneurship',
		'Technology & programming',
		'Agriculture',
		'Education',
		'Health & wellness',
		'Legal & Regulatory',
		'Personal Development',
		'Others'
	];

    try {
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Error: Admin already exists');
            return;
        }

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/;
        const emailRegex = /^[a-zA-Z0-9._+/-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;

        if (!firstName || firstName.trim() === '') {
            console.log('Error: First name is required');
            return;
        }
        if (!lastName || lastName.trim() === '') {
            console.log('Error: Last name is required');
            return;
        }
        if (!email || email.trim() === '') {
            console.log('Error: Email is required');
            return;
        }
        if (!emailRegex.test(email)) {
            console.log('Error: Invalid email format');
            return;
        }
        if (!password || password.trim() === '') {
            console.log('Error: Password is required');
            return;
        }
        if (!passwordRegex.test(password)) {
            console.log('Error: Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character');
            return;
        }
		if (!category || !categories.includes(category)) {
            console.log('Error: Invalid category');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
			category: category,
            role: 'admin'
        });

        console.log('Admin created:', admin.id);
        console.log(`Success: Admin ${admin.firstName} Created`);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
}

export default createAdmin;
