import { ipcMain } from 'electron';
import createWindow from '../create-window';
import { IpcMsg } from '@/interface';

const comicPathMap = new Map<number, string[]>();
function readComic() {
  ipcMain.handle('read-comic', (e, comicPaths: string[], title: string) => {
    if (title == 'main') {
      title = 'main ';
    }
    createWindow(title, { comicPathMap, comicPaths });
  });
}

(function() {
  ipcMain.handle('get-comic', (e, winId: number) => {
    const returnData: IpcMsg = {
      code: 0,
      msg: 'success',
    };
    returnData.data = comicPathMap.get(winId);
    return returnData;
  });
})();

readComic();
