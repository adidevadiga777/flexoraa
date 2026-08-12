const multer = require('multer');


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype !== 'application/pdf') {
        return cb(new Error('Resume must be a PDF file'), false);
    }
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) {
        return cb(new Error('Profile photo must be an image file'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;