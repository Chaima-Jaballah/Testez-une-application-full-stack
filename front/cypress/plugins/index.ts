/// <reference types="cypress" />

import registerCodeCoverageTask from '@cypress/code-coverage/task';

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  registerCodeCoverageTask(on, config);
  return config;
};

export default pluginConfig;
