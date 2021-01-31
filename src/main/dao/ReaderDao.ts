import { store } from '@/config/store';

/** 存储宽度的key值 */
const READER_WIDTH_KEY = 'readerWidth';

/** 默认宽度 */
const DEFAULT_READER_WIDTH = 0.9;

/**
 * 保存宽度百分比
 * @param width 宽度百分比
 */
export function setReaderWidth(width: number) {
  store.set(READER_WIDTH_KEY, width);
}

/**
 * 获取宽度百分比
 */
export function getReaderWidth(): number {
  let width = store.get(READER_WIDTH_KEY) as number;
  if (width == undefined) {
    setReaderWidth(DEFAULT_READER_WIDTH);
    width = DEFAULT_READER_WIDTH;
  }
  return width;
}
