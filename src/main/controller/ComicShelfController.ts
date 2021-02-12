import ipcHandle from '../util/ipcHandle';
import {
  addComic,
  addComicFolder,
  deleteComicByPath,
  getComic,
} from '@/main/service/comic-shelf-service';
import { readComic } from '../service';

/**
 * 从文件添加漫画
 */
ipcHandle('add-comic', async (mainEvent) => {
  return addComic(mainEvent);
});

ipcHandle('add-comic-folder', async (mainEvent) => {
  return await addComicFolder(mainEvent);
});

ipcHandle('get-store-comic', async () => {
  return getComic();
});

ipcHandle('read-comic', (e, comicPaths: string[], title = 'reader') => {
  readComic(comicPaths, title);
});

/**
 * 删除对应的漫画
 */
ipcHandle('comic-delete', async (ipcEvent, path) => {
  await deleteComicByPath(path);
});
