# Personal Tax Analyzer

> **Visualize where your federal tax dollars go.** Upload your Form 1040 and see an interactive breakdown of government spending based on your personal tax contribution.

![Version](https://img.shields.io/badge/version-0.1.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Privacy](https://img.shields.io/badge/privacy-100%25%20local-brightgreen.svg)

## 🎯 Overview

Personal Tax Analyzer helps American taxpayers understand government spending by showing exactly how their tax payment is allocated across federal budget categories. Upload your Form 1040, and explore an interactive Sankey diagram with detailed subcategories.

### ✨ Key Features

- 🔒 **100% Private**: All processing happens in your browser. Your tax return never leaves your device
- 📊 **Interactive Visualization**: Dynamic Sankey diagram with 10 major categories and 67 subcategories
- 📈 **National Comparison**: See how your tax contribution compares to the national average taxpayer
- 💾 **Export & Save**: Download your breakdown as JSON or generate a PNG image to share
- 🇺🇸 **Official Data**: Budget data sourced from OMB, Congressional Budget Office, and U.S. Treasury
- 📅 **Historical Data**: Analyze federal spending across tax years 2019–2026

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
Visit the live application at: `https://tejasgadhia.github.io/personal-tax-analyzer`

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/tejasgadhia/personal-tax-analyzer.git
cd personal-tax-analyzer

# Serve locally (choose one)
python -m http.server 8000  # Python 3
# or
npx serve

# Visit http://localhost:8000
```

## 📋 How It Works

1. **Upload**: Drag and drop your Form 1040 PDF
2. **Parse**: The app extracts your tax year and federal income tax amount
3. **FICA** (Optional): Add Social Security and Medicare taxes from your W-2
4. **Calculate**: Your tax is allocated across federal budget categories
5. **Visualize**: Explore an interactive Sankey diagram showing where your money goes

## 📝 Supported Forms

- **Form 1040** (U.S. Individual Income Tax Return)
- **Form 1040-SR** (U.S. Tax Return for Seniors)
- **Form 1040-NR** (U.S. Nonresident Alien Income Tax Return)
- **Tax Years**: 2019–2026 (2025-2026 data pending)

**Not supported**: Form 1040-X (Amended Returns)

## 🧪 Testing with Sample Data

Want to try the application before uploading your own tax return? Use the provided sample Form 1040:

1. **Download the sample**: Navigate to the `samples/` directory
2. **Use the IRS test scenario**: `sample-1040-scenario-2.pdf` (official IRS MeF ATS test data)
3. **Upload to the app**: Drag and drop or browse to select the file
4. **Explore**: See how the parser extracts data and visualizes the breakdown

The sample file is an official IRS test document used by e-file software developers and contains no real personal information. See [samples/README.md](samples/README.md) for more details.

**For comprehensive testing instructions**, see [TESTING.md](TESTING.md) - includes test cases, expected results, and a complete testing checklist.

## 🛠️ Technology Stack

### Frontend
- **No frameworks**: Pure HTML/CSS/JavaScript
- **D3.js v7**: Data visualization
- **D3-Sankey**: Flow diagrams
- **PDF.js**: Client-side PDF parsing

### Design
- Patriotic red, white, and blue theme
- Fully responsive (desktop 1024px+)
- Semantic HTML with accessibility considerations

### Privacy Architecture
- ✅ Zero server-side processing
- ✅ Zero data transmission
- ✅ LocalStorage for session persistence only
- ✅ All computation runs in-browser
- ✅ No analytics or tracking

## 📁 Project Structure

```
personal-tax-analyzer/
├── index.html              # Landing page
├── app.html                # Main application
├── sources.html            # Data source citations (TBD)
├── technical.html          # How it works (TBD)
├── README.md               # This file
├── LICENSE                 # MIT License
├── TASKS.md                # Development roadmap
├── PROJECT_SPEC.md         # Technical specification
├── css/
│   ├── style.css           # Base styles
│   └── patriotic-theme.css # Theme and component styles
├── js/
│   ├── app.js              # Main application controller
│   ├── parser.js           # PDF parsing engine
│   ├── calculator.js       # Calculation engine
│   └── visualizer.js       # D3 Sankey visualization
├── data/
│   └── budgets/            # Federal budget JSON files
│       ├── budget-2019.json
│       ├── budget-2020.json
│       ├── budget-2021.json
│       ├── budget-2022.json
│       ├── budget-2023.json
│       └── budget-2024.json
├── samples/
│   ├── README.md           # Sample file documentation
│   └── sample-1040-scenario-2.pdf  # IRS test scenario
└── assets/
    └── images/
        └── logo.svg        # Application logo
```

## 📊 Budget Data Structure

Budget JSON files follow this structure:

```json
{
  "year": 2024,
  "totalBudget": 6800000000000,
  "allocations": [
    {
      "name": "Social Security",
      "percentage": 0.21,
      "subcategories": [
        {
          "name": "Old-Age and Survivors Insurance",
          "percentage": 0.17,
          "description": "Monthly benefits for retirees and survivors"
        }
      ],
      "color": "#002868"
    }
  ],
  "nationalAverages": {
    "averageIncomeTax": 14500,
    "averageFICA": 7800,
    "numberOfFilers": 150000000,
    "percentileData": {
      "p25": 5000,
      "p50": 12000,
      "p75": 25000,
      "p90": 45000,
      "p95": 75000,
      "p99": 150000
    }
  },
  "ficaAllocations": {
    "socialSecurity": [...],
    "medicare": [...]
  }
}
```

## 🔧 Development

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Static file server for local development
- **No build process required!**

### Making Changes

1. Edit files directly (no compilation needed)
2. Refresh browser to see changes
3. Test with real Form 1040 PDFs

### Adding New Tax Years

1. Create `data/budgets/budget-YYYY.json`
2. Follow the existing JSON structure
3. Source data from official OMB, CBO, and Treasury publications
4. Update year validation in `parser.js` if needed

### Code Quality

All JavaScript code has been reviewed and optimized for:
- ✅ Error handling and validation
- ✅ Input sanitization and bounds checking
- ✅ Rounding error prevention (totals always match)
- ✅ Memory leak prevention
- ✅ LocalStorage quota management
- ✅ Production readiness

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome  | 90+           | ✅ Tested |
| Firefox | 88+           | ✅ Tested |
| Safari  | 14+           | ✅ Tested |
| Edge    | 90+           | ✅ Tested |

**Note**: Mobile devices are not currently supported due to visualization complexity. Minimum screen width: 1024px.

## 🔐 Privacy & Security

### What We DON'T Do
- ❌ No backend servers
- ❌ No analytics or tracking
- ❌ No external API calls (except CDN libraries)
- ❌ No data collection
- ❌ No cookies
- ❌ No user accounts

### What We DO
- ✅ Client-side PDF parsing only
- ✅ LocalStorage for convenience (stays on your device)
- ✅ Open source code (audit it yourself)
- ✅ Static hosting (GitHub Pages)

### Security Measures
- Strict file type validation
- Input bounds checking
- XSS prevention
- Safe PDF rendering
- No eval() or unsafe code execution

## 🗺️ Roadmap

### v0.1.0 (Current Release)
- ✅ Core PDF parsing
- ✅ Interactive Sankey visualization
- ✅ National comparison
- ✅ JSON/PNG export
- ✅ LocalStorage persistence
- ✅ Error handling and validation

### v0.2.0 (Planned)
- [ ] Add 2025 and 2026 budget data
- [ ] Create `sources.html` with full citations
- [ ] Create `technical.html` explaining methodology
- [ ] Comparison mode (compare multiple years)
- [ ] Enhanced mobile support

### v0.3.0 (Future)
- [ ] State tax integration
- [ ] PDF report generation
- [ ] Historical trend analysis
- [ ] Multi-language support (Spanish first)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution
- [ ] Additional tax form support (1040-EZ, etc.)
- [ ] Improved PDF parsing accuracy
- [ ] Additional data visualizations
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Budget data for 2025-2026
- [ ] Translations (i18n)
- [ ] Unit tests

## 📚 Data Sources

All federal budget data sourced from official U.S. government sources:

- **OMB Historical Tables**: Office of Management and Budget historical budget data
- **Congressional Budget Office**: Federal spending projections and analysis
- **U.S. Treasury**: IRS Statistics of Income
- **USASpending.gov**: Official government spending data

Full citations and methodology will be available in `sources.html` (to be added in v0.2.0).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Tejas Gadhia

## ⚠️ Disclaimer

This tool is for **educational and informational purposes only**. It provides estimates based on official federal budget data but should not be used for:

- Tax advice or tax preparation
- Financial planning decisions
- Legal purposes or litigation

**Important Notes:**
- The allocation percentages are approximations based on overall federal budget data
- Individual tax payments are not earmarked for specific programs (except Social Security and Medicare payroll taxes)
- Tax distribution depends on many factors not captured in this simplified model
- Consult a qualified tax professional for specific tax guidance

## 🙏 Acknowledgments

- **PDF.js** by Mozilla - for making client-side PDF parsing possible
- **D3.js** by Mike Bostock - for incredible data visualization tools
- **U.S. Government** - for publishing open budget data
- **Australian Tax Office** - for inspiration with their tax receipt feature

## 📧 Support

For issues, questions, or suggestions:

- 🐛 [Report a bug](https://github.com/tejasgadhia/personal-tax-analyzer/issues/new?labels=bug)
- 💡 [Request a feature](https://github.com/tejasgadhia/personal-tax-analyzer/issues/new?labels=enhancement)
- 📖 [Read the documentation](https://github.com/tejasgadhia/personal-tax-analyzer/wiki) (coming soon)
- 💬 [Start a discussion](https://github.com/tejasgadhia/personal-tax-analyzer/discussions)

---

**Built with ❤️ and Claude Code** • [View Source](https://github.com/tejasgadhia/personal-tax-analyzer) • [Live Demo](https://tejasgadhia.github.io/personal-tax-analyzer)

## License

This project is licensed under the [O'Saasy License Agreement](https://osaasy.dev/).

**TL;DR**: You can use, modify, and distribute this project freely. You can self-host it for personal or commercial use. However, you cannot offer it as a competing hosted/managed SaaS product.

See [LICENSE.md](LICENSE.md) for full details.
