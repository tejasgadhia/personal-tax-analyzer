# Sample Tax Returns for Testing

This directory contains sample Form 1040 PDFs for testing the Personal Tax Analyzer application.

## Available Samples

### sample-1040-scenario-2.pdf
- **Source**: IRS Modernized e-File (MeF) Assurance Testing System (ATS)
- **Tax Year**: 2024
- **File Size**: 331 KB
- **Purpose**: Official IRS test scenario with filled Form 1040 data
- **Download Date**: January 19, 2026
- **Original URL**: https://www.irs.gov/pub/irs-efile/1040-mef-ats-scenario-2-10082024.pdf

This is an official IRS test document used by e-file software developers for testing purposes. It contains realistic tax data and can be used to verify the PDF parsing functionality of the Personal Tax Analyzer.

## How to Use These Samples

1. **From the Web Interface**:
   - Navigate to the application at https://tejasgadhia.github.io/personal-tax-analyzer/
   - Click on "Get Started" to go to the main application
   - Drag and drop the sample PDF file onto the upload area
   - Or click to browse and select the file

2. **For Local Testing**:
   - Start a local web server (e.g., `python3 -m http.server 8888`)
   - Open http://localhost:8888/app.html in your browser
   - Upload the sample PDF file
   - Verify that the tax year and income tax amount are correctly extracted

## Expected Results

The parser should extract:
- **Tax Year**: Should be 2024 (or appropriate year from the form)
- **Income Tax Amount**: The value from Form 1040, Line 24 (Total tax)
- **Form Type**: 1040, 1040-SR, or 1040-NR

The calculator should then:
- Load the corresponding budget data for the tax year
- Calculate the allocation breakdown across federal spending categories
- Display a Sankey diagram showing where your tax dollars go

## Adding More Samples

To add additional test samples:

1. Download official IRS test scenarios from:
   - https://www.irs.gov/e-file-providers/tax-year-2024-form-1040-series-and-extensions-modernized-e-file-mef-assurance-testing-system-ats-information

2. Or create anonymized versions of real tax returns (ensure all PII is removed)

3. Add them to this directory with descriptive names

4. Update this README with details about each sample

## Privacy Note

These sample files are official IRS test documents and do not contain any real personal information. They are publicly available and safe to use for testing purposes.

When testing with real tax returns, remember that the Personal Tax Analyzer:
- Processes everything **client-side** in your browser
- **Never uploads** your data to any server
- **Never tracks** or stores your information externally
- Only uses browser LocalStorage for session recovery

Always verify the privacy features before uploading any documents containing personal information.

## Data Sources

All IRS MeF ATS scenarios are official test documents provided by the Internal Revenue Service for software developers and tax professionals. They are in the public domain.

For more information:
- IRS e-file Provider Information: https://www.irs.gov/e-file-providers
- Form 1040 Information: https://www.irs.gov/forms-pubs/about-form-1040
