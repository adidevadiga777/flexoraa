const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/multerConfig');
const { authUser } = require('../middlewares/auth.middleware');
const { handleUpload } = require('../controllers/uploadController');

const uploadFields = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]);

router.post(
    '/upload',
    authUser,
    (req, res, next) => {
        uploadFields(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ message: 'File size exceeds 25MB limit. Please upload a smaller file.' });
                }
                return res.status(400).json({ message: `Upload error: ${err.message}` });
            } else if (err) {
                return res.status(400).json({ message: err.message || 'File upload failed' });
            }
            next();
        });
    },
    handleUpload
);

module.exports = router;