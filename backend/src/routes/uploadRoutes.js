const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { authUser } = require('../middlewares/auth.middleware'); // your existing auth check
const { handleUpload } = require('../controllers/uploadController');

router.post(
    '/upload',
    authUser,           // 1. Check user is logged in first
    upload.fields([           // 2. Then handle the file upload
        { name: 'resume', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]),
    handleUpload              // 3. Then run your actual logic
);

module.exports = router;