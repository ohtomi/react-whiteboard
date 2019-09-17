const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'index.js',
        library: 'ReactWhiteboard',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom'
    },
    mode: 'production',
    devtool: 'source-map'
};
