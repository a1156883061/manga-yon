import { ipcMain } from 'electron';
import createWindow from '../create-window';
import { MsgError } from '../util/MsgError';

const comicPathMap = new Map<number, string[]>();

/**
 * 打开新窗口，阅读对应漫画
 * @param comicPaths 漫画路径
 * @param title 窗口类型和标题
 */
export function readComic(comicPaths: string[], title: string) {
  if (title == 'main') {
    title = 'main ';
  }
  createWindow(title, { comicPathMap, comicPaths });
}
export function readComicBack() {
  ipcMain.handle('read-comic', (e, comicPaths: string[], title: string) => {
    if (title == 'main') {
      title = 'main ';
    }
    createWindow(title, { comicPathMap, comicPaths });
  });
}

/**
 * 获取对应的漫画路径
 * @param winId 阅读器窗口的窗口ID
 */
export function getComicReader(winId: number) {
  const comicPaths = comicPathMap.get(winId);
  if (comicPaths) {
    return comicPaths;
  } else {
    throw new MsgError('comic not found');
  }
}
