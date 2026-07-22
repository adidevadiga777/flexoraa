const multer = require('multer');

// Decide HOW and WHERE files are temporarily stored
const storage = multer.memoryStorage();
// memoryStorage = keeps file as a Buffer in RAM (good for small files, since we'll immediately forward to Cloudinary/parse it — no need to save to disk permanently)

// Filter: only allow specific file types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype !== 'application/pdf') {
        return cb(new Error('Resume must be a PDF file'), false);
    }
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) {
        return cb(new Error('Profile photo must be an image file'), false);
    }
    cb(null, true); // accept the file
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max per file
});

module.exports = upload;