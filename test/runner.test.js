const fs = require('fs');
const path = require('path');

// Mock modules that interact with the file system and test logic.
jest.mock('fs');
const TestCaseRunner = require('../src/test-case-runner');
jest.mock('../src/test-case-runner');

const originalEnv = process.env;

describe('Main Test Runner Script', () => {
    beforeEach(() => {
        // Reset mocks and environment variables before each test.
        jest.resetModules();
        TestCaseRunner.mockClear();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    // Helper function to run the runner script in an isolated environment.
    const runRunnerScript = () => {
        jest.isolateModules(() => {
            require('../src/runner.js');
        });
    };

    it('should throw an error if environment variables are missing', () => {
        delete process.env.CASES_FOLDER;
        process.env.SOLUTION_MAIN_FILE = 'solution.js';
        expect(runRunnerScript).toThrow('Missing required environment variables: CASES_FOLDER and/or SOLUTION_MAIN_FILE');
    });

    it('should throw an error if the cases directory does not exist', () => {
        process.env.CASES_FOLDER = 'non-existent-dir';
        process.env.SOLUTION_MAIN_FILE = 'solution.js';
        fs.existsSync.mockReturnValueOnce(false); // Simulate that the directory does not exist.
        expect(runRunnerScript).toThrow('Test cases directory not found: non-existent-dir');
    });

    it('should throw an error if the solution file does not exist', () => {
        process.env.CASES_FOLDER = 'cases';
        process.env.SOLUTION_MAIN_FILE = 'non-existent-solution.js';
        fs.existsSync.mockReturnValueOnce(true); // cases_folder exists.
        fs.existsSync.mockReturnValueOnce(false); // solution_main_file does not exist.
        expect(runRunnerScript).toThrow('Solution file not found: non-existent-solution.js');
    });

    it('should load and run test cases for all .js files in the directory', () => {
        const casesDir = '/fake/cases';
        const solutionPath = '/fake/solution.js';

        process.env.CASES_FOLDER = casesDir;
        process.env.SOLUTION_MAIN_FILE = solutionPath;

        // Simulate that the paths exist.
        fs.existsSync.mockReturnValue(true);
        // Simulate reading the directory, including files that should be ignored.
        fs.readdirSync.mockReturnValue(['test1.js', 'test2.js', 'config.txt']);

        // Simulate the `require` of test files.
        const mockTestCase = { input: 'in', expectedOutput: 'out' };
        jest.doMock(path.join(casesDir, 'test1.js'), () => mockTestCase, { virtual: true });
        jest.doMock(path.join(casesDir, 'test2.js'), () => mockTestCase, { virtual: true });

        runRunnerScript();

        // Verify that only .js files were processed.
        expect(TestCaseRunner).toHaveBeenCalledTimes(2);
        expect(TestCaseRunner).toHaveBeenCalledWith(solutionPath, mockTestCase, 'test1');
        expect(TestCaseRunner).toHaveBeenCalledWith(solutionPath, mockTestCase, 'test2');

        // Verify that the run method was called on each instance.
        expect(TestCaseRunner.mock.instances[0].run).toHaveBeenCalledTimes(1);
        expect(TestCaseRunner.mock.instances[1].run).toHaveBeenCalledTimes(1);
    });
});