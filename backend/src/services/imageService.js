const imagekit = require('../config/imagekit');

const uploadImageToImageKit = async (fileBuffer, originalName) => {
    const base64Image = fileBuffer.toString('base64');
    const result = await imagekit.upload({
        file: base64Image,
        fileName: originalName,
        folder: '/portfolio-ai-profiles'
    });

    return result.url;
};

module.exports = { uploadImageToImageKit };