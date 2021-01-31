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
}

export { Channel, Response };
