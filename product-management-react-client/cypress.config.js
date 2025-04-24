// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // --- Add or update the baseUrl here ---
    baseUrl: 'http://localhost:3001', // *** Set this to your React app's dev server URL ***
    // ---------------------------------------
  },
});