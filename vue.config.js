/* eslint-disable @typescript-eslint/no-var-requires */
const ThreadsPlugin = require('threads-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
/**@type {import('@vue/cli-service/types/ProjectOptions').ProjectOptions} */
const webConfig = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload/preload-main.ts',
      asar: false,
      builderOptions: {
        target: 'dir',
        win: {
          target: 'dir',
        },
        asarUnpack: ['0.worker.js'],
      },
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
        config.target('electron-main');
        config
          .plugin('thread')
          .use(ThreadsPlugin, [{ target: 'electron-node-worker' }]);
      },
    },
  },
  parallel: true,
  chainWebpack(config) {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap((options) =>
        Object.assign(options, {
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory(
                /** options */
                {
                  libraryName: 'ant-design-vue',
                  libraryDirectory: 'es',
                  style: 'css',
                }
              ),
            ],
          }),
        })
      );
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.ts',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '玥漫',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    reader: {
      entry: 'src/reader-main.ts',
      template: 'public/index.html',
      filename: 'reader.html',
      title: ' ',
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    // subpage: 'src/subpage/main.js',
  },
  css: {
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        javascriptEnabled: true,
      },
    },
  },
};
module.exports = webConfig;
