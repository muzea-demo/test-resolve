/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction =
  process.argv[process.argv.indexOf("--mode") + 1] === "production";

const entryDefine = {
  main: {
    entry: "./src/main.js",
    template: "public/main.html",
  },
};

const cacheDirectory =
  process.env.BUILD_WEBPACK_CACHE || path.resolve(__dirname, ".cache");

module.exports = {
  devtool: isProduction ? false : "eval-source-map",
  entry: Object.keys(entryDefine).reduce((prev, item) => {
    prev[item] = entryDefine[item].entry;
    return prev;
  }, {}),
  output: {
    filename: "static/[name].[contenthash].js",
    path: path.resolve(__dirname, "build"),
    assetModuleFilename: "images/[hash][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            cacheDirectory: path.resolve(cacheDirectory, "swc-loader"),
            jsc: {
              parser: {
                syntax: "typescript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  useBuiltins: true,
                },
              },
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".wasm"],
  },
  plugins: [
    ...Object.keys(entryDefine).map((entryName) => {
      const option = {
        filename: entryName + ".html",
        chunks: [entryName],
      };
      if (entryDefine[entryName].template) {
        option.template = entryDefine[entryName].template;
      }
      return new HtmlWebpackPlugin(option);
    }),
  ],
};
