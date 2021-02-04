import { ComicDocType } from '@/store/rxdb';
import { ComicSource } from '.';

/**
 * 返回结构体
 */
interface Response<T> {
  code: number;
  message?: string;
  data?: T;
}

/**
 * 请求的Channel对应的返回值
 */
interface Channel {
  /**
   * 删除漫画
   */
  'comic-delete': void;
  /**
   * 保存宽度百分比
   */
  'reader/save-width': void;
  /**
   * 获取宽度百分比
   */
  'reader/get-width': number;

  'add-comic': ComicDocType | false;

  'add-comic-folder': ComicDocType | false;

  'get-store-comic': ComicSource[];

  'read-comic': void;

  'get-comic': string[];
}

export { Channel, Response };
