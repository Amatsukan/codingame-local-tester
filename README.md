# CodinGame Local Tester

[![NPM Version](https://img.shields.io/npm/v/codingame-local-tester.svg)](https://www.npmjs.com/package/codingame-local-tester)

A command-line tool to test your CodinGame puzzle solutions locally. `codingame-local-tester` runs your JavaScript code against a set of test cases, simulating the platform's environment and providing instant feedback using Jest.

## Features

- **Test Locally**: Develop and test your solutions without needing to submit them to the CodinGame platform with every change.
- **Automated I/O Testing**: Defines test cases as simple JavaScript modules. The tool handles injecting input (`readline`) and capturing output (`console.log`).
- **Simple Configuration**: A single configuration file to point to your solution and your tests.
- **Fast Feedback**: Get clear pass/fail results from Jest for each test case.

## Installation

You can install the package in two ways:

### Globally (Recommended)
A global installation allows you to run the `codingame-local-tester` command in any folder.
```bash
npm install -g codingame-local-tester
```

### Locally
You can also install it as a development dependency in your project.
```bash
npm install --save-dev codingame-local-tester
```
In this case, you can run the tool via `npx codingame-local-tester` or by adding a script to your `package.json`.

## How to Use

The tool runs your solution script against multiple test case files. For each case, it will provide the input specified via readline() and compare your script's output (via console.log()) with the corresponding expectedOutput.

### 1. Structure Your Project

Create a folder for your puzzle with the following structure:

```
my-puzzle/
├── solution.js
├── test-cases/
│ ├── 1.js
│ └── 2.js
└── codingame-workspace.config.js
```

### 2. Write Your Solution (solution.js)

Write your code as you would on the CodinGame platform, using readline() to read the input and console.log() to print the output.

**Example: `solution.js`**
```javascript
// This code reads two lines of input,
// adds the numbers, and prints the result.
const n1 = parseInt(readline());
const n2 = parseInt(readline());

console.log(n1 + n2);
```

### 3. Create the Test Cases

Inside the test cases folder, create `.js` files. Each file represents a test case and **must export an object** containing the `input` and `expectedOutput` properties.

**Example: `test-cases/1.js`**
```javascript
const input = `10\n5`;
const expectedOutput = `15`;

module.exports = { input, expectedOutput };
```
> **Note**: Both `input` and `expectedOutput` must be strings. For multiple lines, use the newline character (`\n`).

### 4. Create the Configuration File

In the root of your project, create the file `codingame-workspace.config.js`. This file tells the tool where to find your solution and test cases.

**Example: `codingame-workspace.config.js`**
```javascript
module.exports = {
// Path to your main solution file
solution_main_file: 'solution.js',

// Path to the folder containing the test case files
cases_folder: 'test-cases'
};
```

### 5. Run the Tests

Open the terminal in the root folder of your project (`my-puzzle/`) and run the command:


If globally installed:
```bash
codingame-local-tester
```

If dev dependency installed:
```bash
npx codingame-local-tester
```

The tool will launch Jest, which will run each test case and display the results.

## Programmatic API

Besides the CLI, you can use `codingame-local-tester` programmatically.

```javascript
const tester = require('codingame-local-tester');

// The run function encapsulates the CLI's main logic.
// It automatically finds and uses 'codingame-workspace.config.js'.
try {
  tester.run();
} catch (error) {
  console.error('An error occurred:', error.message);
}
```

## License

This project is licensed under the ISC License.