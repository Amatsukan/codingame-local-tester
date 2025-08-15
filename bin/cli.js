#!/usr/bin/env node
/**
 * @file The main entry point for the command-line interface.
 */

const { run } = require('../src/index');
const { handleError } = require('../src/error-handler');

/**
 * Main function to run the CodinGame Local Tester.
 */
async function main() {
    try {
        await run();
    } catch (error) {
        handleError(error);
    }
}

main();