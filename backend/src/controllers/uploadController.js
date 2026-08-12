const { extractTextFromPDF } = require('../services/resumeParser');
const { extractResumeData, generatePortfolioContent } = require('../services/groqService');
const Portfolio = require('../models/Portfolio');
const { uploadImageToImageKit } = require('../services/imageService');
const generateSlug = require('../utils/generateSlug');

const handleUpload = async (req, res) => {
    try {
        const resumeFile = req.files['resume']?.[0];
        const imageFile = req.files['image']?.[0];
        const { selectedTemplate, instruction } = req.body;

        if (!resumeFile || !imageFile) {
            return res.status(400).json({ message: 'Both resume and image are required' });
        }

        const resumeText = await extractTextFromPDF(resumeFile.buffer);
        const structuredData = await extractResumeData(resumeText);
        const portfolioContent = await generatePortfolioContent(structuredData, instruction || '');
        const imageUrl = await uploadImageToImageKit(imageFile.buffer, imageFile.originalname);
        const slug = generateSlug(structuredData.name || 'portfolio');

        const messages = instruction && instruction.trim()
            ? [
                { role: 'user', text: instruction },
                { role: 'ai', text: "Here's your portfolio based on your resume and preferences! Tell me what you'd like to change." }
            ]
            : [
                { role: 'ai', text: "Here's your portfolio! Tell me what you'd like to change." }
            ];

        const newPortfolio = new Portfolio({
            userId: req.user.id,
            slug,
            structuredData,
            portfolioContent,
            imageUrl,
            selectedTemplate: selectedTemplate || 'TemplateOne',
            messages
        });

        await newPortfolio.save();

        res.status(200).json({
            message: 'Portfolio generated successfully',
            portfolio: newPortfolio,
            portfolioId: newPortfolio._id
        });

    } catch (error) {
        console.error('[upload] ERROR at step — message:', error.message);
        console.error('[upload] ERROR stack:', error.stack);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

module.exports = { handleUpload };