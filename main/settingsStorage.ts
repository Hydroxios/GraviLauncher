import fs from 'node:fs';
import path from 'path';
import { app } from 'electron';
import { Settings } from './types';

let settings: Settings | undefined;
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

export const loadSettings = () => {
    if (!fs.existsSync(settingsPath)) {
        settings = {
            instancesPath: './instances',
            memoryMin: '4',
            memoryMax: '8',
        };
        saveSettings();
    } else {
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }
    return settings
};

export const saveSettings = () => {
    if (settings) {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    }
};

export const getSettings = (): Settings | undefined => settings;

export const setInstancesPath = (instancesPath: string) => {
    if (settings) {
        settings.instancesPath = instancesPath;
        saveSettings();
    }
};

export const setMemory = (memoryMin: string, memoryMax: string) => {
    if (settings) {
        settings.memoryMin = memoryMin;
        settings.memoryMax = memoryMax;
        saveSettings();
    }
}; 