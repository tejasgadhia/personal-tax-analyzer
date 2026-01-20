# Testing Guide - Personal Tax Analyzer

This guide provides step-by-step instructions for testing the Personal Tax Analyzer application.

## Quick Test (Using Sample PDF)

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- Internet connection (for CDN resources: PDF.js, D3.js)

### Option 1: Test on GitHub Pages (Recommended)

1. **Navigate to the live site**:
   ```
   https://tejasgadhia.github.io/personal-tax-analyzer/
   ```

2. **Download the sample PDF**:
   - Go to: https://github.com/tejasgadhia/personal-tax-analyzer/blob/main/samples/sample-1040-scenario-2.pdf
   - Click "Download" to save it locally

3. **Run the test**:
   - Click "Get Started" on the landing page
   - Drag and drop the sample PDF, or click to browse and select it
   - Wait for the parser to extract the data
   - Review the extracted information (tax year and income tax amount)
   - Optionally add FICA data (e.g., Social Security: $9,932, Medicare: $2,754)
   - Click "Calculate & Visualize"
   - Verify the Sankey diagram renders correctly

4. **Verify features**:
   - ✅ Hover over categories to see detailed breakdowns
   - ✅ Click categories to expand/collapse subcategories
   - ✅ Scroll down to see national comparison
   - ✅ Click "Export JSON" to download data
   - ✅ Click "Export PNG" to download visualization

### Option 2: Test Locally

1. **Start the local server**:
   ```bash
   cd /Users/tejasgadhia/Claude/personal-tax-analyzer
   python3 -m http.server 8888
   ```

2. **Open in browser**:
   ```
   http://localhost:8888/app.html
   ```

3. **Upload the sample PDF**:
   - The file is located at: `samples/sample-1040-scenario-2.pdf`
   - Drag and drop it onto the upload area

4. **Follow the same verification steps** as Option 1 above

---

## Expected Results for Sample PDF

The sample Form 1040 (`sample-1040-scenario-2.pdf`) is an official IRS MeF ATS test scenario. When parsed, you should see:

### Extraction Results
- **Form Type**: 1040 or 1040-SR
- **Tax Year**: 2024 (or the year specified in the PDF)
- **Income Tax**: The amount from Form 1040, Line 24

### Calculation Results
- Budget data for the extracted tax year should load automatically
- 10 major spending categories should be displayed:
  1. Social Security (22.07%)
  2. Medicare (13.41%)
  3. National Defense (12.82%)
  4. Interest on National Debt (12.97%)
  5. Healthcare (Non-Medicare) (11.04%)
  6. Veterans Benefits (7.74%)
  7. Income Security (7.00%)
  8. Education (3.94%)
  9. Transportation (1.57%)
  10. Everything Else (7.44%)

### Visualization
- Sankey diagram should render with:
  - Left side: "Your Income Tax" (single input)
  - Middle: 10 major categories with color-coded flows
  - Right side: Expandable subcategories (67 total)
  - Smooth animated transitions
  - Interactive hover effects

---

## Comprehensive Test Plan

### Test Case 1: PDF Upload and Parsing

**Objective**: Verify PDF parsing functionality

**Steps**:
1. Navigate to the application
2. Upload `samples/sample-1040-scenario-2.pdf`
3. Observe the upload progress

**Expected Results**:
- ✅ File accepted (valid PDF format)
- ✅ Upload view shows processing message
- ✅ Parser extracts tax year (2019-2026 range)
- ✅ Parser extracts income tax amount from Line 24
- ✅ No console errors
- ✅ Automatic transition to FICA input view

**Failure Cases to Test**:
- Upload a non-PDF file → Should show error: "Invalid file type"
- Upload a PDF that's not a Form 1040 → Should show error: "Could not find Form 1040"
- Upload a PDF with year outside range → Should show error: "Tax year must be between 2019-2026"

---

### Test Case 2: FICA Input (Optional)

**Objective**: Verify FICA tax input and validation

**Steps**:
1. After successful PDF parsing, enter FICA data:
   - Social Security Tax: `9932`
   - Medicare Tax: `2754`
2. Click "Calculate & Visualize"

**Expected Results**:
- ✅ Accepts valid numeric input
- ✅ Allows decimal values (e.g., 9932.50)
- ✅ Accepts $0 (optional field)
- ✅ Calculates combined tax total
- ✅ Shows FICA breakdown if provided
- ✅ Transitions to results view

**Alternative Path**:
- Click "Skip" without entering FICA data
- Should proceed to visualization with income tax only

**Validation Tests**:
- Enter negative value → Should show error
- Enter value > $200,000 for Social Security → Should show error
- Enter value > $100,000 for Medicare → Should show error
- Enter non-numeric text → Should be rejected or ignored

