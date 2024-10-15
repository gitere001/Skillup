/**
 * Validates the request body for creating a course.
 * Checks that the title field is a non-empty string with a length of at least 3 characters.
 * Checks that the description field does not exceed 500 characters.
 * Checks that the category field is one of the following: 'Finance & investment',
 * 'Business & Entrepreneurship', 'Technology & programming', 'Agriculture',
 * 'Education', 'Health & wellness', 'Legal & Regulatory', 'Personal Development',
 * or 'Others'.
 * If validation fails, sends a 400 response with an appropriate error message.
 * Otherwise, calls `next()` to proceed to the next middleware/controller.
 */
const validateCourseCreation = (req, res, next) => {
    const { title, description, category } = req.body;
    const price = parseInt(req.body.price);


    console.log(req.body.price);

    // Validate the title field
    if (!title) {
        return res.status(400).json({ error: 'title is required.' });
    }
    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'title must be a string.' });
    }
    if (title.length < 5 || title.length > 100) {
        return res.status(400).json({ error: 'title must be between 5 and 100 characters long.' });
    }
	if (description && description.length > 200) {
		return res.status(400).json({ error: `Description must be at most 200 characters long.${description.length}` });
	}
    if (price < 0 || !Number.isInteger(price)) {
        return res.status(400).json({ error: 'Price must be a positive number.' });
    }


    const validCategories = [
        'Finance & Investment',
        'Business & Entrepreneurship',
        'Technology & Programming',
        'Agriculture',
        'Education',
        'Health & Wellness',
        'Legal & Regulatory',
        'Personal Development',
        'Others'
    ];

    if (!category) {
        return res.status(400).json({ error: 'Category is required.' });
    }
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category provided.' });
    }

    next();

};

export default validateCourseCreation;
