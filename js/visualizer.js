/**
 * visualizer.js
 * D3.js-based Sankey diagram visualization
 * Creates interactive flow diagram showing tax breakdown
 */

const TaxVisualizer = {
    /**
     * Container and dimensions
     */
    container: null,
    svg: null,
    width: 0,
    height: 0,
    margin: { top: 20, right: 120, bottom: 20, left: 120 },

    /**
     * D3 Sankey generator
     */
    sankey: null,

    /**
     * Color scale for categories
     */
    colorScale: null,

    /**
     * Initialize the visualizer
     * @param {string} containerId - ID of container element
     */
    init(containerId) {
        try {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                throw new Error(`Visualization container "${containerId}" not found. Please ensure the element exists in your HTML.`);
            }

            // Clear any existing content
            this.container.innerHTML = '';

            // Set up responsive dimensions
            this.updateDimensions();

            // Create SVG
            this.svg = d3.select(`#${containerId}`)
                .append('svg')
                .attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom)
                .append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

            // Initialize Sankey generator
            this.sankey = d3.sankey()
                .nodeId(d => d.name)
                .nodeWidth(20)
                .nodePadding(15)
                .extent([[0, 0], [this.width, this.height]]);

            // Set up color scale
            this.setupColorScale();

        } catch (error) {
            throw new Error(`Failed to initialize visualizer: ${error.message}`);
        }
    },

    /**
     * Update dimensions based on container size
     */
    updateDimensions() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width - this.margin.left - this.margin.right;
        this.height = Math.max(800, rect.height - this.margin.top - this.margin.bottom);
    },

    /**
     * Set up color scale for categories
     */
    setupColorScale() {
        // Patriotic color palette with variations
        const colors = [
            '#002868', // Navy Blue
            '#BF0A30', // Red
            '#0047AB', // Cobalt Blue
            '#C41E3A', // US Red
            '#003f87', // Blue
            '#cd2026', // Red variation
            '#1c3a70', // Dark Blue
            '#a8132e', // Crimson
            '#4d6fa3', // Light Blue
            '#e03c31'  // Light Red
        ];

        this.colorScale = d3.scaleOrdinal(colors);
    },

    /**
     * Render the Sankey diagram
     * @param {Object} breakdownData - Calculated breakdown data
     */
    async render(breakdownData) {
        try {
            // Transform data into Sankey format
            const sankeyData = this.transformData(breakdownData);

            // Generate Sankey layout
            const { nodes, links } = this.sankey(sankeyData);

            // Clear previous visualization
            this.svg.selectAll('*').remove();

            // Render links (flows)
            this.renderLinks(links);

            // Render nodes (categories)
            this.renderNodes(nodes);

            // Add interactivity
            this.addInteractivity();

        } catch (error) {
            throw new Error(`Failed to render visualization: ${error.message}`);
        }
    },

    /**
     * Transform breakdown data into Sankey format
     * @param {Object} breakdownData - Breakdown data from calculator
     * @returns {Object} Sankey data { nodes, links }
     */
    transformData(breakdownData) {
        const nodes = [];
        const links = [];

        // Source node: "Your Taxes"
        const sourceNode = {
            name: 'Your Federal Taxes',
            value: breakdownData.incomeTax,
            layer: 0
        };
        nodes.push(sourceNode);

        // Category nodes (middle layer)
        breakdownData.categoryBreakdown.forEach((category, idx) => {
            const categoryNode = {
                name: category.name,
                value: category.amount,
                layer: 1,
                color: category.color || this.colorScale(idx)
            };
            nodes.push(categoryNode);

            // Link from source to category
            links.push({
                source: sourceNode.name,
                target: category.name,
                value: category.amount
            });

            // Subcategory nodes (right layer)
            category.subcategories.forEach(sub => {
                // Check if subcategory node already exists
                let subNode = nodes.find(n => n.name === sub.name && n.layer === 2);

                if (!subNode) {
                    subNode = {
                        name: sub.name,
                        value: sub.amount,
                        layer: 2,
                        parent: category.name
                    };
                    nodes.push(subNode);
                } else {
                    // Add to existing node value (for shared subcategories)
                    subNode.value += sub.amount;
                }

                // Link from category to subcategory
                links.push({
                    source: category.name,
                    target: sub.name,
                    value: sub.amount
                });
            });
        });

        return { nodes, links };
    },

    /**
     * Render Sankey links (flows)
     * @param {Array} links - Sankey links
     */
    renderLinks(links) {
        const link = this.svg.append('g')
            .attr('class', 'links')
            .selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'sankey-link')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('stroke-width', d => Math.max(1, d.width))
            .style('fill', 'none')
            .style('stroke', d => {
                // Color links based on source node
                const sourceNode = d.source;
                return sourceNode.color || this.colorScale(sourceNode.name);
            })
            .style('stroke-opacity', 0.3)
            .on('mouseenter', function(event, d) {
                d3.select(this)
                    .style('stroke-opacity', 0.6)
                    .style('stroke-width', d.width + 2);
            })
            .on('mouseleave', function(event, d) {
                d3.select(this)
                    .style('stroke-opacity', 0.3)
                    .style('stroke-width', d.width);
            });

        // Add tooltips to links
        link.append('title')
            .text(d => `${d.source.name} → ${d.target.name}\n$${d.value.toLocaleString()}`);
    },

    /**
     * Render Sankey nodes (categories)
     * @param {Array} nodes - Sankey nodes
     */
    renderNodes(nodes) {
        const node = this.svg.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'sankey-node');

        // Node rectangles
        node.append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => Math.max(1, d.y1 - d.y0))
            .attr('width', d => d.x1 - d.x0)
            .style('fill', d => d.color || this.colorScale(d.name))
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseenter', function(event, d) {
                d3.select(this)
                    .style('opacity', 0.8);
            })
            .on('mouseleave', function(event, d) {
                d3.select(this)
                    .style('opacity', 1);
            });

        // Node labels
        node.append('text')
            .attr('x', d => d.x0 < this.width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < this.width / 2 ? 'start' : 'end')
            .text(d => d.name)
            .style('font-family', 'var(--font-sans)')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#1a1a1a')
            .style('pointer-events', 'none');

        // Value labels
        node.append('text')
            .attr('x', d => d.x0 < this.width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '1.5em')
            .attr('text-anchor', d => d.x0 < this.width / 2 ? 'start' : 'end')
            .text(d => `$${d.value.toLocaleString()}`)
            .style('font-family', 'var(--font-sans)')
            .style('font-size', '11px')
            .style('fill', '#666')
            .style('pointer-events', 'none');

        // Tooltips for nodes
        node.append('title')
            .text(d => `${d.name}\n$${d.value.toLocaleString()}`);
    },

    /**
     * Add interactivity to the visualization
     */
    addInteractivity() {
        // Add zoom capability
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                this.svg.attr('transform', event.transform);
            });

        d3.select(this.container).select('svg').call(zoom);

        // Add reset button
        this.addResetButton();
    },

    /**
     * Add reset zoom button
     */
    addResetButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'viz-controls';
        buttonContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
        `;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Zoom';
        resetButton.className = 'btn-secondary';
        resetButton.onclick = () => {
            d3.select(this.container).select('svg')
                .transition()
                .duration(750)
                .call(d3.zoom().transform, d3.zoomIdentity);
        };

        buttonContainer.appendChild(resetButton);

        // Position container relatively for absolute button positioning
        this.container.style.position = 'relative';
        this.container.appendChild(buttonContainer);
    },

    /**
     * Export visualization as PNG
     * @returns {Promise<Blob>} PNG image blob
     */
    async exportPNG() {
        try {
            const svgElement = this.container.querySelector('svg');

            if (!svgElement) {
                throw new Error('No visualization to export. Please render the diagram first.');
            }

            // Validate SVG element has dimensions
            if (!svgElement.width || !svgElement.height ||
                !svgElement.width.baseVal || !svgElement.height.baseVal) {
                throw new Error('Visualization not fully rendered. Please try again.');
            }

            const svgString = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const img = new Image();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        canvas.width = svgElement.width.baseVal.value;
                        canvas.height = svgElement.height.baseVal.value;
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        URL.revokeObjectURL(url);

                        canvas.toBlob(blob => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to create PNG image'));
                            }
                        }, 'image/png');
                    } catch (error) {
                        URL.revokeObjectURL(url);
                        reject(error);
                    }
                };

                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG for export'));
                };

                img.src = url;
            });
        } catch (error) {
            throw new Error(`PNG export failed: ${error.message}`);
        }
    },

    /**
     * Export visualization as SVG
     * @returns {Blob} SVG blob
     */
    exportSVG() {
        const svgElement = this.container.querySelector('svg');
        const svgString = new XMLSerializer().serializeToString(svgElement);
        return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    },

    /**
     * Resize handler for responsive design
     */
    resize() {
        this.updateDimensions();

        // Update SVG dimensions
        d3.select(this.container).select('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        // Update Sankey extent
        this.sankey.extent([[0, 0], [this.width, this.height]]);
    },

    /**
     * Clear the visualization
     */
    clear() {
        if (this.svg) {
            this.svg.selectAll('*').remove();
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    },

    /**
     * Clean up event listeners and resources
     */
    destroy() {
        this.clear();
        // Remove resize listener if needed
        if (this._resizeListener) {
            window.removeEventListener('resize', this._resizeListener);
            this._resizeListener = null;
        }
    }
};

// Handle window resize with cleanup capability
TaxVisualizer._resizeListener = null;
let resizeTimeout;

TaxVisualizer._resizeListener = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (TaxVisualizer.svg) {
            TaxVisualizer.resize();
        }
    }, 250);
};

window.addEventListener('resize', TaxVisualizer._resizeListener);
