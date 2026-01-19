# Personal Tax Analyzer

> An interactive web application that visualizes where your federal tax dollars go.

**Live Demo:** [Coming Soon]

## 🎯 Overview

Personal Tax Analyzer helps American taxpayers understand government spending by showing them exactly how their tax payment is allocated across federal budget categories. Upload your Form 1040, and see an interactive breakdown with detailed subcategories.

### Key Features

- 🔒 **100% Private**: All processing happens in your browser. Your tax return never leaves your device.
- 📊 **Interactive Visualization**: Two-tier Sankey diagram with expandable categories
- 📈 **National Context**: Compare your taxes to national averages
- 💾 **Export Options**: Save as JSON for later or generate shareable images
- 🇺🇸 **Official Data**: All budget data from OMB, IRS, and other government sources
- 📅 **Historical Support**: Tax years 2019-2024

## 🚀 Quick Start

1. Visit [link to GitHub Pages]
2. Upload your Form 1040 (PDF)
3. Enter your FICA taxes (from W-2)
4. Explore your tax breakdown

## 🛠️ Technology

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Libraries**: PDF.js, D3.js, d3-sankey, html2canvas
- **Hosting**: GitHub Pages (static site)
- **Privacy**: Zero server-side processing

## 📁 Project Structure

```
/
├── index.html          # Landing page with instructions
├── app.html            # Main application
├── sources.html        # Data sources & methodology
├── technical.html      # Technical details & privacy
├── /data/budgets/      # Federal budget data (2019-2024)
├── /js/                # Application logic
├── /css/               # Styles and themes
└── /assets/            # Images and graphics
```

## 🔧 Development

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git
- Text editor

### Local Development

```bash
# Clone repository
git clone https://github.com/tejasgadhia/personal-tax-analyzer.git
cd personal-tax-analyzer

# Open in browser
# Just open index.html in your browser - no build process needed!
```

### Project Status

🚧 **In Active Development**

See [TASKS.md](TASKS.md) for development roadmap and [PROJECT_SPEC.md](PROJECT_SPEC.md) for complete technical specification.

## 📊 Data Sources

All data comes from official U.S. government sources:

- Office of Management and Budget (OMB) Historical Tables
- IRS Statistics of Income
- Congressional Budget Office (CBO)
- USASpending.gov

See [sources.html] for complete citations and methodology.

## 🔐 Privacy & Security

- **No server processing**: Everything runs in your browser
- **No tracking**: Zero analytics, cookies, or external calls
- **No data retention**: We don't store or see your tax information
- **Open source**: Full code available for audit

Read more in [technical.html] or view the source code.

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md] first.

### Areas Where Help Is Needed

- Budget data verification for accuracy
- Accessibility improvements
- Browser compatibility testing
- Translation (starting with Spanish)

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Budget data: Office of Management and Budget
- PDF parsing: Mozilla PDF.js
- Visualization: D3.js community
- Inspiration: Australian Tax Office transparency initiative

## 📧 Contact

Questions? Issues? [Open an issue](https://github.com/tejasgadhia/personal-tax-analyzer/issues)

---

**Disclaimer**: This tool provides an approximation of federal spending based on budget allocations. Tax dollars are not earmarked for specific programs (except Social Security and Medicare payroll taxes). This is for educational purposes only.
