var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
//webpack提供操作html的插件
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks

//把entry添加了一个./build/dev-client这个入口文件，这段代码其实在entry就变成了一个数组['./build/dev-client','./src/main.js']
//作用：启动了一些 hot-reload的相关代码，hot-reload是一种热加载的技术，hot-reload的作用是当我们改变了一些源码，在浏览器不用刷新的情况下，也能看到我们改变后的效果。但如果这个过程失败了，它就自动刷新浏览器
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

//通过webpack的merge方法把，baseWebpackConfig和当前的配置做一个合并
module.exports = merge(baseWebpackConfig, {
  module: {
    //对一些独立的css包括它的预处理文件做一个编译，因为webpack.base.conf.js里配置css是vue里的css
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  //开发时方便我们做源码调试用的
  devtool: '#eval-source-map',

  //定义了一堆插件
  plugins: [

    //把源码中的process.env字符串替换成 config.dev.env，可以做开发时和运行时的判断
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),

    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    //webpack优化相关的插件，根据打包后模块使用的频率，也经常被使用的模块分配一个最小的id
    new webpack.optimize.OccurenceOrderPlugin(),

    //hot reload热加载的一个插件
    new webpack.HotModuleReplacementPlugin(),

    //当我们编译出错的时候，会跳过那部分编译代码，使编译后运行时的包不会发生错误
    new webpack.NoErrorsPlugin(),


    // https://github.com/ampedandwired/html-webpack-plugin
    //通过filename指定编译后生成的html文件名，template指定我们要处理的模板。这里我们指定处理的模板是index.html最终生成的文件还是同名index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      //表示在线打包过程中，输出的一些js和css，它的路径会自动添加到上面配置的index.html文件里面，其中css默认添加到head标签里面，js默认添加到body里面。
      inject: true
    })
  ]
})
