import { promises as fs } from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import ConvertAPI from 'convertapi';

// Initialize ConvertAPI with your secret key
const convertapi = new ConvertAPI('secret_hdRbNVnBP4vecE7Y'); // Replace with your actual secret key

export async function extractFileContent(contentFile) {
    const originalFilename = contentFile.originalname;
    const filePath = contentFile.path;
    const ext = path.extname(originalFilename).toLowerCase();
    let content = '';

    try {
        if (ext === '.pdf') {
            // Convert PDF to HTML using ConvertAPI
            content = await convertPdfToHtml(filePath);
        } else if (ext === '.doc' || ext === '.docx') {
            const { value: docContent } = await mammoth.convertToHtml({ path: filePath });
            content = docContent;
        } else {
            throw new Error('Unsupported file type. Please upload a PDF or DOC/DOCX file.');
        }

        return content;
    } catch (error) {
        console.error('Error extracting content:', error);
        return null;
    }
}

// Function to convert PDF to HTML using ConvertAPI
async function convertPdfToHtml(filePath) {
    try {
        const result = await convertapi.convert('html', {
            File: filePath
        }, 'pdf');

        // Save the converted HTML file temporarily
        const outputPath = path.join(path.dirname(filePath), 'converted.html');
        await result.saveFiles(outputPath);

        // Read the saved HTML file and return its content
        const htmlContent = await fs.readFile(outputPath, 'utf8');

        // Optionally, delete the temporary HTML file after reading (uncomment if needed)
        // await fs.unlink(outputPath);

        return htmlContent;
    } catch (error) {
        console.error('Error converting PDF to HTML:', error);
        throw error; // Re-throw error for handling in extractFileContent
    }
}
