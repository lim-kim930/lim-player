const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/test.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
        library: "LimPlayer",
        filename: "limplayer.min.js"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            // target: "es6",
                            // module: "commonjs"
                        }
                    }
                },
                
                exclude: /node-moudles/
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: "css-loader",
                    options: {
                        url: false
                    }
                },
                {
                    loader: "less-loader"
                }],
                exclude: /node-moudles/
            }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "limplayer.min.css"
        }),
        new CSSMinimizerPlugin()
    ],
    resolve: {
        extensions: [".ts", "..."],
    },
};