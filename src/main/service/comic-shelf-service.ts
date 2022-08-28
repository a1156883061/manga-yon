import { dialog, BrowserWindow, IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import isImage from '@/util/is-image';
import getParentDirName, { getDirName } from '@/util/get-dir-name';
import { ComicSource } from '@/interface';
import naturalSort from 'javascript-natural-sort';
import sortArrayByWorker from '@/util/sort-array-by-worker';
import { ComicDocType, comics as comicData } from '../../store/rxdb';
import { FILE_PROTOCOL } from '../regist-protocol';
import { MsgError } from '../util/MsgError';

const normalImageType: Electron.FileFilter = {
  extensions: ['jpg', 'jpeg', 'png'],
  name: '常规图片',
};

/** 7z支持的压缩文件类型 */
const archiveType: Electron.FileFilter = {
  name: '压缩文件',
  extensions: [
    '7z',
    'XZ',
    'BZIP2',
    'GZIP',
    'TAR',
    'ZIP',
    'WIM',
    'ARJ',
    'CAB',
    'CHM',
    'CPIO',
    'CramFS',
    'DEB',
    'DMG',
    'FAT',
    'HFS',
    'ISO',
    'LZH',
    'LZMA',
    'MBR',
    'MSI',
    'NSIS',
    'NTFS',
    'RAR',
    'RPM',
    'SquashFS',
    'UDF',
    'VHD',
    'WIM',
    'XAR',
    'Z',
  ],
};

function getImgInDir(
  dirPath: string,
  reject: (reason?: unknown) => void,
  resolve: (value: string[]) => void
) {
  return fs.readdir(dirPath, (readFilesErr, files) => {
    if (readFilesErr) {
      reject(readFilesErr);
    }
    if (files.length >= 50) {
      sortArrayByWorker(dirPath, files).then(resolve);
      return;
    }
    const resultPaths: string[] = [];
    files = files.sort(naturalSort);
    files.forEach((eachFile) => {
      if (isImage(eachFile)) {
        resultPaths.push(dirPath + path.sep + eachFile);
      }
    });
    resolve(resultPaths);
  });
}

/**
 * 获取图片文件
 * @param filePath 选择的文件
 * @returns 图片文件
 */
function getImgFilePaths(filePath: string[]) {
  if (filePath.length > 1) {
    return Promise.resolve(filePath);
  }
  const fileTmp = filePath[0];
  return new Promise<string[]>((resolve, reject) => {
    fs.stat(fileTmp, (err, state) => {
      if (err) {
        reject(err);
      }
      if (state.isDirectory()) {
        getImgInDir(fileTmp, reject, resolve);
        return;
      }
      // const parentDir = getParentDirName(fileTmp);
      const parentPath = path.dirname(fileTmp);
      if (parentPath == undefined) {
        reject('get parent directory filed');
        return;
      }
      getImgInDir(parentPath, reject, resolve);
    });
  });
}

/**
 * 从文件添加漫画
 * @param mainEvent 事件
 */
export async function addComic(mainEvent: IpcMainInvokeEvent) {
  // 打开文件选择对话框
  const returnValue = await dialog.showOpenDialog(
    BrowserWindow.fromId(mainEvent.frameId) as BrowserWindow,
    {
      filters: [normalImageType, archiveType],
      message: '请选择要导入的文件',
      title: '导入漫画',
      properties: ['openFile', 'multiSelections'],
    }
  );
  // 获取选中文件失败时返回false
  if (returnValue.canceled) {
    return false;
  }
  // 扩展名
  const extName = path.extname(returnValue.filePaths[0]);
  if (archiveType.extensions.includes(extName)) {
    return false;
  }
  const imgPaths = await getImgFilePaths(returnValue.filePaths);
  let title = getParentDirName(imgPaths[0]);
  if (title == undefined) {
    title = '未知';
  }
  const fileInfo: ComicSource = {
    path: imgPaths,
    coverPath: '',
    title: title,
  };
  // 添加safe-file前缀
  fileInfo.path = fileInfo.path.map((eachPath) => {
    eachPath = FILE_PROTOCOL + eachPath;
    return eachPath;
  });
  // 将数据添加到数据库
  const comic = await comicData;
  const comicDocument = await comic.insert({
    title: fileInfo.title,
    path: fileInfo.path,
  });
  return comicDocument.toJSON();
}

/**
 * 打开文件选择对话框，添加选择的文件夹
 * @param mainEvent 事件
 * @returns 选择的文件夹
 */
export async function addComicFolder(mainEvent: IpcMainInvokeEvent) {
  // 打开文件夹选择对话框
  const returnValue = await dialog.showOpenDialog(
    BrowserWindow.fromId(mainEvent.frameId) as BrowserWindow,
    {
      message: '请选择要导入的文件夹',
      title: '导入漫画',
      properties: ['openDirectory', 'multiSelections'],
    }
  );
  // 获取选中文件失败时抛出错误
  if (returnValue.canceled) {
    throw new MsgError('取消选择');
  }
  returnValue.filePaths.sort((a, b) => -naturalSort(a, b));
  // debugger;
  // 漫画文件夹
  const comicDirsPromise = returnValue.filePaths.map((file) => {
    const comicPathList = new Promise<string[]>((resolve, reject) => {
      getImgInDir(file, reject, resolve);
    });
    // const filterComicPath = comicPathList.filter(imgFile => imgFile)
    return new Promise<ComicSource>((resolve, reject) => {
      comicPathList
        .then(async (paths) => {
          // 没有图片，则返回false
          if (paths.length === 0) {
            reject(`${file}中不存在图片文件`);
            return;
          }
          const fileInfo: ComicSource = {
            path: paths,
            coverPath: '',
            title: getDirName(file),
          };
          // 添加safe-file前缀
          fileInfo.path = fileInfo.path.map((eachPath) => {
            eachPath = FILE_PROTOCOL + eachPath;
            return eachPath;
          });
          resolve(fileInfo);
        })
        .catch(() => reject(new MsgError('添加文件夹出错')));
    });
  });
  const settledComicDirs = await Promise.allSettled(comicDirsPromise);
  // 过滤没有图片的文件夹
  const filterComicDirs = ((settledComicDirs.filter(
    (eachDir) => eachDir.status === 'fulfilled'
  ) as unknown) as { status: 'fulfilled'; value: ComicSource }[]).map(
    (eachDir) => eachDir.value
  );
  const comic = await comicData;
  const ComicDirs = filterComicDirs.map((eachDir) => {
    // 插入数据
    const comicDocument = comic.insert({
      title: eachDir.title,
      path: eachDir.path,
    });
    return new Promise((resolve: (value: ComicDocType) => void) => {
      comicDocument.then((rxDocument) => {
        resolve(rxDocument.toJSON());
      });
    });
  });
  return await Promise.all(ComicDirs);
}

/**
 * 获取添加的漫画
 */
export function getComic(): Promise<ComicSource[]> {
  return new Promise<ComicSource[]>((resolve, reject) => {
    const comicInfos: ComicSource[] = [];
    comicData
      .then((comicDataCollection) => {
        comicDataCollection
          .find()
          .sort({ id: 'desc' })
          .exec()
          .then((comics) => {
            let comicInfo: ComicSource;
            comics.map((eachComic) => {
              comicInfo = (eachComic.toJSON() as unknown) as ComicSource;
              comicInfo.coverPath = comicInfo.path[0];
              comicInfos.push(comicInfo as ComicSource);
            });
            resolve(comicInfos);
          });
      })
      .catch(() => reject(new MsgError('get comic error')));
  });
}

/**
 * 删除对应的漫画
 * @param id 要删除漫画的id
 */
export async function deleteComicByPath(id: string) {
  if (id == undefined) {
    throw new MsgError('id错误');
  }
  const comicDao = await comicData;
  await comicDao
    .findOne()
    .where('id')
    .eq(id)
    .remove();
}
