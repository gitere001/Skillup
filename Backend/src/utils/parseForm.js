import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Saving file as:', file.originalname);
        cb(null, path.join(path.resolve(), 'tmp'));
    },
    filename: (req, file, cb) => {
        console.log('File is being processed:', file.originalname);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

const uploadFiles = upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'content', maxCount: 1 },
    { name: 'courseImage', maxCount: 1 }
]);

export default uploadFiles;
