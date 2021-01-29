import fs from 'fs';
import path from 'path';
import { isEmptyObject } from '@/util';

const configDirPath = path.resolve(__dirname + '/config');
const configPath = path.resolve(configDirPath + '/config.json');

const defaultWindowConfig = {
  width: 1920,
  height: 1080,
  x: 100,
  y: 100,
};

/**
 * 将JSON数据转为普通对象，当转换失败时，返回空对象
 * @param data JSON数据
 */
function parseFileDataToObj(data: Buffer) {
  const dataString = data.toString('utf8');
  let obj;
  if (dataString.length == 0) {
    obj = {};
  } else {
    try {
      obj = JSON.parse(data.toString('utf8'));
    } catch {
      obj = {};
    }
  }
  return obj;
}

/**
 * 获取配置文件
 */
function getConfig() {
  const data = fs.readFileSync(configPath);
  const config = parseFileDataToObj(data);
  return config;
}

function createConfigFile() {
  try {
    fs.mkdirSync(configDirPath);
    fs.writeFileSync(configPath, '{}', {});
  } catch {
    console.error('create file error');
  }
}

/**
 * 将窗口信息存储到文件
 * @param windowConfig  窗口信息
 */
function writeWindowConfigToFile(windowConfig: Electron.Rectangle) {
  fs.readFile(configPath, (err, data) => {
    if (err) {
      console.error('read config file failed');
      console.error(err);
      return;
    }
    const config = parseFileDataToObj(data);
    Object.assign(config, { window: windowConfig });
    fs.writeFile(configPath, JSON.stringify(config), {}, (saveError) => {
      console.error('save config error', saveError);
    });
  });
}

/**
 * 获取窗口信息
 * @param winName 要获取窗口信息的窗口名称
 */
function getWindowBounds(): Electron.Rectangle | string {
  try {
    if (fs.existsSync(configPath)) {
      const config = getConfig();
      if (isEmptyObject(config)) {
        Object.assign(config, { window: defaultWindowConfig });
        writeWindowConfigToFile(config);
      }
      if (isEmptyObject(config.window)) {
        config.window = defaultWindowConfig;
        writeWindowConfigToFile(config);
      }
      return config.window;
    } else {
      createConfigFile();
      writeWindowConfigToFile(defaultWindowConfig);
      return defaultWindowConfig;
    }
  } catch (err) {
    console.error('load config file error', err);
    return 'load config file error';
  }
}

/**
 * 存储用户的窗口信息
 * @param config 窗口信息
 */
function saveWindowBoundsConfig(windowConfig: Electron.Rectangle) {
  fs.access(configPath, (exists) => {
    if (exists) {
      createConfigFile();
      writeWindowConfigToFile(windowConfig);
    } else {
      writeWindowConfigToFile(windowConfig);
    }
  });
}

export { getWindowBounds, saveWindowBoundsConfig };
