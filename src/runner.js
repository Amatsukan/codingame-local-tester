const fs = require('fs');
const path = require('path');
const TestCaseRunner = require('./test-case-runner');

// Helper function to load and run test cases
function loadAndRunTestCases(casesDirectory, solutionPath) {
    const caseFiles = fs.readdirSync(casesDirectory).filter(file => file.endsWith('.js'));

    caseFiles.forEach(file => {
        const testCase = require(path.join(casesDirectory, file));
        const testName = path.basename(file, '.js');
        new TestCaseRunner(solutionPath, testCase, testName).run();
    });
}

// Main Test Suite for CodinGame Solutions
describe('CodinGame Solution Test Runner', () => {
    const casesDirectory = process.env.CASES_FOLDER;
    const solutionPath = process.env.SOLUTION_MAIN_FILE;

    if (!casesDirectory || !solutionPath) {
        throw new Error('Missing required environment variables: CASES_FOLDER and/or SOLUTION_MAIN_FILE');
    }

    if (!fs.existsSync(casesDirectory)) throw new Error(`Test cases directory not found: ${casesDirectory}`);
    if (!fs.existsSync(solutionPath)) throw new Error(`Solution file not found: ${solutionPath}`);

    loadAndRunTestCases(casesDirectory, solutionPath);
});