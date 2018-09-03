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
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom'
    },
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    devtool: 'source-map'
};
