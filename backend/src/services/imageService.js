const imagekit = require('../config/imagekit');

const uploadImageToImageKit = async (fileBuffer, originalName) => {
    const base64Image = fileBuffer.toString('base64');
    const result = await imagekit.upload({
        file: base64Image,             // ImageKit SDK expects a base64 string
        fileName: originalName,        // ImageKit uses this to generate a unique file name automatically
        folder: '/portfolio-ai-profiles'
    });

    return result.url; // this is the permanent, hosted image URL
};

module.exports = { uploadImageToImageKit };