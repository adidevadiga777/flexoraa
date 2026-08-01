const { extractTextFromPDF } = require('../services/resumeParser');
const { extractResumeData, generatePortfolioContent } = require('../services/geminiService');
const Portfolio = require('../models/Portfolio');
const { uploadImageToImageKit } = require('../services/imageService');
const generateSlug = require('../utils/generateSlug');

const handleUpload = async (req, res) => {
    try {
        console.log('[upload] START — user:', req.user?.id);

        const resumeFile = req.files['resume']?.[0];
        const imageFile = req.files['image']?.[0];
        const { selectedTemplate, instruction } = req.body;

        console.log('[upload] files received — resume:', !!resumeFile, 'image:', !!imageFile);

        if (!resumeFile || !imageFile) {
            return res.status(400).json({ message: 'Both resume and image are required' });
        }

        console.log('[upload] STEP 1: Parsing PDF...');
        const resumeText = await extractTextFromPDF(resumeFile.buffer);
        console.log('[upload] STEP 1 done — text length:', resumeText?.length);

        console.log('[upload] STEP 2: Extracting resume data via Gemini...');
        const structuredData = await extractResumeData(resumeText);
        console.log('[upload] STEP 2 done — name:', structuredData?.name);

        console.log('[upload] STEP 3: Generating portfolio content via Gemini...');
        const portfolioContent = await generatePortfolioContent(structuredData, instruction || '');
        console.log('[upload] STEP 3 done — tagline:', portfolioContent?.tagline);

        console.log('[upload] STEP 4: Uploading image to ImageKit...');
        const imageUrl = await uploadImageToImageKit(imageFile.buffer, imageFile.originalname);
        console.log('[upload] STEP 4 done — url:', imageUrl);

        console.log('[upload] STEP 5: Generating slug...');
        const slug = generateSlug(structuredData.name || 'portfolio');
        console.log('[upload] STEP 5 done — slug:', slug);

        const messages = instruction && instruction.trim()
            ? [
                { role: 'user', text: instruction },
                { role: 'ai', text: "Here's your portfolio based on your resume and preferences! Tell me what you'd like to change." }
            ]
            : [
                { role: 'ai', text: "Here's your portfolio! Tell me what you'd like to change." }
            ];

        console.log('[upload] STEP 6: Saving to MongoDB...');
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
        console.log('[upload] STEP 6 done — portfolio id:', newPortfolio._id);

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