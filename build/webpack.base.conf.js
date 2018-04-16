//定义了webpack的基础配置

var path = require('path')
var config = require('../config')
var utils = require('./utils')
//定义了当前项目的根目录，是当前文件的上一级
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
	//入口配置
	entry: {
		app: './src/main.js'
	},
	output: {
		//输出路径
		path: config.build.assetsRoot,
		//请求的静态资源的绝对路径
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
		//输出的文件名称
		filename: '[name].js'//所以我们页面加载的app.js的文件名就是这么得来的
	},
	//关于我们在代码中，通过require或者es6 import模块的一些相关配置
	resolve: {
		//可以在require或者import文件中自动补全后缀
		extensions: ['', '.js', '.vue'],//需要有一个默认空字符串，否在在require全名的时候反而会找不到

		//指向node_modules模块，当我们在前端require模块找不到的时候，就可以向node.js里面一样从node_modules里找
		fallback: [path.join(__dirname, '../node_modules')],
		//提供别名，require模块路径中，可以通过别名缩短整个路径的字符串长度
		alias: {
			'src': path.resolve(__dirname, '../src'),
			'common': path.resolve(__dirname, '../src/common'),
			'components': path.resolve(__dirname, '../src/components')
		}
	},
	//resolveLoader的fallback功能和resolve里的fallback功能是类似的
	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	//module配置包含preLoaders和Loaders两个配置。他们作用类似，都是对某种类型的文件应用某一个loader去做处理
	//其实webpack编译阶段，就是利用各种loader对各种文件做编译。它的原理就是扫描当前的工程目录，然后根据后缀名去匹配的不同的文件，文件内容作输入，对应的loader会对文件内容做一番处理，输出新的文件内容。
	//区别：preLoaders会在loader之前处理
	//include表示只对指定文件做编译，exclude表示排除文件
	module: {
		preLoaders: [
			{
				test: /\.vue$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			}
		],
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				include: projectRoot,
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.html$/,
				loader: 'vue-html'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url',
				query: {
					//当图片的文件大小小于10kb的时候，它会生成base64串，打包到编译后的js文件里；否则超过10kb的话，它就会单独生成一个文件，文件名规则是用 assetsPath方法。
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	eslint: {
		//当前eslint检查到错误的时候，会有好的提示一个错误信息，并提供一个es6规则的官网链接，可以去查看错误原因。
		formatter: require('eslint-friendly-formatter')
	},
	vue: {
		//关于vue文件中的一些css处理的loader
		loaders: utils.cssLoaders()
	}
}
