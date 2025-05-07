import { defineConfig } from 'cypress';
const config = require('./variables.cy');

export default defineConfig({
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,
  video: false,
  watchForFileChanges: false,
  requestTimeout: 60000,
  responseTimeout: 60000,
  viewportWidth: 1920,
  viewportHeight: 966,
  retries: 2,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: config.urlWebApp(),
    // specPattern: 'cypress/e2e/SanityChecks/**/*.cy.js',
  },
});
