import { Request } from 'express';
import multer, { StorageEngine } from 'multer';

// Define a custom type for Request to include single file
// type CustomRequest = Request & {
//     file: Express.Multer.File;
// };

// Define a custom type for Request to include multiple files
type CustomRequest = Request & {
    files: Express.Multer.File[];
};

const storage: StorageEngine = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    },
});

const upload = multer({ storage: storage });

export { CustomRequest, upload };
