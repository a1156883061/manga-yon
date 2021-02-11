import ipcHandle from '../util/ipcHandle';
import {
  addComic,
  addComicFolder,
  deleteComicByPath,
  getComic,
} from '@/main/service/comic-shelf-service';
import { readComic } from '../service';
import { ComicDocType } from '@/store/rxdb';

/**
 * 从文件添加漫画
 */
ipcHandle('add-comic', async (mainEvent) => {
  return addComic(mainEvent);
});

ipcHandle('add-comic-folder', async (mainEvent) => {
  const comicPathList = await addComicFolder(mainEvent);
  const comicList: ComicDocType[] = [];
  // comicPathList.forEach(async (file) => {
  //   comicList.push(await file);
  // });
  for (const iterator of comicPathList) {
    comicList.push(await iterator);
  }
  return comicList;
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
