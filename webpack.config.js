const path = require('path');
// plugins 才需要引入
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");

const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");

// 模块化配置
const entry = require('./webpack_config/entry_webpack.js');

const webpack = require('webpack');

const copyWebpackPlugin= require("copy-webpack-plugin");

// 图片路径问题
// publicPath：是在webpack.config.js文件的output选项中，主要作用就是处理静态文件路径的。
// 判断是否开发环境还是生产环境
if(process.env.type== "build"){
	var website ={
	    publicPath:"http://localhost:1717/"
	}
}else if(process.env.type== "dev"){
	var website ={
	    publicPath:"http://localhost:1717/"
	}
}else {
	var website ={
	    publicPath:"http://localhost:1717/"
	}
}

module.exports = {
	entry:entry.path,
	output:{
		path:path.resolve(__dirname,'dist'),
		// filename:'bundle.js'
		// 多文件输出
		// [name] 就是入口文件叫什么名字，输出就叫什么名字
		filename:'[name].js',
		publicPath:website.publicPath
	},
	// 我们安装好后，就可以使用这个loader了，记得在loader使用时不需要用require引入，在plugins才需要使用require引入。
	module:{
		rules:[
			{
			    test:/\.(jsx|js)$/,
			    use:{
			        loader:'babel-loader',
			    },
			    exclude:/node_modules/
			},
			{
				test:/\.css$/,
				use: [ 'style-loader','css-loader','postcss-loader']
			},
			{
				test:/\.(png|jpg|gif)/,
				 use:[{
                   loader:'url-loader',
                   options:{
                       limit:5000,
                       // 如何把图片放到指定的文件夹下
                       // 打包后的图片并没有放到images文件夹下，要放到images文件夹下
                       outputPath:'images/',
                   }
               }]
			},
			{
			    test: /\.(htm|html)$/i,
			    use:[ 'html-withimg-loader'] 
			},
			{
	            test: /\.less$/,
	            use: extractTextPlugin.extract({
	                use: [{
	                    loader: "css-loader"
	                }, {
	                    loader: "less-loader"
	                }],
	                // use style-loader in development
	                fallback: "style-loader"
	            })
			 }

		]
	},
	plugins:[
		new uglify(),
		new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
        }),
        new extractTextPlugin("/css/index.css"),
        new PurifyCSSPlugin({
        // Give paths to parse for rules. These should be absolute!
        paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.ProvidePlugin({
        	// 引入第三方库
        	$:"jquery"
        }),
        new webpack.BannerPlugin('作者:Bin'),
        // 抽离jquery
        new webpack.optimize.CommonsChunkPlugin({
		    //name对应入口文件中的名字，我们起的是jQuery
		    name:['jquery','vue'],
		    //把文件打包到哪里，是一个路径
		    filename:"assets/js/[name].js",
		    //最小打包的文件模块数，这里直接写2就好
		    minChunks:2
		}),
		new copyWebpackPlugin([{
	        from:__dirname+'/src/public',
	        to:'./public'
	    }])
	],
	devServer:{
		//设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717
	},
	devtool: 'eval-source-map',
	// 自动打包
	// 在命令行输入 webpack --watch
	watchOptions:{
		// 检测时间
		poll:10000,
		// 防止连续按键
		aggregateTimeout:500,
		// 不检查哪个文件
		ignored:/node_modules/,
	}
}