import { lookup } from 'mime';

function isImage(fileName: string) {
  const mimeType = lookup(fileName);
  if (mimeType == undefined) {
    return false;
  }
  if (mimeType.startsWith('image/')) {
    return true;
  }
}

export default isImage;
