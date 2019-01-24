# 一.安装

	1. 全局安装：npm install -g webpack

	2. 安装到你的项目目录：npm install --save-dev webpack


# 二.webpack使用

	1. 打包操作

		a. 直接命令式打包
			webpack {entry file/入口文件} {destination for bundled file/存放bundle.js的地方}
			如：webpack app/main.js public/bundle.js

		b. 配置脚本打包，在项目根目录创建名为webpack.config.js脚本文件
			i.在终端上执行命令webpack即可
			“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录

			module.exports = {
			  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
			  output: {
			    path: __dirname + "/public",//打包后的文件存放的地方
			    filename: "bundle.js"//打包后输出文件的文件名
			  }
			}

			ii.在package.json中进行配置，利用npm start进行打包亦可
			//npm的start是一个特殊的脚本名称
			//它的特殊性表现在，在命令行中使用npm start就可以执行相关命令
			//如果对应的此脚本名称不是start，想要在命令行中运行时，需要这样用npm run {script name}如npm run build
			{
			  "name": "webpack-sample-project",
			  "version": "1.0.0",
			  "description": "webpack project",
			  "scripts": {
			    "start": "webpack" //配置的地方，相当于把npm的start命令指向webpack命令
			  },
			  "author": "",
			  "license": "ISC",
			  "devDependencies": {
			    "webpack": "^3.4.1"
			  }
			}

	2. 打包后调试操作

		a. 通过简单的配置后，Webpack在打包时可以为我们生成的source maps
		  提供了一种对应编译文件和源文件的方法，使得编译后的代码可读性更高，也更容易调试
		  在webpack的配置文件中配置source maps，需要配置devtool，它有以下四种不同的配置选项，各具优缺点，描述如下：
			source-map
			在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包文件的构建速度；

			cheap-module-source-map
			在一个单独的文件中生成一个不带列映射的map，不带列映射提高项目构建速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；

			eval-source-map
			使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项；

			cheap-module-eval-source-map
			这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；

		b. 在小到中性的项目上，eval-source-map是一个很好的选项，不过记得只在开发阶段使用它，如下：

		  module.exports = {

		  	...,

		  	devtool: 'eval-source-map',//配置生成Source Maps
		  	...
		  }

	3. 搭建简易web服务器

		a. 安装基于node构建的web服务器模块：npm install --save-dev webpack-dev-server

			devserver作为webpack配置选项中的一项，具有以下配置选项：

				contentBase
				默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）

				port
				设置默认监听端口，如果省略，默认为”8080“

				inline
				设置为true，当源文件改变时会自动刷新页面

				colors
				设置为true，使终端输出的文件为彩色的

				historyApiFallback
				在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html

		b. 把这些命令加到webpack的配置文件中，现在的配置文件如下：
		module.exports = {

		  ...,

		  devServer: {
		    contentBase: "./public",//本地服务器所加载的页面所在的目录
		    colors: true,//终端中输出结果为彩色
		    historyApiFallback: true,//不跳转
		    inline: true//实时刷新
		  },

		  ...
		}

	4. loaders使用

		a. Loaders需要单独安装并且需要在webpack.config.js下的modules关键字下进行配置，如下几点：

			test：一个匹配loaders所处理的文件的拓展名的正则表达式（必须）

			loader：loader的名称（必须）

			include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；

			query：为loaders提供额外的设置选项（可选）

		b. 把Greeter.js里的问候消息放在一个单独的JSON文件里,并通过合适的配置使Greeter.js可以读取该JSON文件的值，配置如下：

			//安装可以装换JSON的loader
			npm install --save-dev json-loader

			module.exports = {

			  ...,

			  module: {//在配置文件里添加JSON loader
			    loaders: [
			      {
			        test: /\.json$/,
			        loader: "json"
			      }
			    ]
			  },

			  ...
			}

			创建带有问候信息的JSON文件(Greeter.json)

			//Greeter.json
			{
			  "greetText": "Hi there and greetings from JSON!"
			}

			更新后的Greeter.js

			var Greeter = require('./Greeter.json');

			module.exports = function() {
			  var greet = document.createElement('div');
			  greet.textContent = Greeter.greetText;
			  return greet;
			};

		c. babel的安装使用
			Babel其实是几个模块化的包，其核心功能位于称为babel-core的npm包中
			webpack把它们整合在一起使用
			但是对于每一个你需要的功能或拓展，你都需要安装单独的包
			用得最多的是解析Es6的babel-preset-es2015包和解析JSX的babel-preset-react包

			// npm一次性安装多个依赖模块，模块之间用空格隔开
			npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react

			module.exports = {

			  ....,

			  module: {
			    loaders: [

			      ...,

			      {
			        test: /\.js$/,
			        exclude: /node_modules/,
			        loader: 'babel',//在webpack的module部分的loaders里进行配置即可
			        query: {
			          presets: ['es2015','react']
			        }
			      }
			    ]
			  },

			  ....
			}



