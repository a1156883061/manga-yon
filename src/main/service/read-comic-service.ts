import { ipcMain } from 'electron';
import createWindow from '../create-window';
import { IpcMsg } from '@/interface';

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
export function getComic(winId: number) {
  return comicPathMap.get(winId);
}
