const TestCaseRunner = require('../src/test-case-runner');
const path = require('path');

// Mock Jest's `test` function so we can check if it's called.
global.test = jest.fn((name, fn) => fn());

// Mock the user's solution to control its behavior.
const mockSolutionLogic = jest.fn();
// The path for jest.mock must be a string literal because it's hoisted above
// the variable declarations.
jest.mock('../fake-solution.js', () => mockSolutionLogic(), { virtual: true });
const mockSolutionPath = path.resolve(__dirname, '../fake-solution.js');

describe('TestCaseRunner', () => {
    let consoleSpy;

    beforeEach(() => {
        // Clear all mocks before each test.
        jest.clearAllMocks();
        // Ensure the global environment is clean.
        delete global.readline;
        // Spy on console.log to verify restoration.
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should execute a test case and verify the output', () => {
        const testCase = { input: 'line1', expectedOutput: 'output1' };
        const runner = new TestCaseRunner(mockSolutionPath, testCase, 'happy-path');

        mockSolutionLogic.mockImplementation(() => {
            console.log('output1');
        });

        runner.executeTest();

        // Verify that the captured output matches the expected output.
        expect(runner.verifyOutput(['output1'])).toBeUndefined();
    });

    it('should correctly handle empty and undefined expected output', () => {
        const testCase = { input: 'a', expectedOutput: '' };
        const runner = new TestCaseRunner(mockSolutionPath, testCase, 'empty-output');
        mockSolutionLogic.mockImplementation(() => {}); // Solution prints nothing.

        // Check for empty string.
        runner.executeTest();
        expect(runner.verifyOutput([])).toBeUndefined();

        // Check for undefined.
        runner.testCase.expectedOutput = undefined;
        runner.executeTest();
        expect(runner.verifyOutput([])).toBeUndefined();
    });

    it('should call the Jest `test` function when run() is invoked', () => {
        const testCase = { input: '', expectedOutput: '' };
        const runner = new TestCaseRunner(mockSolutionPath, testCase, 'test-name');

        runner.run();

        expect(global.test).toHaveBeenCalledWith(
            'should correctly solve the case: "test-name"',
            expect.any(Function)
        );
    });

    it('should restore console.log even if the solution throws an error', () => {
        const testCase = { input: 'a', expectedOutput: 'b' };
        const runner = new TestCaseRunner(mockSolutionPath, testCase, 'error-path');
        mockSolutionLogic.mockImplementation(() => {
            throw new Error('Solution Error');
        });

        expect(() => runner.executeTest()).toThrow('Solution Error');
        // The console.log spy should have been restored in the 'finally' block.
        expect(consoleSpy.mock.calls.length).toBe(0); // The original mock was restored.
    });
});