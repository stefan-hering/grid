const webpack = require("webpack");
const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");
require("file-loader");

module.exports = {
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    entry: "./src/webui/webui.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist/webui")
    },
    
    // Add the loader for .ts files.
    module: {
        loaders: [
        {
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader"
        },
        { 
            test: /\.html/, 
            loader: "file-loader?name=[name].[ext]" 
        },
        {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }]
    },
    node: {
        fs: "empty"
    },
    watch : true,
    plugins: [
        new CheckerPlugin(),
      /*  new webpack.ProvidePlugin({
            "React": "react",
        }) */
    ]
};
