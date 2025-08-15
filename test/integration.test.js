const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cliPath = path.resolve(__dirname, '../bin/cli.js');
const tempDir = path.resolve(__dirname, 'temp-project');

describe('CLI Integration Tests', () => {
    beforeEach(() => {
        // Create a temporary directory structure for the test project
        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(path.join(tempDir, 'cases'), { recursive: true });
    });

    afterEach(() => {
        // Clean up the temporary directory
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    const setupProject = ({ config, solution, testCase } = {}) => {
        if (config) {
            fs.writeFileSync(path.join(tempDir, 'codingame-workspace.config.js'), config);
        }
        if (solution) {
            fs.writeFileSync(path.join(tempDir, 'solution.js'), solution);
        }
        if (testCase) {
            fs.writeFileSync(path.join(tempDir, 'cases/1.js'), testCase);
        }
    };

    it('should run successfully and pass the test case when solution is correct', () => {
        // Setup
        setupProject({
            config: "module.exports = { solution_main_file: 'solution.js', cases_folder: 'cases' };",
            solution: 'const n = readline(); console.log(parseInt(n) * 2);',
            testCase: "module.exports = { input: '10', expectedOutput: '20' };"
        });

        // Execute: If it throws, the test will fail automatically.
        const output = execSync(`node "${cliPath}"`, { cwd: tempDir, encoding: 'utf8' });

        // Assert
        expect(output).toContain('PASS');
        expect(output).toContain('should correctly solve the case: "1"');
        expect(output).toContain('Test Suites: 1 passed, 1 total');
        expect(output).toContain('Tests:       1 passed, 1 total');
    });

    it('should fail the test case and exit with a non-zero code when solution is incorrect', () => {
        // Setup
        setupProject({
            config: "module.exports = { solution_main_file: 'solution.js', cases_folder: 'cases' };",
            solution: 'const n = readline(); console.log(parseInt(n) * 3);', // Incorrect logic
            testCase: "module.exports = { input: '10', expectedOutput: '20' };"
        });

        // Execute and Assert
        try {
            execSync(`node "${cliPath}"`, { cwd: tempDir, encoding: 'utf8' });
            fail('CLI command should have failed but it succeeded.');
        } catch (error) {
            const output = error.stdout + error.stderr;
            expect(error.status).not.toBe(0);
            expect(output).toContain('FAIL');
            expect(output).toContain('should correctly solve the case: "1"');
            expect(output).toContain('Expected: "20"');
            expect(output).toContain('Received: "30"');
            expect(output).toContain('Test Suites: 1 failed, 1 total');
            expect(output).toContain('Tests:       1 failed, 1 total');
        }
    });

    it('should exit with an error if the configuration file is missing', () => {
        // Setup: No config file.
        setupProject({
            solution: 'const n = readline(); console.log(parseInt(n) * 2);',
            testCase: "module.exports = { input: '10', expectedOutput: '20' };"
        });

        // Execute and Assert
        try {
            execSync(`node "${cliPath}"`, { cwd: tempDir, encoding: 'utf8' });
            fail('CLI command should have failed but it succeeded.');
        } catch (error) {
            const output = error.stderr;
            expect(error.status).not.toBe(0);
            expect(output).toContain('Error: Configuration file not found!');
            expect(output).toContain('Please create a "codingame-workspace.config.js"');
        }
    });
});