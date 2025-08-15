const path = require('path');

/**
 * Sets up environment variables based on the user configuration.
 * @param {object} userConfig - The user configuration object.
 */
function setupEnvironment(userConfig) {
    process.env.SOLUTION_MAIN_FILE = path.resolve(process.cwd(), userConfig.solution_main_file);
    process.env.CASES_FOLDER = path.resolve(process.cwd(), userConfig.cases_folder);
}
exports.setupEnvironment = setupEnvironment;
