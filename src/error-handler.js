const ConfigError = require('./config/ConfigError');

/**
 * Centralized error handler.
 * @param {Error} error
 */
function handleError(error) {
    if (error instanceof ConfigError) {
        console.error(`Error: ${error.message}`);
    } else {
        const message = error.message && error.message.trim() !== '' ? error.message : 'An unexpected error occurred!';
        console.error(`Error: ${message}`);
    }
    process.exit(1);
}

module.exports = { handleError };