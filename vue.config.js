/*
 * @Author: 配置项
 * @Date: 2019-11-13 09:34:42
 * @LastEditTime: 2020-12-14 08:49:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tencent2\vue.config.js
 */
module.exports = {
  // 选项...
  //部署应用包时的基本 URL
  publicPath: "./",
  //生产环境构建文件的目录
  outputDir: "dist",
  //放置生成的静态资源的目录
  assetsDir: "assets",
  //输出路径
  indexPath: "index.html",
  //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存.
  filenameHashing: true,
  //在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。
  pages: undefined,
  //
  runtimeCompiler: true,
  //设置为 true 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
  lintOnSave: true,
  //是否使用包含运行时编译器的 Vue 构建版本。
  runtimeCompiler: false,
  //默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],
  //如果你不需要生产环境的 source map，可以将其设置为 false
  productionSourceMap: false,
  //设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  crossorigin: undefined,
  //webpack配置项
  //如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。如果这个值是一个函数，则会接收被解析的配置作为参数。
  configureWebpack: {
    externals: {
      Bmap: "Bmap",
      Bmap_Symbol_SHAPE_POINT: "Bmap_Symbol_SHAPE_POINT",
    },
  },
  //果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。
  integrity: false,
  //所有 webpack-dev-server 的选项都支持。

  devServer: {
    host: "0.0.0.0",
    port: 8080,
    // proxy: {
    //     '/api': {
    //         target: 'http://172.16.1.18:3005/', //接口域名
    //         changeOrigin: true,             //是否跨域
    //         ws: true,                       //是否代理 websockets
    //         secure: false,                   //是否https接口
    //         pathRewrite: {                  //路径重置
    //             '^/api': ''
    //         }
    //     }
    // },
    proxy: null,
    before: (app) => {},
  },

  // devServer: {
  //     disableHostCheck:true
  //     //代理服务器地址
  //   },
};
