const fs = require('fs');

// Read all data from stdin synchronously.
const input = fs.readFileSync(0, 'utf-8');
const lines = input.split('\n');
let currentLine = 0;

// Mock the global readline function to read from the stored lines.
global.readline = () => lines[currentLine++];