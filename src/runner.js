/**
 * @file This script is the main test runner for Jest. It discovers test cases,
 * sets up the environment, and executes the tests.
 */

const fs = require('fs');
const path = require('path');
const TestCaseRunner = require('./test-case-runner');

/**
 * Loads all test case files from a directory and initiates a runner for each.
 * @param {string} casesDirectory The absolute path to the directory containing test case files.
 * @param {string} solutionPath The absolute path to the user's solution file.
 */
function loadAndRunTestCases(casesDirectory, solutionPath) {
    const caseFiles = fs.readdirSync(casesDirectory).filter(file => file.endsWith('.js'));

    caseFiles.forEach(file => {
        const testCase = require(path.join(casesDirectory, file));
        const testName = path.basename(file, '.js');
        new TestCaseRunner(solutionPath, testCase, testName).run();
    });
}

describe('CodinGame Solution Test Suite', () => {
    const casesDirectory = process.env.CASES_FOLDER;
    const solutionPath = process.env.SOLUTION_MAIN_FILE;

    if (!casesDirectory || !solutionPath) {
        throw new Error('Missing required environment variables: CASES_FOLDER and/or SOLUTION_MAIN_FILE');
    }

    if (!fs.existsSync(casesDirectory)) throw new Error(`Test cases directory not found: ${casesDirectory}`);
    if (!fs.existsSync(solutionPath)) throw new Error(`Solution file not found: ${solutionPath}`);

    loadAndRunTestCases(casesDirectory, solutionPath);
});