module.exports = {
    entry: './index.js',
    output: {
        filename: 'demo.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production'
};
