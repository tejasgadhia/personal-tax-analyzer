/**
 * parser.js
 * PDF parsing logic for Form 1040
 * Extracts tax year and federal income tax from uploaded PDF
 */

const PDFParser = {
    /**
     * Parse an uploaded Form 1040 PDF file
     * @param {File} file - The PDF file object
     * @returns {Promise<Object>} Parsed data: { year, incomeTax, formType }
     */
    async parsePDF(file) {
        try {
            // Validate file type strictly
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error('Invalid file type. Please upload a PDF file.');
            }

            // Load PDF using PDF.js
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

            let pdf;
            try {
                pdf = await loadingTask.promise;
            } catch (pdfError) {
                if (pdfError.name === 'PasswordException') {
                    throw new Error('This PDF is password-protected. Please unlock it first and try again.');
                }
                throw new Error('Failed to read PDF file. The file may be corrupted or invalid.');
            }

            // Extract text from first 3 pages (most relevant data is here)
            const textContent = await this.extractText(pdf, 3);

            // Identify form type
            const formType = this.identifyFormType(textContent);
            if (!formType) {
                throw new Error('This doesn\'t appear to be a Form 1040, 1040-SR, or 1040-NR. Please upload the correct form.');
            }

            // Check for amended return
            if (formType === '1040-X') {
                throw new Error('Amended returns (Form 1040-X) are not currently supported. Please upload your original Form 1040.');
            }

            // Extract tax year
            const year = this.extractTaxYear(textContent);
            if (!year) {
                throw new Error('Could not identify the tax year from this form. Please ensure it\'s a complete Form 1040.');
            }

            // Validate year range (dynamic - supports current year and past 5 years)
            const currentYear = new Date().getFullYear();
            const minYear = 2019; // Earliest supported year
            if (year < minYear || year > currentYear) {
                throw new Error(`Tax year ${year} is not supported. This tool supports years ${minYear}-${currentYear} only.`);
            }

            // Extract federal income tax
            const incomeTax = this.extractIncomeTax(textContent, year);
            if (incomeTax === null) {
                throw new Error('Could not find the federal income tax amount on this form. Please ensure Line 24 is visible and complete.');
            }

            return {
                year,
                incomeTax,
                formType,
                success: true
            };

        } catch (error) {
            // Re-throw error for handling by caller
            throw error;
        }
    },

    /**
     * Extract text from PDF pages
     * @param {Object} pdf - PDF.js document object
     * @param {number} maxPages - Maximum number of pages to extract
     * @returns {Promise<string>} Concatenated text content
     */
    async extractText(pdf, maxPages = 3) {
        const numPages = Math.min(pdf.numPages, maxPages);
        let fullText = '';

        try {
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
        } catch (error) {
            throw new Error('Failed to extract text from PDF. The file may be corrupted or in an unsupported format.');
        }

        return fullText;
    },

    /**
     * Identify the type of Form 1040
     * @param {string} text - Extracted text from PDF
     * @returns {string|null} Form type or null if not found
     */
    identifyFormType(text) {
        const upperText = text.toUpperCase();

        // Check for amended return first
        if (upperText.includes('1040-X') || upperText.includes('1040X') ||
            upperText.includes('AMENDED U.S. INDIVIDUAL')) {
            return '1040-X';
        }

        // Check for 1040-SR (seniors)
        if (upperText.includes('1040-SR') || upperText.includes('1040SR')) {
            return '1040-SR';
        }

        // Check for 1040-NR (non-resident)
        if (upperText.includes('1040-NR') || upperText.includes('1040NR')) {
            return '1040-NR';
        }

        // Check for standard 1040
        if (upperText.includes('FORM 1040') || upperText.includes('U.S. INDIVIDUAL INCOME TAX RETURN')) {
            return '1040';
        }

        return null;
    },

    /**
     * Extract tax year from PDF text
     * @param {string} text - Extracted text from PDF
     * @returns {number|null} Tax year or null if not found
     */
    extractTaxYear(text) {
        // Look for year patterns like "2024", "2023", etc.
        // Common locations: form header, "For the year"

        // Pattern 1: "Form 1040 (2024)" or similar
        const formYearMatch = text.match(/Form\s+1040[^\d]*(\d{4})/i);
        if (formYearMatch) {
            return parseInt(formYearMatch[1]);
        }

        // Pattern 2: "For the year 2024" or "For calendar year 2024"
        const calendarYearMatch = text.match(/(?:for|calendar)\s+(?:the\s+)?year\s+(\d{4})/i);
        if (calendarYearMatch) {
            return parseInt(calendarYearMatch[1]);
        }

        // Pattern 3: Look for years in range 2019-2024 near beginning of document
        const firstPart = text.substring(0, 1000); // First ~1000 chars
        const yearMatches = firstPart.match(/20(19|20|21|22|23|24)/g);
        if (yearMatches && yearMatches.length > 0) {
            // Return the most common year found
            const yearCounts = {};
            yearMatches.forEach(year => {
                yearCounts[year] = (yearCounts[year] || 0) + 1;
            });
            const mostCommonYear = Object.keys(yearCounts).reduce((a, b) =>
                yearCounts[a] > yearCounts[b] ? a : b
            );
            return parseInt(mostCommonYear);
        }

        return null;
    },

    /**
     * Extract federal income tax from PDF text
     * @param {string} text - Extracted text from PDF
     * @param {number} year - Tax year
     * @returns {number|null} Income tax amount or null if not found
     */
    extractIncomeTax(text, year) {
        // Line 24 is "Total tax" on most recent 1040 forms
        // We need to look for patterns like:
        // "24 Total tax" followed by dollar amount
        // Line numbers may vary by year

        const lines = text.split('\n');
        let incomeTax = null;

        // Strategy 1: Look for "Line 24" or "24" followed by "Total tax" and amount
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Match patterns like:
            // "24 Total tax . . . . 12,345"
            // "24 . . . . . . . . . 12,345"
            // "Total tax 24 12,345"

            if (/(?:line\s*)?24\b/i.test(line) && /total\s*tax/i.test(line)) {
                // Look for dollar amount in this line or next few lines
                const searchText = lines.slice(i, i + 3).join(' ');
                const amount = this.extractDollarAmount(searchText);
                if (amount !== null) {
                    incomeTax = amount;
                    break;
                }
            }
        }

        // Strategy 2: Search more broadly for "Total tax" line
        if (incomeTax === null) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (/total\s*tax/i.test(line) && !/estimated|additional|self-employment/i.test(line)) {
                    // Found "Total tax" line, look for amount
                    const searchText = lines.slice(i, i + 3).join(' ');
                    const amount = this.extractDollarAmount(searchText);
                    if (amount !== null) {
                        incomeTax = amount;
                        break;
                    }
                }
            }
        }

        return incomeTax;
    },

    /**
     * Extract dollar amount from text
     * @param {string} text - Text containing dollar amount
     * @returns {number|null} Dollar amount or null if not found
     */
    extractDollarAmount(text) {
        // Remove spaces to handle "12 345" format
        const cleanText = text.replace(/\s/g, '');

        // Match patterns like:
        // $12,345 or $12,345.00
        // 12,345 or 12,345.00
        // 12345 or 12345.00

        const patterns = [
            /\$?([\d,]+\.?\d{0,2})/,  // With or without dollar sign
            /(\d+)/  // Just digits
        ];

        for (const pattern of patterns) {
            const match = cleanText.match(pattern);
            if (match) {
                // Remove commas and convert to number
                const numStr = match[1].replace(/,/g, '');
                const num = parseFloat(numStr);

                // Sanity check: tax should be between 0 and 100 million (increased limit for high earners)
                if (!isNaN(num) && num >= 0 && num <= 100000000) {
                    return Math.round(num); // Round to nearest dollar
                }
            }
        }

        return null;
    }
};
