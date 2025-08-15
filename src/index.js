/**
 * @file Main entry point for programmatic use.
 */
const ConfigLoader = require('./config/ConfigLoader');
const { setupEnvironment } = require('./config/setupEnvironment');
const { runTests } = require('./jest/runTests');
const ConfigError = require('./config/ConfigError');

/**
 * Runs the main logic of the tester.
 * @param {string} [configFileName='codingame-workspace.config.js'] - The name of the configuration file.
 * @returns {void}
 */
function run(configFileName = 'codingame-workspace.config.js') {
    const configLoader = new ConfigLoader(configFileName);
    const config = configLoader.load();
    setupEnvironment(config);
    runTests();
}

module.exports = {
    run,
    ConfigLoader,
    setupEnvironment,
    runTests,
    ConfigError
};