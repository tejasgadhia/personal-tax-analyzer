/**
 * app.js
 * Main application controller
 * Coordinates all modules and manages application state
 */

const TaxApp = {
    /**
     * Application state
     */
    state: {
        currentView: 'upload', // upload, fica, results
        parsedData: null,
        ficaData: null,
        calculatedData: null,
        savedData: null
    },

    /**
     * Initialize the application
     */
    init() {
        // Mobile detection and blocking
        this.checkMobileDevice();

        // Set up event listeners
        this.setupEventListeners();

        // Check for saved data in localStorage
        this.loadSavedData();

        // Show upload view by default
        this.showView('upload');
    },

    /**
     * Check for mobile device and show block screen if needed
     */
    checkMobileDevice() {
        if (window.innerWidth < 1024) {
            document.getElementById('mobileBlock')?.classList.add('active');
            const appContent = document.querySelector('.app-layout');
            if (appContent) {
                appContent.style.display = 'none';
            }
        }
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // File upload handlers
        const fileInput = document.getElementById('pdfFileInput');
        const uploadArea = document.getElementById('uploadArea');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (uploadArea) {
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.processFile(files[0]);
                }
            });

            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        // FICA form handlers
        const ficaForm = document.getElementById('ficaForm');
        if (ficaForm) {
            ficaForm.addEventListener('submit', (e) => this.handleFICASubmit(e));
        }

        const skipFicaBtn = document.getElementById('skipFicaBtn');
        if (skipFicaBtn) {
            skipFicaBtn.addEventListener('click', () => this.skipFICA());
        }

        // Load saved data button
        const loadSavedBtn = document.getElementById('loadSavedBtn');
        if (loadSavedBtn) {
            loadSavedBtn.addEventListener('click', () => this.loadFromSaved());
        }

        // Load sample PDF button
        const loadSampleBtn = document.getElementById('loadSampleBtn');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', () => this.loadSamplePDF());
        }

        // Export buttons
        const exportJSONBtn = document.getElementById('exportJSONBtn');
        if (exportJSONBtn) {
            exportJSONBtn.addEventListener('click', () => this.exportJSON());
        }

        const exportPNGBtn = document.getElementById('exportPNGBtn');
        if (exportPNGBtn) {
            exportPNGBtn.addEventListener('click', () => this.exportPNG());
        }

        // Start over button
        const startOverBtn = document.getElementById('startOverBtn');
        if (startOverBtn) {
            startOverBtn.addEventListener('click', () => this.startOver());
        }

        // Service modal handlers
        this.setupServiceModals();

        // Close modal handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    },

    /**
     * Set up service instruction modals
     */
    setupServiceModals() {
        document.querySelectorAll('.service-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const service = e.target.dataset.service;
                const modal = document.getElementById(service + 'Modal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            });
        });
    },

    /**
     * Handle file selection from input
     */
    handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    },

    /**
     * Process uploaded PDF file
     */
    async processFile(file) {
        try {
            // Show loading modal
            this.showLoadingModal('Parsing your Form 1040...');

            // Parse the PDF
            const parsedData = await PDFParser.parsePDF(file);

            // Store parsed data
            this.state.parsedData = parsedData;

            // Hide loading modal
            this.hideLoadingModal();

            // Show success message
            this.showMessage(`Successfully parsed ${parsedData.formType} for tax year ${parsedData.year}`, 'success');

            // Move to FICA input view
            this.showView('fica');
            this.populateFICAForm();

        } catch (error) {
            this.hideLoadingModal();
            this.showMessage(error.message, 'error');
        }
    },

    /**
     * Populate FICA form with parsed year
     */
    populateFICAForm() {
        if (!this.state.parsedData) return;

        const yearDisplay = document.getElementById('ficaYearDisplay');
        if (yearDisplay) {
            yearDisplay.textContent = this.state.parsedData.year;
        }
    },

    /**
     * Handle FICA form submission
     */
    async handleFICASubmit(event) {
        event.preventDefault();

        const ssInput = document.getElementById('socialSecurityInput').value;
        const medicareInput = document.getElementById('medicareInput').value;

        const socialSecurity = parseFloat(ssInput) || 0;
        const medicare = parseFloat(medicareInput) || 0;

        // Validate FICA inputs
        if (socialSecurity < 0 || socialSecurity > 200000) {
            this.showMessage('Social Security tax must be between $0 and $200,000', 'error');
            return;
        }

        if (medicare < 0 || medicare > 100000) {
            this.showMessage('Medicare tax must be between $0 and $100,000', 'error');
            return;
        }

        this.state.ficaData = {
            socialSecurity,
            medicare
        };

        await this.calculateAndVisualize();
    },

    /**
     * Skip FICA input and proceed with income tax only
     */
    async skipFICA() {
        this.state.ficaData = null;
        await this.calculateAndVisualize();
    },

    /**
     * Calculate breakdown and visualize results
     */
    async calculateAndVisualize() {
        try {
            // Show loading modal
            this.showLoadingModal('Calculating your tax breakdown...');

            // Calculate breakdown
            const breakdown = await TaxCalculator.calculateBreakdown(
                this.state.parsedData.incomeTax,
                this.state.parsedData.year,
                this.state.ficaData
            );

            this.state.calculatedData = breakdown;

            // Save to localStorage
            this.saveData();

            // Hide loading modal
            this.hideLoadingModal();

            // Show results view
            this.showView('results');

            // Render visualization
            this.renderResults();

        } catch (error) {
            this.hideLoadingModal();
            this.showMessage(`Calculation error: ${error.message}`, 'error');
        }
    },

    /**
     * Render results and visualization
     */
    renderResults() {
        if (!this.state.calculatedData) return;

        // Update summary stats
        this.updateSummaryStats();

        // Initialize and render Sankey diagram
        TaxVisualizer.init('sankeyDiagram');
        TaxVisualizer.render(this.state.calculatedData);

        // Render category breakdown table
        this.renderCategoryTable();

        // Render national comparison
        this.renderNationalComparison();
    },

    /**
     * Update summary statistics in results view
     */
    updateSummaryStats() {
        const data = this.state.calculatedData;

        const yearEl = document.getElementById('summaryYear');
        const incomeTaxEl = document.getElementById('summaryIncomeTax');
        const ficaEl = document.getElementById('summaryFICA');
        const totalEl = document.getElementById('summaryTotal');

        if (yearEl) yearEl.textContent = data.year;
        if (incomeTaxEl) incomeTaxEl.textContent = this.formatCurrency(data.incomeTax);

        if (ficaEl) {
            const ficaTotal = data.fica
                ? (data.fica.socialSecurity + data.fica.medicare)
                : 0;
            ficaEl.textContent = this.formatCurrency(ficaTotal);
        }

        if (totalEl) totalEl.textContent = this.formatCurrency(data.totalTax);
    },

    /**
     * Render category breakdown table
     */
    renderCategoryTable() {
        const tableBody = document.getElementById('categoryTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.state.calculatedData.categoryBreakdown.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="category-name">${category.name}</td>
                <td class="category-percentage">${this.formatPercentage(category.percentage)}</td>
                <td class="category-amount">${this.formatCurrency(category.amount)}</td>
            `;
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => this.showCategoryDetails(category));
            tableBody.appendChild(row);
        });
    },

    /**
     * Show detailed breakdown for a category
     */
    showCategoryDetails(category) {
        const modal = document.getElementById('categoryDetailModal');
        if (!modal) return;

        const title = modal.querySelector('.category-detail-title');
        const list = modal.querySelector('.category-detail-list');

        if (title) title.textContent = category.name;

        if (list) {
            list.innerHTML = '';
            category.subcategories.forEach(sub => {
                const item = document.createElement('div');
                item.className = 'category-detail-item';
                item.innerHTML = `
                    <div class="detail-name">${sub.name}</div>
                    <div class="detail-amount">${this.formatCurrency(sub.amount)}</div>
                `;
                list.appendChild(item);
            });
        }

        modal.style.display = 'flex';
    },

    /**
     * Render national comparison section
     */
    renderNationalComparison() {
        const comparison = this.state.calculatedData.nationalComparison;
        if (!comparison) return;

        const userTaxEl = document.getElementById('comparisonUserTax');
        const avgTaxEl = document.getElementById('comparisonAvgTax');
        const percentileEl = document.getElementById('comparisonPercentile');

        if (userTaxEl) userTaxEl.textContent = this.formatCurrency(comparison.userTotal);
        if (avgTaxEl) avgTaxEl.textContent = this.formatCurrency(comparison.nationalAverage);

        if (percentileEl && comparison.percentile) {
            percentileEl.textContent = `${comparison.percentile}th percentile`;
        }
    },

    /**
     * Show a specific view
     */
    showView(viewName) {
        this.state.currentView = viewName;

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(viewName + '-view');
        if (targetView) {
            targetView.classList.add('active');
        }
    },

    /**
     * Show loading modal
     */
    showLoadingModal(message = 'Processing...') {
        const modal = document.getElementById('loadingModal');
        const messageEl = document.getElementById('loadingMessage');

        if (messageEl) messageEl.textContent = message;
        if (modal) modal.style.display = 'flex';
    },

    /**
     * Hide loading modal
     */
    hideLoadingModal() {
        const modal = document.getElementById('loadingModal');
        if (modal) modal.style.display = 'none';
    },

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },

    /**
     * Save data to localStorage
     */
    saveData() {
        const saveData = {
            parsedData: this.state.parsedData,
            ficaData: this.state.ficaData,
            calculatedData: this.state.calculatedData,
            savedAt: new Date().toISOString(),
            version: '0.1.0' // Data format version
        };

        try {
            const dataString = JSON.stringify(saveData);
            localStorage.setItem('taxAnalyzerData', dataString);
        } catch (error) {
            // Check if it's a quota exceeded error
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                this.showMessage('Unable to save data. Browser storage is full. Please clear some space in your browser settings.', 'error');
            } else {
                this.showMessage('Failed to save your data locally. Your results will not be saved for later.', 'error');
            }
        }
    },

    /**
     * Load saved data from localStorage
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('taxAnalyzerData');
            if (savedData) {
                const parsed = JSON.parse(savedData);

                // Validate saved data structure
                if (!this.validateSavedData(parsed)) {
                    localStorage.removeItem('taxAnalyzerData');
                    return;
                }

                this.state.savedData = parsed;

                // Enable load button if saved data exists
                const loadBtn = document.getElementById('loadSavedBtn');
                if (loadBtn) {
                    loadBtn.disabled = false;
                    const savedDate = new Date(this.state.savedData.savedAt);
                    loadBtn.title = `Last saved: ${savedDate.toLocaleString()}`;
                }
            }
        } catch (error) {
            // Corrupted data - remove it
            localStorage.removeItem('taxAnalyzerData');
        }
    },

    /**
     * Validate structure of saved data
     */
    validateSavedData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.parsedData || !data.parsedData.year || !data.parsedData.incomeTax) return false;
        if (!data.calculatedData || !data.calculatedData.categoryBreakdown) return false;
        if (!Array.isArray(data.calculatedData.categoryBreakdown)) return false;
        return true;
    },

    /**
     * Load from saved data
     */
    loadFromSaved() {
        if (!this.state.savedData) {
            this.showMessage('No saved data found', 'info');
            return;
        }

        this.state.parsedData = this.state.savedData.parsedData;
        this.state.ficaData = this.state.savedData.ficaData;
        this.state.calculatedData = this.state.savedData.calculatedData;

        this.showView('results');
        this.renderResults();

        this.showMessage('Loaded previous session data', 'success');
    },

    /**
     * Load sample PDF for testing
     */
    async loadSamplePDF() {
        try {
            // Show loading modal
            this.showLoadingModal('Loading sample Form 1040...');

            // Fetch the sample PDF (use relative path for GitHub Pages compatibility)
            const response = await fetch('./samples/sample-1040-scenario-2.pdf');

            if (!response.ok) {
                throw new Error('Failed to load sample PDF. Please try uploading your own Form 1040.');
            }

            // Convert response to blob
            const blob = await response.blob();

            // Create a File object from the blob
            const file = new File([blob], 'sample-1040-scenario-2.pdf', {
                type: 'application/pdf',
                lastModified: Date.now()
            });

            // Hide loading modal
            this.hideLoadingModal();

            // Process the file using existing logic
            await this.processFile(file);

        } catch (error) {
            this.hideLoadingModal();
            this.showMessage(error.message || 'Failed to load sample PDF', 'error');
        }
    },

    /**
     * Export data as JSON
     */
    exportJSON() {
        const exportData = {
            year: this.state.calculatedData.year,
            incomeTax: this.state.calculatedData.incomeTax,
            fica: this.state.calculatedData.fica,
            totalTax: this.state.calculatedData.totalTax,
            categoryBreakdown: this.state.calculatedData.categoryBreakdown,
            nationalComparison: this.state.calculatedData.nationalComparison,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tax-breakdown-${exportData.year}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('JSON file downloaded', 'success');
    },

    /**
     * Export visualization as PNG
     */
    async exportPNG() {
        try {
            this.showLoadingModal('Generating PNG image...');

            const blob = await TaxVisualizer.exportPNG();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tax-breakdown-${this.state.calculatedData.year}.png`;
            a.click();
            URL.revokeObjectURL(url);

            this.hideLoadingModal();
            this.showMessage('PNG image downloaded', 'success');

        } catch (error) {
            this.hideLoadingModal();
            this.showMessage(`Failed to export PNG: ${error.message}`, 'error');
        }
    },

    /**
     * Start over - reset application
     */
    startOver() {
        // Use native confirm for now - could be replaced with custom modal later
        const confirmed = confirm('Are you sure you want to start over? Your current analysis will be cleared.');

        if (confirmed) {
            this.state.parsedData = null;
            this.state.ficaData = null;
            this.state.calculatedData = null;

            // Clear form inputs
            const fileInput = document.getElementById('pdfFileInput');
            if (fileInput) fileInput.value = '';

            const ficaForm = document.getElementById('ficaForm');
            if (ficaForm) ficaForm.reset();

            // Clear visualization
            TaxVisualizer.clear();

            // Show upload view
            this.showView('upload');

            this.showMessage('Ready for new upload', 'info');
        }
    },

    /**
     * Format currency for display
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format percentage for display
     */
    formatPercentage(decimal) {
        return (decimal * 100).toFixed(1) + '%';
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TaxApp.init());
} else {
    TaxApp.init();
}
