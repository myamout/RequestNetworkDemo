var webpack = require('webpack');

module.exports = {
    entry: {
        bundle: ['babel-polyfill', './frontend_src/main']
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
};