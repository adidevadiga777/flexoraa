const { extractTextFromPDF } = require('../services/resumeParser');

const handleUpload = async (req, res) => {
    try {
        // req.files is populated by Multer, structured by field name
        const resumeFile = req.files['resume']?.[0];
        const imageFile = req.files['image']?.[0];

        if (!resumeFile || !imageFile) {
            return res.status(400).json({ message: 'Both resume and image are required' });
        }

        // At this point, resumeFile.buffer and imageFile.buffer 
        // contain the actual file data in memory

        // console.log('Resume file received:', resumeFile.originalname, resumeFile.size);
        // console.log('Image file received:', imageFile.originalname, imageFile.size);

        // NEW: extract text from the resume buffer
        const resumeText = await extractTextFromPDF(resumeFile.buffer);

        console.log('Extracted resume text:', resumeText);

        // Next phases (3, 4) will use resumeFile.buffer here for parsing
        // and imageFile.buffer for Cloudinary upload

        res.status(200).json({
            message: 'Files received successfully',
            resumeText
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

module.exports = { handleUpload }