const fs = require('fs');
const path = require('path');
const TestCaseRunner = require('./test-case-runner');

/**
 * Validates environment variables and paths, and discovers test cases.
 * @returns {Array<{solutionPath: string, testCase: object, testName: string}>}
 */
function getTestCases() {
    const casesDirectory = process.env.CASES_FOLDER;
    const solutionPath = process.env.SOLUTION_MAIN_FILE;

    if (!casesDirectory || !solutionPath) {
        throw new Error('Missing required environment variables: CASES_FOLDER and/or SOLUTION_MAIN_FILE');
    }

    if (!fs.existsSync(casesDirectory)) {
        throw new Error(`Test cases directory not found: ${casesDirectory}`);
    }

    if (!fs.existsSync(solutionPath)) {
        throw new Error(`Solution file not found: ${solutionPath}`);
    }

    const testFiles = fs.readdirSync(casesDirectory)
        .filter(file => file.endsWith('.js'));

    return testFiles.map(file => {
        const testCasePath = path.join(casesDirectory, file);
        const testCase = require(testCasePath);
        const testName = path.basename(file, '.js');
        return { solutionPath, testCase, testName };
    });
}

/**
 * Bootstraps the test runner, creating a Jest test suite for the solution.
 */
function bootstrap() {
    const testCases = getTestCases();

    describe('CodinGame Solution Tests', () => {
        testCases.forEach(({ solutionPath, testCase, testName }) => { 
            const runner = new TestCaseRunner(solutionPath, testCase, testName);
            runner.run();
        });
    });
}

module.exports = {
    bootstrap,
    getTestCases, // Export for testing purposes
};