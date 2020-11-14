import { protocol } from 'electron';
import path from 'path';

export function registerSafeFileProtocol() {
  protocol.registerFileProtocol('safe-file', async (filePath, callback) => {
    const url = filePath.url.replace('safe-file://', '');
    try {
      return callback({ path: path.normalize(decodeURI(url)) });
    } catch (error) {
      console.log('load file error', error);
    }
  });
}
