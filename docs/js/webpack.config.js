module.exports = {
    entry: './index.js',
    output: {
        filename: 'demo.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};
