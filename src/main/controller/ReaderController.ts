import { getComic } from '../service/read-comic-service';
import { getReaderWidth, saveReaderWidth } from '../service/ReaderService';
import ipcHandle from '../util/ipcHandle';

ipcHandle('get-comic', (e, winId: number) => {
  return getComic(winId);
});

ipcHandle('reader/save-width', (mainEvent, width: number) => {
  console.log('width', width);
  saveReaderWidth(width);
});

/**
 * 获取宽度百分比
 */
ipcHandle('reader/get-width', () => getReaderWidth());
