var path = require('path')
var webpack = require('webpack')

// 简单创建 HTML 文件，用于服务器访问
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 打包清理文件目录
var CleanWebpackPlugin = require('clean-webpack-plugin')

//从 bundle 中提取文本（CSS）到单独的文件
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var cssExtract = new ExtractTextWebpackPlugin({
    filename: 'css/index.css',
    // disable: true
});
var lessExtract = new ExtractTextWebpackPlugin({
    filename: 'css/less.css',
    // disable: true // 不生效  用fallback
});


//  npm install purifycss-webpack purify-css glob -D
// 必须用到 htmlplugin 后面  
var PurifycssWebpack = require('purifycss-webpack')
var glob = require('glob');

module.exports = {
    // 入口
    entry: {
        app: './src/index.js',
        // 多入口
        a:'./src/a.js'
    },
    // 出口
    output: {
        // 出口路径
        path: path.resolve(__dirname, 'dist'),
        // 出口文件名
        filename: '[name].[hash:8].js'
    },
    // 开发服务器
    devServer: {
        contentBase: './dist',
        port: 3000,
        compress: true, //启动服务器压缩
        open: true, // 浏览器自动打开
        hot: true // 配合  new webpack.HotModuleReplacementPlugin()
    },
    // 模块配置
    module: {
        rules: [{
                test: /\.css$/,
                use: cssExtract.extract({
                    use: [{
                        loader: 'css-loader', //支持热更新 
                        options: {}
                    }],
                    // fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: lessExtract.extract({
                    use: [{
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ],
                    // fallback: 'style-loader'
                })
            }
        ]

    },
    // 插件配置
    plugins: [
        // css 抽离
        cssExtract,
        lessExtract,
        // if (module.hot) {
        //     console.log('accept2')
        //     module.hot.accept()
        // }
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['./dist']),
        //  多页面 配多入口 
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html', // ejs 模板
            title: 'webpack_go', //title
            // hash:true,
            minify: {
                // removeAttributeQuotes:true,
                // collapseWhitespace:true
            },
            chunks: ['app']
        }),
        //  多出口
        new HtmlWebpackPlugin({
            filename:'a.html',
            template:'./src/index.html',// ejs 模板
            title:'webpack_go', //title
            // hash:true,
            minify:{
                // removeAttributeQuotes:true,
                // collapseWhitespace:true
            },
            chunks:['a']
        }),

        // 没用得css  消除掉 
        new PurifycssWebpack({
            paths: glob.sync(path.resolve('src/*.html'))
        })
    ],
    //模式
    mode: 'development',
    // 配置解析
    resolve: {

    }
}