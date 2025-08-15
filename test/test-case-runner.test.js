const { runTestCase } = require('../src/test-case-runner');
const path = require('path');
const { fork } = require('child_process');
const { EventEmitter } = require('events');

// Mock the child_process.fork
jest.mock('child_process');

describe('TestCaseRunner', () => {
    let mockChildProcess;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup a mock child process that we can control
        mockChildProcess = new EventEmitter();
        mockChildProcess.stdout = new EventEmitter();
        mockChildProcess.stderr = new EventEmitter();
        mockChildProcess.stdin = {
            write: jest.fn(),
            end: jest.fn(),
        };

        fork.mockReturnValue(mockChildProcess);
    });

    it('should resolve with success when output matches', async () => {
        const solutionPath = '/path/to/solution.js';
        const testCase = { input: '10', expectedOutput: '20' };

        const promise = runTestCase(solutionPath, testCase);

        // Simulate child process behavior
        mockChildProcess.stdout.emit('data', '20');
        mockChildProcess.emit('close', 0);

        const result = await promise;

        expect(fork).toHaveBeenCalledWith(solutionPath, [], expect.any(Object));
        expect(mockChildProcess.stdin.write).toHaveBeenCalledWith('10');
        expect(result).toEqual({
            success: true,
            actual: '20',
            expected: '20',
        });
    });

    it('should resolve with failure when output does not match', async () => {
        const solutionPath = '/path/to/solution.js';
        const testCase = { input: '10', expectedOutput: '20' };

        const promise = runTestCase(solutionPath, testCase);

        // Simulate child process behavior
        mockChildProcess.stdout.emit('data', '30');
        mockChildProcess.emit('close', 0);

        const result = await promise;

        expect(result).toEqual({
            success: false,
            actual: '30',
            expected: '20',
        });
    });

    it('should handle multi-line output correctly', async () => {
        const solutionPath = '/path/to/solution.js';
        const testCase = { input: 'a\nb', expectedOutput: 'line1\nline2' };

        const promise = runTestCase(solutionPath, testCase);

        // Simulate child process behavior
        mockChildProcess.stdout.emit('data', 'line1\n');
        mockChildProcess.stdout.emit('data', 'line2');
        mockChildProcess.emit('close', 0);

        const result = await promise;

        expect(result).toEqual({
            success: true,
            actual: 'line1\nline2',
            expected: 'line1\nline2',
        });
    });

    it('should resolve with failure on process error', async () => {
        const solutionPath = '/path/to/solution.js';
        const testCase = { input: '10', expectedOutput: '20' };
        const error = new Error('Spawn error');

        const promise = runTestCase(solutionPath, testCase);

        // Simulate child process error
        mockChildProcess.emit('error', error);

        const result = await promise;

        expect(result.success).toBe(false);
        expect(result.error).toBe(error);
    });

    it('should resolve with failure when process exits with non-zero code', async () => {
        const solutionPath = '/path/to/solution.js';
        const testCase = { input: '10', expectedOutput: '20' };

        const promise = runTestCase(solutionPath, testCase);

        // Simulate child process behavior
        mockChildProcess.stderr.emit('data', 'Something went wrong');
        mockChildProcess.emit('close', 1);

        const result = await promise;

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toContain('Process exited with code 1');
        expect(result.error.message).toContain('Something went wrong');
    });
});