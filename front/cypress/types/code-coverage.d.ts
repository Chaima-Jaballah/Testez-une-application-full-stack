declare module '@cypress/code-coverage/task' {
  const registerCodeCoverageTask: (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => void;
  export default registerCodeCoverageTask;
}
