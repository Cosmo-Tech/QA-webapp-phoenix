const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    numTestsKeptInMemory: 0,
    video: false,
    watchForFileChanges: false,
    requestTimeout: 60000,
    responseTimeout: 60000,
    viewportWidth: 1920,
    viewportHeight: 966,
    retries: 2,
  },
});
