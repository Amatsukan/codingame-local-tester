const jest = require('jest');
const path = require('path');

/**
 * Executes Jest tests.
 */
function runTests() {
    // The root directory for the test run is the current working directory.
    // In the integration tests, this is set to the temporary project directory.
    const rootDir = process.cwd();
    const jestRunnerInitFile = path.resolve(__dirname, './jest-runner-init.js');

    const jestArgs = [
        jestRunnerInitFile,
        '--colors',
        '--runInBand',
        '--runTestsByPath',
        '--rootDir', rootDir
    ];

    console.log('Starting CodinGame Local Tester...');
    jest.run(jestArgs);
}
exports.runTests = runTests;
