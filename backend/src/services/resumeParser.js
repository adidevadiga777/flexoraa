const { PDFParse } = require('pdf-parse');

const extractTextFromPDF = async (fileBuffer) => {
    let parser;
    try {
        parser = new PDFParse({ data: fileBuffer });
        const data = await parser.getText();
        return data.text; // plain extracted text
    } catch (error) {
        throw new Error('Failed to parse PDF: ' + error.message);
    } finally {
        if (parser) {
            parser.destroy();
        }
    }
};

module.exports = { extractTextFromPDF };
