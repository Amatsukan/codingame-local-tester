/**
 * Handles errors that occur during the execution of the CLI.
 * It logs a formatted message to stderr and exits the process.
 * @param {Error} error The error object.
 */
function handleError(error) {
    if (error instanceof ConfigError) {
        console.error(`Error: ${error.message}`);
    } else {
        // Generic error handling for other unexpected errors
        console.error(`Error: ${error.message || 'An unexpected error occurred!'}`);
    }
    process.exit(1);
}

module.exports = { handleError }