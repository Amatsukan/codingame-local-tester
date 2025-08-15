// Mock dependencies of cli.js to isolate the test.
const mockRun = jest.fn();
jest.mock('../src/index', () => ({
    ...jest.requireActual('../src/index'), // Keep other exports
    run: mockRun
}));

const mockHandleError = jest.fn();
jest.mock('../src/error-handler', () => ({ handleError: mockHandleError }));

describe('CLI main execution', () => {
    beforeEach(() => {
        // Clear all mocks before each test.
        jest.clearAllMocks();
    });

    // Helper function to run the CLI script in an isolated environment.
    const runCli = () => {
        jest.isolateModules(() => {
            require('../bin/cli.js');
        });
    };

    it('should run the full success flow, calling all modules in order', () => {
        runCli();

        expect(mockRun).toHaveBeenCalledTimes(1);
        expect(mockHandleError).not.toHaveBeenCalled();
    });

    it('should call handleError if run() throws an error', () => {
        const error = new Error('Something failed');
        mockRun.mockImplementation(() => {
            throw error;
        });

        runCli();

        expect(mockRun).toHaveBeenCalledTimes(1);
        expect(mockHandleError).toHaveBeenCalledWith(error);
    });
});