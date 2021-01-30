import { protocol } from 'electron';
import path from 'path';

const PROTOCOL_NAME = 'safe-file';
const FILE_PROTOCOL = PROTOCOL_NAME + '://';
export function registerSafeFileProtocol() {
  protocol.registerFileProtocol(PROTOCOL_NAME, async (filePath, callback) => {
    const url = filePath.url.replace(FILE_PROTOCOL, '');
    try {
      return callback({ path: path.normalize(decodeURI(url)) });
    } catch (error) {
      console.error('load file error', error);
    }
  });
}

export { FILE_PROTOCOL };
