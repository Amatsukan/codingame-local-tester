const path = require('path');
const fs = require('fs');
const ConfigError = require('./ConfigError');

/**
 * Handles configuration-related operations.
 */
class ConfigLoader {
    constructor(fileName) {
        this.fileName = fileName;
    }

    /**
     * Loads the user configuration from the project root.
     * @returns {object} The user configuration object.
     * @throws {ConfigError} If the configuration file is not found.
     */
    load() {
        const configPath = path.join(process.cwd(), this.fileName);
        if (!fs.existsSync(configPath)) {
            throw new ConfigError(`Configuration file not found! Please create a "${this.fileName}" in the root of your project.`);
        }
        return require(configPath);
    }
}

module.exports = ConfigLoader;