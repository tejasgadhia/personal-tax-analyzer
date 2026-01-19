# Personal Tax Analyzer - Technical Specification

## Project Overview

An interactive web application that visualizes where federal tax dollars go. Users upload their Form 1040, and the application shows a detailed, interactive breakdown of how their tax payment is allocated across government spending categories.

**Type:** Static single-page application (SPA)  
**Hosting:** GitHub Pages  
**Processing:** 100% client-side, zero server calls after initial load  
**Target:** Desktop only (1024px minimum width)

## Core Principles

1. **Privacy First**: All processing happens client-side. No data leaves the user's browser.
2. **Educational**: Help taxpayers understand government spending in concrete, personal terms.
3. **Accurate**: Use official government data sources with proper citations.
4. **Accessible**: Clean design, clear language, patriotic but professional theme.

## Technical Architecture

### File Structure

```
/
├── index.html                      # Landing page with instructions
├── app.html                        # Main application
├── sources.html                    # Sources & methodology page
├── technical.html                  # Technical proof/verification page
├── PROJECT_SPEC.md                 # This document
├── TASKS.md                        # Development roadmap
├── README.md                       # Project documentation
│
├── /data
│   └── /budgets
│       ├── 2019.json              # FY2019 federal budget breakdown
│       ├── 2020.json              # FY2020 (includes COVID spending)
│       ├── 2021.json              # FY2021 (Infrastructure bill)
│       ├── 2022.json              # FY2022 (Inflation Reduction Act)
│       ├── 2023.json              # FY2023
│       └── 2024.json              # FY2024
│
├── /js
│   ├── /libs
│   │   ├── pdf.min.js             # PDF.js (~600KB)
│   │   ├── d3.v7.min.js           # D3.js (~250KB)
│   │   ├── d3-sankey.min.js       # Sankey plugin (~20KB)
│   │   └── html2canvas.min.js     # Image export (~150KB)
│   │
│   ├── parser.js                   # 1040 PDF parsing logic
│   ├── calculator.js               # Tax calculations & breakdowns
│   ├── sankey.js                   # Sankey visualization engine
│   ├── exporter.js                 # Data & image export handlers
│   ├── storage.js                  # LocalStorage management
│   └── app.js                      # Main application controller
│
├── /css
│   ├── style.css                   # Global styles
│   ├── patriotic-theme.css         # Red/white/blue theming
│   └── sankey.css                  # Visualization-specific styles
│
├── /assets
│   └── /images
│       ├── logo.svg                # Site logo with eagle/flag motif
│       └── star-pattern.svg        # Subtle background pattern
```

### Technology Stack

**Frontend:**
- Vanilla JavaScript (no frameworks for simplicity and performance)
- HTML5 + CSS3

**Libraries:**
- **PDF.js 3.11.174**: Mozilla's PDF parser for reading Form 1040
- **D3.js v7**: Data visualization core
- **d3-sankey**: Sankey diagram plugin for flow visualization
- **html2canvas 1.4.1**: Canvas-based image export

**No Backend:**
- Static hosting on GitHub Pages
- Zero server-side processing
- No databases
- No API calls after initial page load


## Data Structure

### Budget JSON Format

Each fiscal year has a JSON file (e.g., 2024.json) with this structure:

```json
{
  "fiscalYear": 2024,
  "totalBudget": 6750000000000,
  "dataSource": {
    "primary": "Office of Management and Budget, Historical Tables",
    "url": "https://www.whitehouse.gov/omb/budget/historical-tables/",
    "accessed": "2025-01-19",
    "citation": "[1]"
  },
  "nationalAverages": {
    "avgFederalIncomeTax": 14500,
    "avgFICA": 7200,
    "medianHouseholdIncome": 75000,
    "source": "[2]"
  },
  "categories": [
    {
      "id": "social-security",
      "name": "Social Security",
      "amount": 1450000000000,
      "percentage": 21.48,
      "color": "#4A90E2",
      "icon": "👴",
      "description": "Retirement, disability, and survivors benefits",
      "source": "[1]",
      "subcategories": [
        {
          "name": "Retirement Benefits",
          "amount": 1100000000000,
          "percentage": 75.86,
          "description": "Monthly benefits for retired workers age 62+"
        },
        {
          "name": "Disability Insurance",
          "amount": 145000000000,
          "percentage": 10.00,
          "description": "Benefits for disabled workers"
        }
      ]
    }
  ]
}
```

### Category Structure

**10 Major Categories:**
1. Social Security
2. Medicare
3. National Defense
4. Interest on National Debt
5. Healthcare (Non-Medicare)
6. Income Security (SNAP, housing, EITC, etc.)
7. Veterans Benefits
8. Education
9. Transportation
10. Everything Else (15+ subcategories)

Each category can expand to show 2-16 subcategories.

### User Data Export Format

```json
{
  "version": "1.0",
  "exportDate": "2025-01-19T15:30:00Z",
  "taxData": {
    "year": 2024,
    "federalIncomeTax": 15420,
    "fica": {
      "socialSecurity": 6200,
      "medicare": 1450,
      "total": 7650
    },
    "name": "John Doe",
    "totalTax": 23070
  },
  "calculatedBreakdown": {
    "categories": [...]
  }
}
```

## Core Features

### 1. Document Upload & Parsing

**Supported Documents:**
- Form 1040 (standard)
- Form 1040-SR (seniors)
- Form 1040-NR (non-residents)
- Form 1040-X (amended returns, with notation)

**Parsing Logic:**
- Extract tax year from form header
- Extract federal income tax from Line 24
- Validate document type
- Handle edge cases: $0 tax, corrupted PDFs, wrong forms

