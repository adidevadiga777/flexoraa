const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const { editPortfolioContent } = require('../services/groqService');
const generateSlug = require('../utils/generateSlug');

const getPortfolioBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const portfolio = await Portfolio.findOne({ slug });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        if (!portfolio.isPublished) {
            return res.status(403).json({ message: 'Portfolio has not been published yet' });
        }

        res.status(200).json({ portfolio });

    } catch (error) {
        console.error('Fetch portfolio error:', error);
        res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
    }
};

const tryLocalEditFallback = (currentPortfolioContent, instruction, currentName = '') => {
    if (!instruction || typeof instruction !== 'string') return null;
    const cleanContent = currentPortfolioContent ? JSON.parse(JSON.stringify(currentPortfolioContent)) : {};
    const text = instruction.trim();

    // Match name change instructions: e.g. "change first last to aditya devadiga", "change name to John Doe", "my name is Jane"
    const nameMatch = text.match(/(?:change|update|set)\s+(?:my\s+)?(?:first\s*last|name|full\s*name)\s+(?:to|=)\s+["']?([^"'.]+)["']?/i) ||
        text.match(/my\s+name\s+is\s+["']?([^"'.]+)["']?/i);
    if (nameMatch && nameMatch[1]) {
        const rawName = nameMatch[1].trim();
        const formattedName = rawName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        return {
            ...cleanContent,
            name: formattedName
        };
    }

    // Match tagline / title change instructions: e.g. "change title to Full Stack Engineer"
    const taglineMatch = text.match(/(?:change|update|set)\s+(?:my\s+)?(?:title|tagline|role|headline)\s+(?:to|=)\s+["']?([^"'.]+)["']?/i);
    if (taglineMatch && taglineMatch[1]) {
        return {
            ...cleanContent,
            tagline: taglineMatch[1].trim()
        };
    }

    return null;
};

const generateAiReply = (instruction, updatedContent) => {
    const t = instruction.toLowerCase().trim();

    // Name change
    if (/\b(name|first name|last name|full name)\b/.test(t)) {
        const newName = updatedContent?.name;
        return newName
            ? `Done! Your name has been updated to "${newName}". Check the preview! 🎉`
            : `Got it! Your name has been updated. Take a look at the preview.`;
    }

    // Font changes
    if (/\b(font|typeface|typography|bold|italic|weight)\b/.test(t)) {
        const font = updatedContent?.fontFamily;
        return font
            ? `Font updated to "${font}"! It looks great — check the preview. ✍️`
            : `Typography updated! Have a look at the preview to see the new style.`;
    }

    // Background color
    if (/\b(background|bg|page color|backdrop)\b/.test(t)) {
        const bg = updatedContent?.themeColors?.background;
        return bg
            ? `Background color changed to ${bg}. Looking fresh — check the preview! 🎨`
            : `Background updated! Check the preview for the new look.`;
    }

    // Accent / primary / theme color
    if (/\b(color|colour|accent|primary|theme|highlight)\b/.test(t)) {
        return `Color scheme updated! The new palette is live in the preview. 🎨`;
    }

    // Tagline / title
    if (/\b(tagline|headline|title|role|position)\b/.test(t)) {
        const tagline = updatedContent?.tagline;
        return tagline
            ? `Tagline updated to: "${tagline}". Check the preview! 💼`
            : `Your tagline has been refreshed. Check the preview.`;
    }

    // Bio / about
    if (/\b(bio|about|summary|description|introduction|intro)\b/.test(t)) {
        return `Your bio has been rewritten. It's looking sharp — check the preview! ✨`;
    }

    // Skills
    if (/\b(skill|skills|tech|stack|tools|technologies)\b/.test(t)) {
        return `Skills section updated! Check the preview to see the changes. 🛠️`;
    }

    // Experience
    if (/\b(experience|job|work|career|company|role)\b/.test(t)) {
        return `Work experience updated! Check the preview. 💼`;
    }

    // Projects
    if (/\b(project|projects|portfolio|work|showcase)\b/.test(t)) {
        return `Projects section updated! Check the preview. 🚀`;
    }

    // Template switch
    if (/\b(template|design|layout|modern|classic|theme)\b/.test(t)) {
        return `Template switched! Check the preview to see your new design. 🎨`;
    }

    // Revert / undo
    if (/\b(old|previous|original|revert|undo|back|before)\b/.test(t)) {
        return `Reverted! The previous version is back. Check the preview. ↩️`;
    }

    // Generic fallback with instruction echo
    const shortInstruction = instruction.length > 60 ? instruction.slice(0, 57) + '...' : instruction;
    return `Done! I've applied: "${shortInstruction}". Check the preview to see the changes. ✅`;
};

const editPortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { instruction } = req.body;

        if (!instruction || !instruction.trim()) {
            return res.status(400).json({ message: 'Instruction is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid portfolio ID format' });
        }

        const userId = req.user?.id || req.user?._id;
        let portfolio = await Portfolio.findOne({ _id: id, userId });

        if (!portfolio) {
            // Fallback check if user owns portfolio
            portfolio = await Portfolio.findOne({ _id: id });
            if (!portfolio || String(portfolio.userId) !== String(userId)) {
                return res.status(404).json({ message: 'Portfolio not found or unauthorized' });
            }
        }

        const currentName = portfolio.portfolioContent?.name || portfolio.structuredData?.name || '';
        let updatedContent = null;

        // First attempt AI edit via Gemini, fallback to instant parser if rate limited (429)
        try {
            updatedContent = await editPortfolioContent(portfolio.portfolioContent, instruction, currentName);
        } catch (err) {
            console.warn('Gemini edit failed, attempting local fallback parse:', err.message);
            const fallbackContent = tryLocalEditFallback(portfolio.portfolioContent, instruction, currentName);
            if (fallbackContent) {
                updatedContent = fallbackContent;
            } else {
                throw err;
            }
        }

        if (updatedContent) {
            if (updatedContent.name) {
                if (!portfolio.structuredData) portfolio.structuredData = {};
                portfolio.structuredData.name = updatedContent.name;
                portfolio.markModified('structuredData');
            }
            portfolio.portfolioContent = updatedContent;
            portfolio.markModified('portfolioContent');
        }

        // Allow template switching via instruction
        if (/template\s*two|modern/i.test(instruction)) {
            portfolio.selectedTemplate = 'TemplateTwo';
            portfolio.markModified('selectedTemplate');
        } else if (/template\s*one|classic/i.test(instruction)) {
            portfolio.selectedTemplate = 'TemplateOne';
            portfolio.markModified('selectedTemplate');
        }

        if (!Array.isArray(portfolio.messages)) {
            portfolio.messages = [];
        }
        portfolio.messages.push({ role: 'user', text: instruction });
        portfolio.messages.push({ role: 'ai', text: generateAiReply(instruction, updatedContent) });
        portfolio.markModified('messages');

        await portfolio.save();

        res.status(200).json({ message: 'Portfolio updated successfully', portfolio });

    } catch (error) {
        console.error('Edit portfolio error stack:', error);
        res.status(500).json({ message: error.message || 'Failed to edit portfolio', error: error.message });
    }
};

const getUserPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

        if (!portfolio) {
            return res.status(404).json({ message: 'No portfolio found for user' });
        }

        res.status(200).json({ portfolio });

    } catch (error) {
        console.error('Fetch user portfolio error:', error);
        res.status(500).json({ message: 'Failed to fetch user portfolio', error: error.message });
    }
};

const publishPortfolio = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid portfolio ID format' });
        }

        const portfolio = await Portfolio.findOne({ _id: id, userId: req.user.id });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found or unauthorized' });
        }

        // Generate a slug if not already present
        if (!portfolio.slug) {
            const name = portfolio.structuredData?.name || portfolio.portfolioContent?.name || 'portfolio';
            portfolio.slug = generateSlug(name);
        }

        portfolio.isPublished = true;
        await portfolio.save();
        const frontendUrl = process.env.FRONTEND_URL || 'https://flexoraa-lovat.vercel.app';
        const liveUrl = `${frontendUrl}/portfolio/${portfolio.slug}`;
        res.status(200).json({ message: 'Portfolio published successfully', portfolio, liveUrl });

    } catch (error) {
        console.error('Publish portfolio error:', error);
        res.status(500).json({ message: 'Failed to publish portfolio', error: error.message });
    }
};

const getAllUserPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ portfolios });
    } catch (error) {
        console.error('Fetch all user portfolios error:', error);
        res.status(500).json({ message: 'Failed to fetch user portfolios', error: error.message });
    }
};

const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid portfolio ID format' });
        }
        const portfolio = await Portfolio.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found or unauthorized' });
        }
        res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error('Delete portfolio error:', error);
        res.status(500).json({ message: 'Failed to delete portfolio', error: error.message });
    }
};

module.exports = { getPortfolioBySlug, editPortfolio, getUserPortfolio, getAllUserPortfolios, deletePortfolio, publishPortfolio };