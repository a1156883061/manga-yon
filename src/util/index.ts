import { screen } from 'electron';

function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0;
}

function verifyWindowBounds(bounds: Electron.Rectangle) {
  const screenInfo = screen.getAllDisplays()[0].bounds;
  if (bounds.x < 0) {
    bounds.x = 0;
  }
  if (bounds.y < 0) {
    bounds.y = 0;
  }
  if (bounds.height > screenInfo.height) {
    bounds.height = screenInfo.height - 50;
  }
  if (bounds.width > screenInfo.width) {
    bounds.width = screenInfo.width - 50;
  }
}

export { isEmptyObject, verifyWindowBounds };
