'use strict';

const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    name: 'playground',
    
    context: path.resolve(__dirname, './'),

    mode: process.env.NODE_ENV || 'development',

    entry: {
        playground: [
            path.resolve(__dirname, './playground.js'),
        ],
    },

    output: {
        filename: './[name]-dist.js',
        path: path.resolve(__dirname),
    },

    watchOptions: {
        ignored: [
            path.resolve(__dirname, './node_modules'),
        ],
    },

    plugins: [
        new WebpackNotifierPlugin({
            title: 'tabwrap playground',
            emoji: true,
            alwaysNotify: true,
        }),
    ],

    module: {},

    resolve: {
        extensions: ['.js'],
        alias: {},
    },

    performance: {},

    node: {
        __filename: true,
    },

    optimization: {},

    stats: {},

    devtool: false,
};
