module.exports = {
  // 选项...\
  configureWebpack: {
    target: 'electron-renderer',
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
