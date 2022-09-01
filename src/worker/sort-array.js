import naturalSort from 'javascript-natural-sort';
import path from 'path';
import isImage from '../util/is-image';

self.onmessage = (e) => {
  const dirName = e.data.dirName;
  let array = e.data.array;
  const resultPaths = [];
  array = array.sort(naturalSort);
  array.forEach((eachFile) => {
    if (isImage(eachFile)) {
      resultPaths.push(dirName + path.sep + eachFile);
    }
  });
  self.postMessage({ resultPaths });
};
