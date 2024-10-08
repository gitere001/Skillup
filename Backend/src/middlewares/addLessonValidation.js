import { validate as isUuid } from 'uuid';

/**
 * Validates the request body and parameters for adding a lesson to a course.
 * Validates that:
 * - courseId is a valid UUID
 * - title is provided
 * - at least one of video or content files is provided
 * If validation fails, returns a 400 response with an error message.
 * Otherwise, calls `next()` to proceed to the next middleware/controller.
 */
const validateLesson = (req, res, next) => {
    const { title, description } = req.body;
    const { video, content } = req.files;
    const { courseId } = req.params;


    // Validate courseId as a UUID
    if (!isUuid(courseId)) {
        return res.status(400).json({ error: 'Course ID is required and must be a valid UUID.' });
    }

    // Validate title
    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }
    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string.' });
    }
    if (title.length < 5 || title.length > 100) {
        return res.status(400).json({ error: 'Title must be between 5 and 100 characters long.' });
    }

    if (description && description.length > 200) {
        return res.status(400).json({ error: 'Description must be utmost 200 characters long.' });
    }

    // Validate at least one file (video or content) is provided
    if (!video && !content) {
        return res.status(400).json({ error: 'At least one of video or content files must be provided.' });
    }
    if (content && content[0].size === 0) {
        return res.status(400).json({ error: 'Content cannot be empty' });
    }
    if (video && video[0].size === 0) {
        return res.status(400).json({ error: 'Video cannot be empty' });
    }


    // Proceed to the next middleware/controller
    next();
};

export default validateLesson;
