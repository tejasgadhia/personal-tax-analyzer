# Development Tasks

## Phase 1: Project Setup & Infrastructure

- [x] Create directory structure
- [ ] Set up GitHub repository configuration
- [ ] Create .gitignore file
- [ ] Set up GitHub Pages in repository settings
- [ ] Download and add library files to /js/libs:
  - [ ] PDF.js (from Mozilla CDN or npm)
  - [ ] D3.js v7
  - [ ] d3-sankey plugin
  - [ ] html2canvas
- [ ] Create placeholder HTML files
- [ ] Set up CSS framework with design tokens
- [ ] Create patriotic theme CSS
- [ ] Add logo and background assets

## Phase 2: Budget Data Collection & Structuring

- [ ] Research federal budget data for FY 2024 from OMB
- [ ] Create 2024.json with complete category structure
- [ ] Verify all percentages add up to 100%
- [ ] Document data sources with citations
- [ ] Research and create 2023.json
- [ ] Research and create 2022.json
- [ ] Research and create 2021.json (Infrastructure bill)
- [ ] Research and create 2020.json (COVID spending)
- [ ] Research and create 2019.json
- [ ] Calculate national averages from IRS data
- [ ] Validate all JSON files against schema
- [ ] Create data validation script

## Phase 3: Landing Page (index.html)

- [ ] Create HTML structure with header
- [ ] Add patriotic styling and star pattern background
- [ ] Write "How to Get Your 1040" instructions section
- [ ] Add three scenarios (online, CPA, IRS transcript)
- [ ] Create W-2 visual example with boxes highlighted
- [ ] Write FICA explanation section
- [ ] Add privacy guarantee banner
- [ ] Style CTA button ("Upload Your 1040")
- [ ] Add footer with links
- [ ] Make fully responsive for desktop

## Phase 4: Core Application Page (app.html)

- [ ] Create main application HTML structure
- [ ] Build upload section with drag-and-drop
- [ ] Add file input with validation
- [ ] Create "Load from saved file" button
- [ ] Build FICA input form
- [ ] Add validation for FICA numeric inputs
- [ ] Create "Calculate" and "Skip" buttons
- [ ] Design results view layout
- [ ] Add header with Clear Data button
- [ ] Create controls panel (view options, reset, expand all)
- [ ] Mobile blocking screen with message

## Phase 5: PDF Parsing (parser.js)

- [ ] Set up PDF.js integration
- [ ] Parse PDF and extract text
- [ ] Identify Form 1040 type (1040, 1040-SR, 1040-NR, 1040-X)
- [ ] Extract tax year from form header
- [ ] Extract federal income tax from Line 24
- [ ] Handle edge cases:
  - [ ] Corrupted PDFs
  - [ ] Password-protected PDFs
  - [ ] Wrong form types
  - [ ] $0 tax returns
  - [ ] Amended returns (1040-X)
- [ ] Validate year is within 2019-2024 range
- [ ] Return structured data object
- [ ] Add comprehensive error messages

## Phase 6: Calculation Engine (calculator.js)

- [ ] Load appropriate budget JSON by year
- [ ] Calculate dollar amount for each category (percentage × total tax)
- [ ] Calculate dollar amount for each subcategory
- [ ] Handle rounding to nearest dollar
- [ ] Generate comparison with national averages
- [ ] Calculate percentage above/below average
- [ ] Return structured breakdown data
- [ ] Handle edge cases ($0 tax, missing FICA)

## Phase 7: Sankey Visualization (sankey.js)

- [ ] Set up D3.js and d3-sankey
- [ ] Create SVG container with proper dimensions
- [ ] Build initial Sankey with top-level categories
- [ ] Implement color coding by category
- [ ] Add labels with amounts and percentages
- [ ] Implement click to expand/collapse
- [ ] Build subcategory rendering
- [ ] Add smooth transitions (300ms)
- [ ] Implement hover tooltips
- [ ] Add "Everything Else" special handling (15+ items)
- [ ] Handle multiple simultaneous expansions
- [ ] Add keyboard navigation support
- [ ] Optimize for performance (debounce, throttle)

## Phase 8: Loading States & Progress

- [ ] Create loading modal component
- [ ] Implement progress bar with real percentages
- [ ] Add ETA calculations
- [ ] Show stage descriptions (loading libraries, parsing PDF, etc.)
- [ ] Implement smooth transitions between stages
- [ ] Test with throttled network (simulate slow loads)

## Phase 9: National Context Display

- [ ] Create stats card component
- [ ] Display average federal income tax
- [ ] Display average FICA
- [ ] Calculate and show user's deviation from average
- [ ] Add numbered superscript citations
- [ ] Link citations to sources page
- [ ] Style for clarity and readability

## Phase 10: Export Features (exporter.js)

