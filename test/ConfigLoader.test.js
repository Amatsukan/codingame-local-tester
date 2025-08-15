const fs = require('fs');
const path = require('path');
const ConfigLoader = require('../src/config/ConfigLoader');
const ConfigError = require('../src/config/ConfigError');

jest.mock('fs');

const configFileName = 'codingame-workspace.config.js';
const configPath = path.join(process.cwd(), configFileName);

describe('ConfigLoader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load and return the configuration if the file exists', () => {
        const fakeConfig = { solution_main_file: 'a.js' };
        fs.existsSync.mockReturnValue(true);
        // Mock the require call for the config file
        jest.doMock(configPath, () => fakeConfig, { virtual: true });

        const loader = new ConfigLoader(configFileName);
        const loadedConfig = loader.load();

        expect(fs.existsSync).toHaveBeenCalledWith(configPath);
        expect(loadedConfig).toEqual(fakeConfig);
    });

    it('should throw a ConfigError if the configuration file does not exist', () => {
        fs.existsSync.mockReturnValue(false);

        const loader = new ConfigLoader(configFileName);

        expect(() => loader.load()).toThrow(ConfigError);
        expect(() => loader.load()).toThrow(
            `Configuration file not found! Please create a "${configFileName}" in the root of your project.`
        );
    });
});