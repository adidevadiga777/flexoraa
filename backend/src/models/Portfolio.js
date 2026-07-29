const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        default: null  // null until paid
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
        enum: ['TemplateOne', 'TemplateTwo'],
        default: 'TemplateOne'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String,
        default: null
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    messages: [
        {
            role: { type: String },
            text: { type: String }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);