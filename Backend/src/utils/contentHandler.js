import { promises as fs } from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import ConvertAPI from 'convertapi';
import { error } from 'console';
import { response } from 'express';

// Initialize ConvertAPI with your secret key
const convertapi = new ConvertAPI('secret_hdRbNVnBP4vecE7Y'); // Replace with your actual secret key

export async function extractFileContent(contentFile) {
    const originalFilename = contentFile.originalname;
    const filePath = contentFile.path;
    const ext = path.extname(originalFilename).toLowerCase();
    let response = '';

    try {
        if (ext === '.pdf') {
            // Convert PDF to HTML using ConvertAPI
            response = await convertPdfToHtml(filePath);
            fs.unlink(filePath);
        } else if (ext === '.doc' || ext === '.docx') {
            const { value: docContent } = await mammoth.convertToHtml({ path: filePath });
            if (!docContent) {
                console.error('No content found in the document.');
                response = {error: 'No content found in the document.'};

            }
            response = {content: docContent};

            fs.unlink(filePath);
        } else {
            console.error('Unsupported file format.');
            response = {error: 'Unsupported file format.'};
        }

        return response;
    } catch (error) {
        console.error('Error extracting content:', error);
        return {error: error.message};
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

        // await fs.unlink(outputPath);

        return {content: htmlContent};
    } catch (error) {

        console.error('Error converting PDF to HTML:', error.message);
        return {error: error.message};
    }
}