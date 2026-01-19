/**
 * calculator.js
 * Calculation engine for breaking down tax payments into spending categories
 * Uses budget allocation data to compute dollar amounts per category
 */

const TaxCalculator = {
    /**
     * Budget data cache (loaded from JSON files)
     */
    budgetCache: {},

    /**
     * Calculate tax breakdown based on user's tax payment
     * @param {number} incomeTax - Federal income tax paid
     * @param {number} year - Tax year
     * @param {Object} ficaData - FICA data { socialSecurity, medicare }
     * @returns {Promise<Object>} Breakdown data with categories and comparison
     */
    async calculateBreakdown(incomeTax, year, ficaData = null) {
        try {
            // Load budget data for the year
            const budgetData = await this.loadBudgetData(year);

            // Calculate total tax contribution
            const totalTax = this.calculateTotalTax(incomeTax, ficaData);

            // Get budget allocations
            const allocations = budgetData.allocations;

            // Calculate spending by category
            const categoryBreakdown = this.calculateCategories(incomeTax, allocations);

            // Calculate FICA breakdown if provided
            const ficaBreakdown = ficaData
                ? this.calculateFICABreakdown(ficaData, budgetData.ficaAllocations)
                : null;

            // Get national comparison data
            const nationalComparison = this.getNationalComparison(
                totalTax,
                year,
                budgetData.nationalAverages
            );

            // Build final result
            return {
                year,
                totalTax,
                incomeTax,
                fica: ficaData,
                categoryBreakdown,
                ficaBreakdown,
                nationalComparison,
                budgetTotal: budgetData.totalBudget,
                success: true
            };

        } catch (error) {
            throw new Error(`Failed to calculate breakdown: ${error.message}`);
        }
    },

    /**
     * Load budget data for a specific year
     * @param {number} year - Tax year
     * @returns {Promise<Object>} Budget data
     */
    async loadBudgetData(year) {
        // Check cache first
        if (this.budgetCache[year]) {
            return this.budgetCache[year];
        }

        // Load from JSON file
        try {
            const response = await fetch(`data/budgets/budget-${year}.json`);
            if (!response.ok) {
                throw new Error(`Budget data for ${year} not found`);
            }

            const data = await response.json();

            // Validate data structure comprehensively
            if (!data || typeof data !== 'object') {
                throw new Error(`Invalid budget data format for ${year}`);
            }

            if (!Array.isArray(data.allocations) || data.allocations.length === 0) {
                throw new Error(`Missing or invalid allocations data for ${year}`);
            }

            if (typeof data.totalBudget !== 'number' || data.totalBudget <= 0) {
                throw new Error(`Invalid total budget value for ${year}`);
            }

            // Validate each allocation has required fields
            for (const allocation of data.allocations) {
                if (!allocation.name || typeof allocation.percentage !== 'number') {
                    throw new Error(`Invalid allocation structure in budget data for ${year}`);
                }
                if (!Array.isArray(allocation.subcategories)) {
                    throw new Error(`Missing subcategories in ${allocation.name} for ${year}`);
                }
            }

            // Cache the data
            this.budgetCache[year] = data;
            return data;

        } catch (error) {
            throw new Error(`Could not load budget data for ${year}: ${error.message}`);
        }
    },

    /**
     * Calculate total tax contribution (income tax + FICA)
     * @param {number} incomeTax - Federal income tax
     * @param {Object} ficaData - FICA data or null
     * @returns {number} Total tax
     */
    calculateTotalTax(incomeTax, ficaData) {
        let total = incomeTax;

        if (ficaData) {
            total += (ficaData.socialSecurity || 0) + (ficaData.medicare || 0);
        }

        return total;
    },

    /**
     * Calculate spending breakdown by category
     * @param {number} incomeTax - Federal income tax paid
     * @param {Array} allocations - Budget allocation data
     * @returns {Array} Category breakdown with dollar amounts
     */
    calculateCategories(incomeTax, allocations) {
        const breakdown = [];
        let remainingTotal = incomeTax;
        const lastIndex = allocations.length - 1;

        for (let i = 0; i < allocations.length; i++) {
            const category = allocations[i];

            // For the last category, use remaining amount to avoid rounding errors
            const categoryAmount = (i === lastIndex)
                ? remainingTotal
                : Math.round(incomeTax * category.percentage);

            // Calculate subcategory amounts
            let categoryRemaining = categoryAmount;
            const subcategories = category.subcategories.map((sub, subIndex) => {
                const isLastSub = subIndex === category.subcategories.length - 1;
                const amount = isLastSub
                    ? categoryRemaining
                    : Math.round(incomeTax * sub.percentage);

                categoryRemaining -= amount;

                return {
                    name: sub.name,
                    percentage: sub.percentage,
                    amount: amount,
                    description: sub.description || null
                };
            });

            remainingTotal -= categoryAmount;

            breakdown.push({
                name: category.name,
                percentage: category.percentage,
                amount: categoryAmount,
                subcategories,
                color: category.color || null,
                icon: category.icon || null
            });
        }

        return breakdown;
    },

    /**
     * Calculate FICA tax breakdown
     * @param {Object} ficaData - FICA contributions
     * @param {Object} ficaAllocations - FICA allocation data
     * @returns {Object} FICA breakdown
     */
    calculateFICABreakdown(ficaData, ficaAllocations) {
        if (!ficaAllocations) {
            return null;
        }

        const socialSecurityTotal = ficaData.socialSecurity || 0;
        const medicareTotal = ficaData.medicare || 0;

        return {
            socialSecurity: {
                total: socialSecurityTotal,
                categories: ficaAllocations.socialSecurity.map(cat => ({
                    name: cat.name,
                    percentage: cat.percentage,
                    amount: Math.round(socialSecurityTotal * cat.percentage),
                    description: cat.description || null
                }))
            },
            medicare: {
                total: medicareTotal,
                categories: ficaAllocations.medicare.map(cat => ({
                    name: cat.name,
                    percentage: cat.percentage,
                    amount: Math.round(medicareTotal * cat.percentage),
                    description: cat.description || null
                }))
            }
        };
    },

    /**
     * Get national comparison data
     * @param {number} totalTax - User's total tax
     * @param {number} year - Tax year
     * @param {Object} nationalAverages - National average data
     * @returns {Object} Comparison data
     */
    getNationalComparison(totalTax, year, nationalAverages) {
        if (!nationalAverages) {
            return null;
        }

        const avgIncomeTax = nationalAverages.averageIncomeTax || 0;
        const avgFICA = nationalAverages.averageFICA || 0;
        const avgTotal = avgIncomeTax + avgFICA;

        const percentileEstimate = this.estimatePercentile(totalTax, nationalAverages);

        return {
            userTotal: totalTax,
            nationalAverage: avgTotal,
            difference: totalTax - avgTotal,
            percentDifference: avgTotal > 0
                ? Math.round(((totalTax - avgTotal) / avgTotal) * 100)
                : 0,
            percentile: percentileEstimate,
            numberOfFilers: nationalAverages.numberOfFilers || null,
            year
        };
    },

    /**
     * Estimate user's percentile based on tax paid
     * @param {number} totalTax - User's total tax
     * @param {Object} nationalAverages - National data
     * @returns {number} Estimated percentile (0-100)
     */
    estimatePercentile(totalTax, nationalAverages) {
        if (!nationalAverages.percentileData) {
            return null;
        }

        const percentiles = nationalAverages.percentileData;

        // Find where user falls in the distribution
        if (totalTax <= percentiles.p25) return 25;
        if (totalTax <= percentiles.p50) return 50;
        if (totalTax <= percentiles.p75) return 75;
        if (totalTax <= percentiles.p90) return 90;
        if (totalTax <= percentiles.p95) return 95;
        if (totalTax <= percentiles.p99) return 99;

        return 99; // Top 1%
    },

    /**
     * Format dollar amount for display
     * @param {number} amount - Dollar amount
     * @returns {string} Formatted string
     */
    formatDollar(amount) {
        if (amount === 0) return '$0';
        if (amount < 1000) return '$' + amount.toFixed(0);

        const absAmount = Math.abs(amount);
        let formatted;

        if (absAmount >= 1000000) {
            // Millions
            formatted = '$' + (amount / 1000000).toFixed(2) + 'M';
        } else if (absAmount >= 1000) {
            // Thousands
            formatted = '$' + (amount / 1000).toFixed(1) + 'K';
        } else {
            formatted = '$' + amount.toFixed(0);
        }

        return formatted;
    },

    /**
     * Format percentage for display
     * @param {number} percentage - Decimal percentage (e.g., 0.25 for 25%)
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted string
     */
    formatPercentage(percentage, decimals = 1) {
        return (percentage * 100).toFixed(decimals) + '%';
    },

    /**
     * Clear budget cache (useful for testing)
     */
    clearCache() {
        this.budgetCache = {};
    }
};
