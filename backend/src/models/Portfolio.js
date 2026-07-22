const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    structuredData: {
        type: Object,
        required: true
    },
    portfolioContent: {
        type: Object,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    selectedTemplate: {
        type: String,
        default: 'TemplateOne'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);