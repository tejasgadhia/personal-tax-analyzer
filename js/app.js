/**
 * app.js
 * Main application controller
 * Coordinates all modules and manages application state
 */

// Placeholder - to be implemented in Phase 14
console.log('app.js loaded');

// Mobile detection and blocking
if (window.innerWidth < 1024) {
    document.getElementById('mobileBlock')?.classList.add('active');
    document.getElementById('appContent')?.classList.add('hidden');
}
