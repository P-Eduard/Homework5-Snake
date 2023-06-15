const path = require('path');

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
        filename: '[name]Bundle.js'
    },
    watch: true
}