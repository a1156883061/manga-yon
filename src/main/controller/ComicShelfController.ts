import ipcHandle from '../util/ipcHandle';
import { deleteComicByPath } from '@/main/service/comic-shelf-service';

/**
 * 删除对应的漫画
 */
ipcHandle('comic-delete', async (ipcEvent, path) => {
  await deleteComicByPath(path);
});
