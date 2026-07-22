const { extractTextFromPDF } = require('../services/resumeParser');
const { extractResumeData, generatePortfolioContent } = require('../services/geminiService');
const Portfolio = require('../models/Portfolio');
const generateSlug = require('../utils/generateSlug');
const { uploadImageToImageKit } = require('../services/imageService');


const handleUpload = async (req, res) => {
    try {
        const resumeFile = req.files['resume']?.[0];
        const imageFile = req.files['image']?.[0];

        if (!resumeFile || !imageFile) {
            return res.status(400).json({ message: 'Both resume and image are required' });
        }

        const resumeText = await extractTextFromPDF(resumeFile.buffer);
        const structuredData = await extractResumeData(resumeText);
        const portfolioContent = await generatePortfolioContent(structuredData);

        // ImageKit upload
        const imageUrl = await uploadImageToImageKit(imageFile.buffer, imageFile.originalname);

        const slug = generateSlug(structuredData.name);

        const newPortfolio = new Portfolio({
            userId: req.user.id,
            slug,
            structuredData,
            portfolioContent,
            imageUrl
        });

        await newPortfolio.save();

        res.status(200).json({
            message: 'Portfolio created successfully',
            slug: newPortfolio.slug
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

module.exports = { handleUpload };