/**
 * Manages the mocking of global functions like `readline` and `console.log`.
 */
class MockEnvironment {
    /**
     * @param {string} [testCaseInput=''] The input string for the test case.
     */
    constructor(testCaseInput) {
        this.testCaseInput = testCaseInput || '';
        this.consoleSpy = null;
        this.currentLine = 0;
        this.capturedOutput = [];
    }

    /**
     * Mocks `readline` to provide test case input.
     */
    mockReadline() {
        const mockInputLines = this.testCaseInput.trim().split('\n');
        global.readline = jest.fn(() => mockInputLines[this.currentLine++]);
    }

    /**
     * Mocks `console.log` to capture its output.
     * @returns {string[]} The array where console output will be captured.
     */
    mockConsoleLog() {
        this.consoleSpy = jest.spyOn(console, 'log').mockImplementation(output => {
            this.capturedOutput.push(String(output));
        });
        return this.capturedOutput;
    }

    /**
     * Restores the original `console.log` function.
     */
    restoreConsoleLog() {
        if (this.consoleSpy) {
            this.consoleSpy.mockRestore();
        }
    }
}

module.exports = MockEnvironment;