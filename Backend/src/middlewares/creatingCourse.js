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
    const { topic, description, category } = req.body;

    // Validate the topic field
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required.' });
    }
    if (typeof topic !== 'string') {
        return res.status(400).json({ error: 'Topic must be a string.' });
    }
    if (topic.length < 3) {
        return res.status(400).json({ error: 'Topic must be at least 3 characters long.' });
    }
	if (description.length > 500) {
		return res.status(400).json({ error: 'Description must be at most 500 characters long.' });
	}


    const validCategories = [
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
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category provided.' });
    }

    next();

};

export default validateCourseCreation;
