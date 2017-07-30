const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'index.js',
        library: 'ReactWhiteboard',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom'
    },
    devServer: {
        contentBase: path.resolve(__dirname + '/dist'),
        publicPath: '/',
        watchContentBase: true
    }
};
