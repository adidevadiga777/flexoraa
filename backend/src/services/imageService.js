const imagekit = require('../config/imagekit');

const uploadImageToImageKit = async (fileBuffer, originalName) => {
    const result = await imagekit.upload({
        file: fileBuffer,              // raw buffer works directly — no base64 conversion needed
        fileName: originalName,        // ImageKit uses this to generate a unique file name automatically
        folder: '/portfolio-ai-profiles'
    });

    return result.url; // this is the permanent, hosted image URL
};

module.exports = { uploadImageToImageKit };