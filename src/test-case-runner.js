const { fork } = require('child_process');
const path = require('path');

// This script will be injected into the child process to create the `readline` mock.
const readlineSetupPath = path.resolve(__dirname, 'readline-setup.js');

/**
 * Runs a single test case in an isolated child process.
 * @param {string} solutionPath - The absolute path to the user's solution file.
 * @param {object} testCase - An object containing `input` and `expectedOutput`.
 * @returns {Promise<{success: boolean, actual: string, expected: string, error?: Error}>}
 */
function runTestCase(solutionPath, testCase) {
    return new Promise((resolve) => {
        const child = fork(solutionPath, [], {
            // Run in a silent mode to capture stdout.
            // 'ipc' is needed for communication if we ever want to send messages.
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
            // Pre-load our readline mock script.
            execArgv: ['-r', readlineSetupPath]
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                // If the process exited with an error code, treat it as a failure.
                const error = new Error(`Process exited with code ${code}\n${stderr}`);
                return resolve({ success: false, actual: stdout.trim(), expected: (testCase.expectedOutput || '').trim(), error });
            }

            const actual = stdout.trim();
            const expected = (testCase.expectedOutput || '').trim();
            const success = actual === expected;
            resolve({ success, actual, expected });
        });

        child.on('error', (err) => {
            // This catches errors in spawning the process itself.
            resolve({ success: false, actual: '', expected: testCase.expectedOutput, error: err });
        });

        // Send the test case input to the child process's stdin.
        child.stdin.write(testCase.input || '');
        child.stdin.end();
    });
}

module.exports = { runTestCase };