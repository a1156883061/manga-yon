import path from 'path';

/**
 * 获取文件所在文件夹的名称
 * @param filePath 文件路径
 */
function getParentDirName(filePath: string) {
  filePath = path.resolve(filePath);
  return path
    .dirname(filePath)
    .split(path.sep)
    .pop();
}

export default getParentDirName;
