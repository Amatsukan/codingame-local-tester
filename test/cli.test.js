// Mock dependencies of cli.js to isolate the test.
const mockLoad = jest.fn();
const mockConfigLoader = jest.fn(() => ({
    load: mockLoad,
}));
jest.mock('../src/config/ConfigLoader', () => mockConfigLoader);

const mockSetupEnvironment = jest.fn();
jest.mock('../src/config/setupEnvironment', () => ({ setupEnvironment: mockSetupEnvironment }));

const mockRunTests = jest.fn();
jest.mock('../src/jest/runTests', () => ({ runTests: mockRunTests }));

const mockHandleError = jest.fn();
jest.mock('../src/error_handler', () => ({ handleError: mockHandleError }));

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
        const fakeConfig = { solution_main_file: 'a.js', cases_folder: 'b' };
        mockLoad.mockReturnValue(fakeConfig);

        runCli();

        expect(mockConfigLoader).toHaveBeenCalledWith('codingame-workspace.config.js');
        expect(mockLoad).toHaveBeenCalledTimes(1);
        expect(mockSetupEnvironment).toHaveBeenCalledWith(fakeConfig);
        expect(mockRunTests).toHaveBeenCalledTimes(1);
        expect(mockHandleError).not.toHaveBeenCalled();
    });

    it('should call handleError if ConfigLoader.load throws an error', () => {
        const error = new Error('Failed to load config');
        mockLoad.mockImplementation(() => {
            throw error;
        });

        runCli();

        expect(mockLoad).toHaveBeenCalledTimes(1);
        expect(mockSetupEnvironment).not.toHaveBeenCalled();
        expect(mockRunTests).not.toHaveBeenCalled();
        expect(mockHandleError).toHaveBeenCalledWith(error);
    });

    it('should call handleError if setupEnvironment throws an error', () => {
        const error = new Error('Failed to setup env');
        const fakeConfig = { solution_main_file: 'a.js', cases_folder: 'b' };
        mockLoad.mockReturnValue(fakeConfig);
        mockSetupEnvironment.mockImplementation(() => {
            throw error;
        });

        runCli();

        expect(mockSetupEnvironment).toHaveBeenCalledWith(fakeConfig);
        expect(mockRunTests).not.toHaveBeenCalled();
        expect(mockHandleError).toHaveBeenCalledWith(error);
    });
});