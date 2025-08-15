const jest = require('jest');
const path = require('path');

/**
 * Executes Jest tests.
 */
function runTests() {
    const jestTestRunnerFile = path.resolve(__dirname, '../src/runner.js');

    const jestArgs = [
        jestTestRunnerFile,
        '--colors',
        '--runInBand'
    ];

    console.log('Starting CodinGame Local Tester...');
    jest.run(jestArgs);
}
exports.runTests = runTests;
