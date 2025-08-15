#!/usr/bin/env node
/**
 * @file The main entry point for the command-line interface.
 */

const ConfigLoader = require('../src/config/ConfigLoader');
const { setupEnvironment } = require('../src/config/setupEnvironment');
const { handleError } = require('../src/errorHandler');
const { runTests } = require('../src/jest/runTests');

const configFileName = 'codingame-workspace.config.js';

/**
 * Main function to run the CodinGame Local Tester.
 */
function main() {
    try {
        const configLoader = new ConfigLoader(configFileName);
        const config = configLoader.load();
        setupEnvironment(config);
        runTests();
    } catch (error) {
        handleError(error);
    }
}

main();