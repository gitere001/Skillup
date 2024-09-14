import formidable from 'formidable';
import path from 'path';

const parseForm = (req, res, next) => {
    const form = formidable({
        uploadDir: path.join(path.resolve(), 'tmp'),
        keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Parsed fields:', fields);
        console.log('Parsed files:', files);

        req.fields = fields;
        req.files = files;
        next();
    });
};

export default parseForm;