### Data Export
- [ ] Create JSON export function
- [ ] Generate filename with year (tax-breakdown-YYYY.json)
- [ ] Trigger browser download
- [ ] Add security warning message

### Image Export
- [ ] Create export modal UI
- [ ] Build customization form:
  - [ ] Name input (toggle + editable field)
  - [ ] Tax year toggle
  - [ ] National averages toggle
  - [ ] Source citations toggle
  - [ ] Expanded categories options (current/all/custom)
  - [ ] Size presets (social/standard/print)
- [ ] Build category selection checklist
- [ ] Create live preview canvas
- [ ] Implement html2canvas rendering
- [ ] Generate PNG at selected resolution
- [ ] Trigger download with proper filename
- [ ] Test all option combinations

## Phase 11: Storage & Data Management (storage.js)

- [ ] Implement localStorage save function
- [ ] Implement localStorage load function
- [ ] Add data validation before saving
- [ ] Create "Load from file" upload handler
- [ ] Implement "Clear Data" functionality
- [ ] Build confirmation modal for clear action
- [ ] Handle storage quota exceeded errors
- [ ] Test load/save round-trip

## Phase 12: Privacy & Security Pages

### Sources Page (sources.html)
- [ ] Create page structure
- [ ] List all data sources with full citations
- [ ] Add direct links to source documents
- [ ] Explain methodology and category mapping
- [ ] Document year-specific notes (COVID, infrastructure, etc.)
- [ ] Add accuracy and limitations section
- [ ] Link to GitHub for questions/issues

### Technical Details Page (technical.html)
- [ ] Create page structure
- [ ] Explain how the application works
- [ ] Add browser console verification instructions
- [ ] Document no tracking/analytics
- [ ] Add open source badge and GitHub link
- [ ] List technical architecture
- [ ] Show data storage details
- [ ] Add browser compatibility info
- [ ] Optional: Create network monitoring widget

## Phase 13: Error Handling

- [ ] Create error display component
- [ ] Implement all error types:
  - [ ] File upload errors
  - [ ] PDF parsing errors
  - [ ] Year not supported
  - [ ] Zero tax
  - [ ] Amended return notification
  - [ ] Storage errors
  - [ ] Export failures
- [ ] Test all error paths
- [ ] Ensure error messages are user-friendly
- [ ] Add recovery actions for each error type

## Phase 14: Main Controller (app.js)

- [ ] Set up application state management
- [ ] Implement page routing/view switching
- [ ] Connect upload to parser
- [ ] Connect FICA input to calculator
- [ ] Trigger visualization after calculation
- [ ] Handle view toggles (income only vs total)
- [ ] Implement reset functionality
- [ ] Implement expand all functionality
- [ ] Connect export modal triggers
- [ ] Add event listeners for all interactions
- [ ] Implement keyboard shortcuts

## Phase 15: Polish & Optimization

- [ ] Minify all JavaScript files
- [ ] Optimize images and SVGs
- [ ] Add lazy loading for D3
- [ ] Implement caching strategies
- [ ] Test and optimize animation performance
- [ ] Add accessibility features (ARIA labels, focus indicators)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance profiling and optimization
- [ ] Fix any visual bugs
- [ ] Review and improve error messages

## Phase 16: Testing

- [ ] Test happy path (upload, calculate, view, export)
- [ ] Test all error scenarios
- [ ] Test edge cases ($0 tax, very large amounts, etc.)
- [ ] Test JSON export/import round-trip
- [ ] Test image export with all options
- [ ] Test on slow network (throttle to 3G)
- [ ] Test with ad blockers enabled
- [ ] Verify no network calls after initial load
- [ ] Test localStorage limits
- [ ] Accessibility testing (keyboard nav, screen readers)
- [ ] Test all 6 years (2019-2024)

## Phase 17: Documentation

- [ ] Write comprehensive README.md
- [ ] Document all features
- [ ] Add screenshots/GIFs
- [ ] Document data sources
- [ ] Add contributing guidelines
- [ ] Create issue templates
- [ ] Add license file (MIT recommended)
- [ ] Write deployment instructions

## Phase 18: Deployment

- [ ] Configure GitHub Pages
- [ ] Set custom domain (if desired)
- [ ] Test deployed version
- [ ] Set up proper redirects
- [ ] Add HTTPS enforcement
- [ ] Test from multiple networks
- [ ] Soft launch to small audience
- [ ] Gather feedback
- [ ] Make any necessary fixes
- [ ] Public launch

## Future Enhancements (Post-MVP)

- [ ] Multi-year comparison view
- [ ] W-2 auto-parsing for FICA
- [ ] State tax breakdowns (start with Texas)
- [ ] Detailed educational content
- [ ] Social sharing features
- [ ] Print-friendly version
- [ ] Spanish language support
- [ ] Historical data visualization (track changes over time)
- [ ] "Compare to friends" feature (anonymous aggregation)
