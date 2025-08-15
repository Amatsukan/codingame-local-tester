const path = require("path");

/**
 * Sets up environment variables based on the user configuration.
 * @param {object} userConfig - The user configuration object.
 * @param {string} configPath - The absolute path to the configuration file.
 */
function setupEnvironment(userConfig, configPath) {
    const configDir = path.dirname(configPath);
    process.env.SOLUTION_MAIN_FILE = path.resolve(configDir, userConfig.solution_main_file);
    process.env.CASES_FOLDER = path.resolve(configDir, userConfig.cases_folder);
}
exports.setupEnvironment = setupEnvironment;