---

### Test Case 3: Calculation and Budget Data Loading

**Objective**: Verify budget data loading and calculations

**Steps**:
1. Complete PDF upload and FICA input
2. Click "Calculate & Visualize"
3. Observe loading state

**Expected Results**:
- ✅ Budget data loads for the correct tax year
- ✅ Loading indicator appears briefly
- ✅ Calculations complete without errors
- ✅ Category percentages sum to 100%
- ✅ Category amounts sum to total income tax (within $1 due to rounding)
- ✅ National comparison data loads correctly

---

### Test Case 4: Sankey Diagram Visualization

**Objective**: Verify D3.js Sankey diagram rendering

**Steps**:
1. Complete calculation step
2. Observe the rendered diagram

**Expected Results**:
- ✅ Diagram renders within 2 seconds
- ✅ All 10 major categories visible
- ✅ Flow widths proportional to amounts
- ✅ Colors match theme (patriotic palette)
- ✅ Labels are readable and correctly positioned
- ✅ No overlapping text
- ✅ Responsive to window resize

**Interactive Elements**:
- ✅ Hover over category → Shows tooltip with exact amount
- ✅ Hover over flow → Highlights the connection
- ✅ Click category → Expands subcategories (if not already shown)
- ✅ Smooth animations on interactions

---

### Test Case 5: National Comparison

**Objective**: Verify percentile comparison feature

**Steps**:
1. Scroll down to "National Comparison" section
2. Review the displayed data

**Expected Results**:
- ✅ Shows your income tax amount
- ✅ Shows national average income tax
- ✅ Shows your percentile ranking (e.g., "You paid more than 67% of taxpayers")
- ✅ Displays reference points (p25, p50, p75, p90, p95, p99)
- ✅ Accurate calculation based on your tax amount

---

### Test Case 6: Export Functionality

**Objective**: Verify data export features

#### JSON Export
**Steps**:
1. Click "Export JSON" button
2. Observe file download

**Expected Results**:
- ✅ File downloads immediately
- ✅ Filename format: `tax-breakdown-YYYY.json`
- ✅ Valid JSON structure
- ✅ Contains all calculation data:
  - `parsedData` (year, incomeTax, fileName, etc.)
  - `ficaData` (if provided)
  - `categoryBreakdown` (all 10 categories with subcategories)
  - `nationalComparison` (percentile data)
  - `totalTax` and `summary`

#### PNG Export
**Steps**:
1. Click "Export PNG" button
2. Wait for processing
3. Observe file download

**Expected Results**:
- ✅ PNG image downloads within 3 seconds
- ✅ Filename format: `tax-visualization-YYYY.png`
- ✅ Image dimensions: 1200x800px
- ✅ High quality rendering (no pixelation)
- ✅ All diagram elements visible in image
- ✅ Colors preserved correctly

---

### Test Case 7: LocalStorage Persistence

**Objective**: Verify session recovery from LocalStorage

**Steps**:
1. Complete full workflow (upload → FICA → visualize)
2. Refresh the page (F5 or Cmd+R)
3. Observe the upload view

**Expected Results**:
- ✅ "Load Previous Session" button appears
- ✅ Shows saved date/time
- ✅ Click button → Immediately restores previous results
- ✅ All data intact (no need to re-upload PDF)
- ✅ Visualization renders from saved data

**Clear Session**:
- Click "Start New Analysis"
- Previous data should be cleared
- Upload view should reset to initial state

---

### Test Case 8: Error Handling

**Objective**: Verify graceful error handling

#### Invalid PDF Upload
- Upload corrupted PDF → Clear error message
- Upload password-protected PDF → Clear error message

#### Budget Data Missing
- Mock scenario: Delete a budget JSON file
- Try to analyze that year → Clear error message

#### Network Failure
- Disconnect internet
- Try to load page → CDN resources fail (expected)
- Application should show clear error about missing dependencies

#### LocalStorage Full
- Rare scenario but should handle gracefully
- Should show error message if save fails

---

### Test Case 9: Browser Compatibility

**Objective**: Verify cross-browser functionality

**Browsers to Test**:
- ✅ Chrome 90+ (Mac/Windows)
- ✅ Firefox 88+ (Mac/Windows)
- ✅ Safari 14+ (Mac)
- ✅ Edge 90+ (Windows)

**Expected Results**:
- All core functionality works identically
- Consistent styling across browsers
- No browser-specific errors
- PDF.js loads correctly
- D3.js renders correctly

**Known Limitations**:
- Mobile browsers: Not supported (requires 1024px+ width)
- Internet Explorer: Not supported (requires ES6+)

