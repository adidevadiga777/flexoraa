const Portfolio = require('../models/Portfolio');

const getPortfolioBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const portfolio = await Portfolio.findOne({ slug });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json({ portfolio });

    } catch (error) {
        console.error('Fetch portfolio error:', error);
        res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
    }
};

module.exports = { getPortfolioBySlug };