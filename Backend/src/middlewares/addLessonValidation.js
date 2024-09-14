import { validate as isUuid } from 'uuid';

const validateLesson = (req, res, next) => {
    const { title, content } = req.fields;
    const { video } = req.files;
    const { courseId } = req.params;

    if (!isUuid(courseId)) {
        return res.status(400).json({ error: 'Course ID is required and must be a valid UUID.' });
    }

    if (!title) {
		return res.status(400).json({ error: 'Title is required.' });
	}

    if (!content && !video) {
        return res.status(400).json({ error: 'At least one of content or video must be provided.' });
    }

    next();
};

export default validateLesson;
