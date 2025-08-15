const MockEnvironment = require('../src/mock-environment');

describe('MockEnvironment', () => {
    let originalConsoleLog;

    beforeAll(() => {
        originalConsoleLog = console.log;
    });

    afterEach(() => {
        // Ensures global mocks are always restored.
        console.log = originalConsoleLog;
        delete global.readline;
    });

    it('should initialize with empty input if none is provided', () => {
        const mockEnv = new MockEnvironment();
        expect(mockEnv.testCaseInput).toBe('');
    });

    it('should mock global.readline to return lines from input', () => {
        const input = 'line 1\nline 2';
        const mockEnv = new MockEnvironment(input);
        mockEnv.mockReadline();

        expect(typeof global.readline).toBe('function');
        expect(global.readline()).toBe('line 1');
        expect(global.readline()).toBe('line 2');
    });

    it('should mock console.log and capture output', () => {
        const mockEnv = new MockEnvironment('');
        const capturedOutput = mockEnv.mockConsoleLog();

        console.log('hello');
        console.log(123);

        expect(capturedOutput).toEqual(['hello', '123']);
    });

    it('should restore the original console.log function', () => {
        const mockEnv = new MockEnvironment('');
        mockEnv.mockConsoleLog();
        expect(console.log).not.toBe(originalConsoleLog); // Confirms it was mocked.

        mockEnv.restoreConsoleLog();
        expect(console.log).toBe(originalConsoleLog); // Confirms it was restored.
    });

    it('should not throw an error if restore is called without mocking first', () => {
        const mockEnv = new MockEnvironment('');
        expect(() => mockEnv.restoreConsoleLog()).not.toThrow();
    });
});