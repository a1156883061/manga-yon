import naturalSort from 'javascript-natural-sort';
import path from 'path';
import isImage from '../util/is-image';
import { expose } from 'threads';
expose({
  sortArray(dirPath: string, files: string[]) {
    const resultPaths: string[] = [];
    files = files.sort(naturalSort);
    files.forEach((eachFile) => {
      if (isImage(eachFile)) {
        resultPaths.push(dirPath + path.sep + eachFile);
      }
    });
    return resultPaths;
  },
});
