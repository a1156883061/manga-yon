import Store from 'electron-store';
import process from 'process';
import path from 'path';

const store = new Store({ cwd: path.resolve(process.execPath, '../config') });
export { store };
