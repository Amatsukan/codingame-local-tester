/**
 * @file Main entry point for programmatic use.
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ConfigLoader = require('./config/ConfigLoader');
const { runTestCase } = require('./test-case-runner');
const ConfigError = require('./config/ConfigError');

/**
 * Runs the main logic of the tester.
 * @param {string} [configFileName='codingame-workspace.config.js'] - The name of the configuration file.
 * @returns {Promise<void>}
 */
async function run(configFileName = 'codingame-workspace.config.js') {
    const configLoader = new ConfigLoader(configFileName);
    const userConfig = configLoader.load();

    const configDir = path.dirname(configLoader.configPath);
    const absoluteConfig = {
        solution_main_file: path.resolve(configDir, userConfig.solution_main_file),
        cases_folder: path.resolve(configDir, userConfig.cases_folder),
    };

    // Validate paths
    if (!fs.existsSync(absoluteConfig.solution_main_file)) {
        throw new Error(`Solution file not found: ${absoluteConfig.solution_main_file}`);
    }
    if (!fs.existsSync(absoluteConfig.cases_folder)) {
        throw new Error(`Cases folder not found: ${absoluteConfig.cases_folder}`);
    }

    const testFiles = fs.readdirSync(absoluteConfig.cases_folder)
        .filter(file => file.endsWith('.js'))
        .sort(); // Sort for predictable order

    console.log(chalk.bold('Starting CodinGame Local Tester...\n'));
    let passed = 0;
    let failed = 0;

    for (const file of testFiles) {
        const testCasePath = path.join(absoluteConfig.cases_folder, file);
        const testCase = require(testCasePath);
        const testName = path.basename(file, '.js');

        const result = await runTestCase(absoluteConfig.solution_main_file, testCase);

        if (result.success) {
            console.log(`${chalk.green.bold('  ✓ PASS')} ${testName}`);
            passed++;
        } else {
            console.log(`${chalk.red.bold('  ✗ FAIL')} ${testName}`);
            if (result.error) {
                console.log(chalk.red(`    Error: ${result.error.message.split('\n')[0]}`));
            } else {
                console.log(chalk.red(`    Expected: "${result.expected}"`));
                console.log(chalk.red(`    Received: "${result.actual}"`));
            }
            failed++;
        }
    }

    console.log(`\nTests: ${chalk.green(`${passed} passed`)}, ${failed > 0 ? chalk.red(`${failed} failed, `) : ''}${testFiles.length} total.`);

    if (failed > 0) {
        // Exit with a non-zero code to indicate failure, useful for CI
        process.exit(1);
    }
}

module.exports = {
    run,
    ConfigLoader,
    runTestCase,
    ConfigError
};
