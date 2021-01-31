import {
  setReaderWidth,
  getReaderWidth as getReaderWidthDao,
} from '../dao/ReaderDao';

/**
 * 保存阅读器的宽度
 * @param width 宽度百分比
 */
export function saveReaderWidth(width: number) {
  setReaderWidth(width);
}

/**
 * 获取宽度百分比
 */
export function getReaderWidth() {
  return getReaderWidthDao();
}
