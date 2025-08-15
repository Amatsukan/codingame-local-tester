const { handleError } = require('../src/errorHandler');

// Custom error class to simulate the CLI scenario.
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}

describe('handleError', () => {
    let consoleErrorSpy;
    let processExitSpy;

    beforeEach(() => {
        // Mock to prevent tests from halting execution and polluting the console.
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle ConfigError with a specific message format', () => {
        const error = new ConfigError('Invalid configuration');
        handleError(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Invalid configuration');
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle generic Error with a message', () => {
        const error = new Error('Something went wrong');
        handleError(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Something went wrong');
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle generic Error without a message', () => {
        const error = new Error(); // Error without a message.
        handleError(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error: An unexpected error occurred!');
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });
});