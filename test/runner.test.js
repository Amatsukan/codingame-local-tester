const fs = require('fs');
const path = require('path');
const { bootstrap, getTestCases } = require('../src/runner.js');

// Mock modules that interact with the file system and test logic.
jest.mock('fs');
const TestCaseRunner = require('../src/test-case-runner');
jest.mock('../src/test-case-runner');

const originalEnv = process.env;

describe('Test Runner', () => {
    beforeEach(() => {
        // Reset mocks and environment variables before each test.
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('getTestCases', () => {
        it('should throw an error if environment variables are missing', () => {
            delete process.env.CASES_FOLDER;
            process.env.SOLUTION_MAIN_FILE = 'solution.js';
            expect(() => getTestCases()).toThrow('Missing required environment variables: CASES_FOLDER and/or SOLUTION_MAIN_FILE');
        });

        it('should throw an error if the cases directory does not exist', () => {
            process.env.CASES_FOLDER = 'non-existent-dir';
            process.env.SOLUTION_MAIN_FILE = 'solution.js';
            fs.existsSync.mockReturnValueOnce(false); // Simulate that the directory does not exist.
            expect(() => getTestCases()).toThrow('Test cases directory not found: non-existent-dir');
        });

        it('should throw an error if the solution file does not exist', () => {
            process.env.CASES_FOLDER = 'cases';
            process.env.SOLUTION_MAIN_FILE = 'non-existent-solution.js';
            fs.existsSync.mockReturnValueOnce(true); // cases_folder exists.
            fs.existsSync.mockReturnValueOnce(false); // solution_main_file does not exist.
            expect(() => getTestCases()).toThrow('Solution file not found: non-existent-solution.js');
        });

        it('should load and return test cases for all .js files in the directory', () => {
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

            const testCases = getTestCases();

            // Verify that only .js files were processed and returned.
            expect(testCases).toHaveLength(2);
            expect(testCases[0]).toEqual({ solutionPath, testCase: mockTestCase, testName: 'test1' });
            expect(testCases[1]).toEqual({ solutionPath, testCase: mockTestCase, testName: 'test2' });
        });
    });

    describe('bootstrap', () => {
        it('should create a test suite that runs the test cases', () => {
            // Mock Jest's globals to verify that bootstrap sets up the tests correctly.
            const testFn = jest.fn((name, fn) => fn());
            const describeFn = jest.fn((name, fn) => fn());
            global.test = testFn;
            global.describe = describeFn;

            // We'll set up the environment and fs mocks for getTestCases to run.
            const casesDir = '/fake/cases';
            const solutionPath = '/fake/solution.js';
            process.env.CASES_FOLDER = casesDir;
            process.env.SOLUTION_MAIN_FILE = solutionPath;
            fs.existsSync.mockReturnValue(true);
            fs.readdirSync.mockReturnValue(['test1.js']);
            const mockTestCase = { input: 'in', expectedOutput: 'out' };
            jest.doMock(path.join(casesDir, 'test1.js'), () => mockTestCase, { virtual: true });

            bootstrap();

            expect(describeFn).toHaveBeenCalledWith('CodinGame Solution Tests', expect.any(Function));
            expect(testFn).toHaveBeenCalledWith('test1', expect.any(Function));
            expect(TestCaseRunner).toHaveBeenCalledWith(solutionPath, mockTestCase, 'test1');
            expect(TestCaseRunner.mock.instances[0].run).toHaveBeenCalledTimes(1);

            // Restore original jest functions
            delete global.test;
            delete global.describe;
        });
    });
});