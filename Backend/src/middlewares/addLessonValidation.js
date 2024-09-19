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
    const { title, description } = req.body; // Access form fields from req.body
    const { video, content } = req.files; // Access files from req.files
    const { courseId } = req.params; // Access route parameters

    // Validate courseId as a UUID
    if (!isUuid(courseId)) {
        return res.status(400).json({ error: 'Course ID is required and must be a valid UUID.' });
    }

    // Validate title
    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    // Validate at least one file (video or content) is provided
    if (!video && !content) {
        return res.status(400).json({ error: 'At least one of video or content files must be provided.' });
    }


    // Proceed to the next middleware/controller
    next();
};

export default validateLesson;
