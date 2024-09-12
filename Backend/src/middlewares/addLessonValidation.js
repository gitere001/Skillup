const validateLesson = (req, res, next) => {
    const { title, content, video } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
    }

    if (!content && !video) {
        return res.status(400).json({ error: 'At least one of content or video must be provided.' });
    }


    next();
};

export default validateLesson;