---

### Test Case 10: Privacy Verification

**Objective**: Verify no data leaves the browser

**Steps**:
1. Open browser DevTools → Network tab
2. Upload sample PDF
3. Complete full workflow
4. Observe network activity

**Expected Results**:
- ✅ No POST requests to external servers
- ✅ No PUT/PATCH requests
- ✅ Only GET requests for:
  - CDN resources (PDF.js, D3.js)
  - Budget JSON files (from same domain)
  - Application assets (CSS, JS, images)
- ✅ No tracking scripts loaded
- ✅ No analytics beacons fired
- ✅ PDF never uploaded anywhere

**LocalStorage Inspection**:
- Open DevTools → Application → Local Storage
- Should see only one key: `taxAnalyzerData`
- Contains only your analysis data (no identifiers, no tracking)

---

## Performance Benchmarks

### Expected Load Times
- **Initial page load**: < 2 seconds
- **PDF parsing**: < 3 seconds (for typical 2-3 page Form 1040)
- **Budget data load**: < 500ms
- **Sankey rendering**: < 2 seconds
- **PNG export**: < 3 seconds

### Resource Sizes
- **HTML/CSS/JS (total)**: ~120 KB uncompressed
- **Budget JSON files**: ~18 KB each
- **External dependencies (CDN)**: ~800 KB (PDF.js, D3.js)
- **Total initial load**: ~1 MB

---

## Regression Testing Checklist

Use this checklist after any code changes:

### Core Functionality
- [ ] PDF upload accepts valid Form 1040
- [ ] PDF parser extracts year correctly
- [ ] PDF parser extracts income tax correctly
- [ ] FICA input validates correctly
- [ ] Budget data loads for all years (2019-2024)
- [ ] Calculations are accurate (totals match)
- [ ] Sankey diagram renders without errors

### User Interface
- [ ] All views display correctly (upload, FICA, results)
- [ ] Navigation between views works smoothly
- [ ] Buttons and forms are functional
- [ ] Error messages are clear and helpful
- [ ] Loading states are visible during processing

### Interactive Features
- [ ] Hover effects work on diagram
- [ ] Category expansion works
- [ ] Export JSON works
- [ ] Export PNG works
- [ ] LocalStorage save/load works

### Edge Cases
- [ ] Handles very small tax amounts ($1)
- [ ] Handles very large tax amounts ($1,000,000+)
- [ ] Handles missing FICA data (optional)
- [ ] Handles LocalStorage full scenario
- [ ] Handles network failures gracefully

### Privacy & Security
- [ ] No external POST requests
- [ ] No tracking scripts
- [ ] Data stays local
- [ ] LocalStorage only contains analysis data

---

## Automated Testing (Future)

For future development, consider adding:

- **Unit tests** (Jest/Mocha):
  - PDF parser functions
  - Calculator logic
  - Validation functions

- **Integration tests** (Puppeteer/Playwright):
  - Full user workflows
  - Cross-browser testing
  - Screenshot comparisons

- **Performance tests**:
  - Load time monitoring
  - Memory leak detection
  - Bundle size tracking

---

## Reporting Issues

If you find bugs during testing:

1. **Check browser console** for errors (F12 → Console tab)
2. **Capture screenshots** showing the issue
3. **Note your environment**:
   - Browser name and version
   - Operating system
   - Tax year being tested
   - PDF file used
4. **Report at**: https://github.com/tejasgadhia/personal-tax-analyzer/issues

Include:
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots

---

## Test Results Log

After testing, update this section with results:

**Test Date**: _____________
**Tester**: _____________
**Environment**: _____________

| Test Case | Status | Notes |
|-----------|--------|-------|
| PDF Upload & Parsing | [ ] Pass / [ ] Fail | |
| FICA Input | [ ] Pass / [ ] Fail | |
| Calculation & Budget Loading | [ ] Pass / [ ] Fail | |
| Sankey Visualization | [ ] Pass / [ ] Fail | |
| National Comparison | [ ] Pass / [ ] Fail | |
| JSON Export | [ ] Pass / [ ] Fail | |
| PNG Export | [ ] Pass / [ ] Fail | |
| LocalStorage Persistence | [ ] Pass / [ ] Fail | |
| Error Handling | [ ] Pass / [ ] Fail | |
| Browser Compatibility | [ ] Pass / [ ] Fail | |
| Privacy Verification | [ ] Pass / [ ] Fail | |

**Overall Result**: [ ] All Tests Passed / [ ] Issues Found

**Issues Found**: (List any bugs or problems discovered)

---

**Ready to test?** Start with the Quick Test section above using the sample PDF!
