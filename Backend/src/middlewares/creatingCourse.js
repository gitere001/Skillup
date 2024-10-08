/**
 * Validates the request body for creating a course.
 * Checks that the topic field is a non-empty string with a length of at least 3 characters.
 * Checks that the description field does not exceed 500 characters.
 * Checks that the category field is one of the following: 'Finance & investment',
 * 'Business & Entrepreneurship', 'Technology & programming', 'Agriculture',
 * 'Education', 'Health & wellness', 'Legal & Regulatory', 'Personal Development',
 * or 'Others'.
 * If validation fails, sends a 400 response with an appropriate error message.
 * Otherwise, calls `next()` to proceed to the next middleware/controller.
 */
const validateCourseCreation = (req, res, next) => {
    const { topic, description, category, price } = req.body;

    // Validate the topic field
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required.' });
    }
    if (typeof topic !== 'string') {
        return res.status(400).json({ error: 'Topic must be a string.' });
    }
    if (topic.length < 5 || topic.length > 100) {
        return res.status(400).json({ error: 'Topic must be between 5 and 100 characters long.' });
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
