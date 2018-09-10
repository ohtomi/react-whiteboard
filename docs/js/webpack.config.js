const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname),
        filename: 'demo.js'
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
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production'
};
