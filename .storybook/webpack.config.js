module.exports = {
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    }
};
