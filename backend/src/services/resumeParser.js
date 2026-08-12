const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = await pdfParse(fileBuffer);
        return data.text;
    } catch (error) {
        throw new Error('Failed to parse PDF: ' + error.message);
    }
};

module.exports = { extractTextFromPDF };
