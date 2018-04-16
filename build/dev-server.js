//path是node.js提供的一个api，表示提供文件路径操作的一些方法。
var path = require('path')
//express是node.js的一个框架，这里用express启动一个web server 
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
	? require('./webpack.prod.conf')
	: require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
//定义端口号，可以从环境变量process.env.PORT里去取，也可以通过config.dev.port取
var port = process.env.PORT || config.dev.port

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
//从proxyTable里拿到一些需要去代理的接口（根据业务所需，哪些接口需要去转发，就去配置）
var proxyTable = config.dev.proxyTable

//通过启动一个express，拿到app对象
var app = express()

//接着调用webpack方法去编译，把webpackConfig传入，得到compiler，是给webpack-dev-middleware中间件用
var compiler = webpack(webpackConfig)

//express专门为webpack开发的一个中间件
//我们虽然localhost:8080页面，请求了app.js，但是当前目录下并没有app.js。那是因为这个中间件做了一些功能，他就是把编译好的文件，实际上放在内存里面，我们刚才的localhost:8080访问实际上都是对内存的访问，这是一个非常强大的功能。
var devMiddleware = require('webpack-dev-middleware')(compiler, {
	//这个中间件指定了 静态资源的访问目录（index.html里面的src=app.js）
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	}
})



//是express和webpack的hot-reload的插件做配合的一个中间件。
var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({action: 'reload'})
		cb()
	})
})

// proxy api requests
//对代理做转发的一些操作。使用proxyMiddleware中间件
Object.keys(proxyTable).forEach(function (context) {
	var options = proxyTable[context]
	if (typeof options === 'string') {
		options = {target: options}
	}
	app.use(proxyMiddleware(context, options))
})


//使用前面的中间件
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
//当你访问到/static的时候，它实际上从当前的static目录里取，也就是配置一个静态资源的访问路径。我们可以在chrome里的source看到。
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

//启动这个express，启动这个server，然后去监听这个8080端口，然后我们就可以通过localhost:8080访问到这个页面。
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
})
