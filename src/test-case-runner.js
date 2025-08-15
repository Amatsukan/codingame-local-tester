const MockEnvironment = require('./mock-environment');

/**
 * Orchestrates the execution of a single test case.
 */
class TestCaseRunner {
    constructor(solutionPath, testCase, testName) {
        this.solutionPath = solutionPath;
        this.testCase = testCase;
        this.testName = testName;
    }

    /**
     * Runs a single test case by defining it within Jest.
     */
    run() {
        test(`should correctly solve the case: "${this.testName}"`, this.executeTest.bind(this));
    }

    /**
     * Executes the logic for a single test.
     * It sets up a mock environment, runs the solution code,
     * verifies the output, and cleans up the environment.
     */
    executeTest() {
        const mockEnv = new MockEnvironment(this.testCase.input);
        let capturedOutput;

        try {
            mockEnv.mockReadline();
            capturedOutput = mockEnv.mockConsoleLog();

            // Execute the solution in an isolated module environment
            jest.isolateModules(() => {
                require(this.solutionPath);
            });
            this.verifyOutput(capturedOutput);
        } finally {
            mockEnv.restoreConsoleLog();
        }
    }

    /**
     * Verifies the captured output against the expected output.
     * @param {string[]} capturedOutput - The output captured from console.log.
     */
    verifyOutput(capturedOutput) {
        const expected = (this.testCase.expectedOutput || '').trim();
        const expectedLines = expected ? expected.split('\n') : [];
        expect(capturedOutput).toEqual(expectedLines);
    }
}

module.exports = TestCaseRunner;