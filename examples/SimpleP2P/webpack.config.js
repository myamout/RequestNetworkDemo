var webpack = require('webpack');

module.exports = {
    entry: {
        main: ['babel-polyfill', './frontend_src/main'],
    },
    output: {
        filename: '[name]-bundle.js',
        path: __dirname + '/dist/js'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react', 'stage-2']
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    },
};