**FICA Handling:**
- Manual entry (required)
- Two fields: Social Security (W-2 Box 4) + Medicare (W-2 Box 6)
- Auto-calculate total
- Optional: user can skip and see income tax breakdown only


### 2. Interactive Sankey Visualization

**Two-Tier Drill-Down:**
- Level 1: 10 major categories
- Level 2: 2-16 subcategories per major category

**Interactions:**
- **Click** to expand/collapse categories
- **Hover** for tooltips with exact amounts
- **Multiple expansions** allowed simultaneously
- **Smooth animations** (300ms transitions)

**Visual Design:**
- Flow from left (total tax) to right (categories)
- Color-coded by category type
- Bar thickness represents dollar amount
- Labels show name, amount, and percentage

### 3. National Context & Comparisons

**Statistics Shown:**
- Average federal income tax paid (with source)
- Average FICA paid (with source)
- User's deviation from average (% above/below)
- Numbered citations linking to sources page

**Display:**
- Clean card below visualization
- Comparison bars or text
- Non-judgmental tone

### 4. Export Features

**Data Export:**
- JSON file with user's tax data and calculated breakdown
- Filename: `tax-breakdown-YYYY.json`
- Reload option on upload screen
- Security warning about sensitive data

**Image Export:**
- Customizable before export:
  - Include/exclude name
  - Show/hide tax year
  - Include/hide national averages
  - Include/hide source citations
  - Expanded categories: current view, all, or custom selection
- Size presets:
  - Social media (1200x630)
  - Standard display (1920x1080)
  - High resolution print (3000x2000)
- Live preview updates as options change
- PNG format

### 5. Privacy & Security

**Client-Side Processing:**
- All PDF parsing in browser
- Zero network calls after page load (except CDN libraries)
- No cookies (except localStorage for saved data)
- No analytics or tracking

**Transparency:**
- "Clear Data" button with confirmation
- Sources & Methodology page
- Technical Details page showing how it works
- Optional network monitoring widget
- Open source on GitHub

**Data Storage:**
- Only if user explicitly saves
- Stored in browser localStorage
- Cleared on "Clear Data" or browser cache clear


## Design System

### Color Palette

**Patriotic Theme (Official US Flag Colors):**
```css
--patriot-blue: #002868;      /* Navy blue */
--patriot-red: #BF0A30;       /* Flag red */
--patriot-white: #FFFFFF;
```

**Category Colors:**
```css
--social-security: #4A90E2;   /* Blue */
--medicare: #E24A4A;          /* Red */
--defense: #2C3E50;           /* Dark navy */
--interest: #95A5A6;          /* Gray */
--healthcare: #E67E22;        /* Orange */
--income-security: #27AE60;   /* Green */
--veterans: #8E44AD;          /* Purple */
--education: #3498DB;         /* Light blue */
--transportation: #F39C12;    /* Yellow-orange */
--other: #BDC3C7;             /* Light gray */
```

**UI Colors:**
```css
--bg-primary: #F8F9FA;
--bg-secondary: #FFFFFF;
--text-primary: #2C3E50;
--text-secondary: #7F8C8D;
--border: #DFE6E9;
--success: #27AE60;
--error: #E74C3C;
--warning: #F39C12;
```

### Typography

**Font Family:**
- Primary: Inter (clean, modern, readable)
- Fallback: System fonts

**Font Sizes:**
```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 48px;
```

**Font Weights:**
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Layout & Spacing

**Spacing Scale:**
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

**Layout:**
```css
--container-max-width: 1400px;
--sankey-height: 800px;
--header-height: 80px;
```

### Animations

**Transitions:**
```css
--transition-fast: 150ms ease-in-out;
--transition-base: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;
```


**Patriotic Theme Elements:**
- Subtle star pattern in background (10% opacity)
- Eagle silhouette in logo
- Clean, modern design - avoid being too literal/tacky

## Error Handling

**Error Types:**
1. File upload errors (invalid PDF, corrupted file)
2. PDF parsing errors (can't find Form 1040 data)
3. Year not supported (outside 2019-2024 range)
4. Zero tax (no tax owed)
5. Amended return (1040-X notation)
6. Browser storage full
7. Export failures

**Error Display:**
- Inline (no popups/alerts)
- Clear icons (❌ ⚠️ ℹ️)
- Plain language explanations
- Actionable next steps
- Respectful, non-blaming tone

## Loading States

**Progressive Loading:**
1. Initial page load (0-1.5s): "Loading application..."
2. PDF processing (0-3s): "Reading your 1040..."
3. Calculation (instant): "Calculating breakdown..."
4. Visualization rendering (0.5-1s): Animated Sankey

**Best Practices:**
- Real progress percentages (not fake)
- Accurate ETA calculations
- Specific stage descriptions
- Smooth transitions
- Show file context (name, size)

## Performance Targets

**Load Time:**
- First contentful paint: < 1.5s
- Time to interactive: < 3s
- Total bundle size: < 2MB
- Budget JSON files: < 50KB each

**Runtime:**
- PDF parsing: < 3s for typical 1040
- Calculation: < 100ms
- Sankey render: < 1s
- Expand/collapse: 300ms
- Hover response: < 16ms (60fps)

**Optimization:**
- Lazy load D3 after PDF upload
- Minify all JavaScript
- Compress budget JSONs
- Pre-calculate percentages
- Debounce hover events
- Cache parsed data

## Browser Support

**Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requirements:**
- Desktop only (1024px+ width)
- JavaScript enabled
- ~2MB free memory

## Data Sources

All data from official U.S. government sources:
- Office of Management and Budget (OMB) Historical Tables
- IRS Statistics of Income
- Congressional Budget Office (CBO)
- USASpending.gov

Citations on every statistic.
