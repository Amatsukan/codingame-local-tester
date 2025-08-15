#!/usr/bin/env node
/**
 * @file The main entry point for the command-line interface.
 */

const { run } = require('../src/index');
const { handleError } = require('../src/error-handler');

/**
 * Main function to run the CodinGame Local Tester.
 */
function main() {
    try {
        run();
    } catch (error) {
        handleError(error);
    }
}

main();