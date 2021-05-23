const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin } =require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')

//判断当前环境
const isDev = process.env.NODE_ENV ==='development'

//最先全配置为生产环境,只有当isDev为真时,修改配置为开发环境

const config={
  mode:'production',
  //入口文件
  entry: {
    app: path.resolve(__dirname, './src/main.js')
  },
  //出口
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, './dist/')
  },
  //插件 
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      title: 'webpack123'
    }),
    //每次打包自动清除dist文件下的文件
    new CleanWebpackPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions:['.js','.jsx']
  },
  //图片等其他资源需要用module引入,匹配规则,将其转为js,
  module: {
    rules: [
      { test: /.(png|jpg|gif)$/, use: 'file-loader' },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,  //排除node_modules中的包
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
        // use:['babel-loader']
      },
      //转换ts
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        // test: /\.css$/i,  解析css  将sass-loader删除即可
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', "sass-loader"],
        //顺序不能变 从后往前 ,先将scss编译成css , css解析,嵌入style中
      },
    
    ],
  },
  
}

//开发环境 添加本地服务
if(isDev){
  config.mode='development'
  config.devServer={
    contentBase: path.join(__dirname, 'public'),
    compress: true,   //压缩当前路径下的所有内容并提供一个本地服务
    open: true,
    port: 9080,
    hot: true, //热更新
    overlay:{
      errors:true
    }
  }
  config.plugins.push(
    new ESLintPlugin({})
  )
}

module.exports=config