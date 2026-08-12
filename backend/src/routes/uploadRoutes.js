const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { authUser } = require('../middlewares/auth.middleware');
const { handleUpload } = require('../controllers/uploadController');

router.post(
    '/upload',
    authUser,
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]),
    handleUpload
);

module.exports = router;