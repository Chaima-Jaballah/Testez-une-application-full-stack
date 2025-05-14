import { defineConfig } from 'cypress'
const codeCoverageTask = require('@cypress/code-coverage/task');

export default defineConfig({
  projectId: '639q1d',
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    baseUrl: 'http://localhost:4200',
  },
})
