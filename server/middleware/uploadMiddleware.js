import multer from 'multer';

// Use memory storage to avoid saving files to the server's disk.
// The file will be available as a buffer in memory (req.files).
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;