import { getReaderWidth, saveReaderWidth } from '../service/ReaderService';
import ipcHandle from '../util/ipcHandle';

ipcHandle('reader/save-width', (mainEvent, width: number) => {
  console.log('width', width);
  saveReaderWidth(width);
});

/**
 * 获取宽度百分比
 */
ipcHandle('reader/get-width', () => getReaderWidth());
