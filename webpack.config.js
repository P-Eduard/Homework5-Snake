const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = 
{
    mode: 'development',
    entry: 
    {
        index: './src/index.js',
        snake: './src/snake.js',
    },
    output: 
    {
        path: path.resolve(__dirname, 'public'),
        filename: '[name]Bundle.js',
        assetModuleFilename: '[name][ext]',
    },
    devServer: 
    {
        static:
        {
            directory: path.resolve(__dirname,'public')
        },
        port: 3000,
        open: false,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module:
    {
        rules: 
        [
            {
                test: /\.css$/,
                use:['style-loader','css-loader','sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ]
    },
    plugins:
    [
        new HtmlWebpackPlugin(
            {
                title: 'Snake',
                filename: 'index.html',
                template: 'src/index.html',
                favicon: './src/Images/snakeIcon.png',
            })
    ]
}