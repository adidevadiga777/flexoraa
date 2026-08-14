const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();

    if (file.fieldname === 'resume') {
        const validPdfTypes = [
            'application/pdf',
            'application/x-pdf',
            'application/vnd.pdf',
            'application/octet-stream'
        ];
        const isPdfType = validPdfTypes.includes(file.mimetype);
        const isPdfExt = ext === '.pdf';

        if (!isPdfType && !isPdfExt) {
            return cb(new Error('Resume must be a PDF file (.pdf)'), false);
        }
    }

    if (file.fieldname === 'image') {
        const validImageExts = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif', '.bmp', '.svg'];
        const isImageType = file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream';
        const isImageExt = validImageExts.includes(ext);

        if (!isImageType && !isImageExt) {
            return cb(new Error('Profile photo must be a valid image file'), false);
        }
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for high-res mobile photos
});

module.exports = upload;