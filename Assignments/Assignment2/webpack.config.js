const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    hw2: path.resolve(__dirname, "src", "Main.ts"),
    astlib: path.resolve(__dirname, "src", "Library", "AST.ts"),
    iolib: path.resolve(__dirname, "src", "Library", "IO.ts"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: {
      type: "var",
      name: "[name]",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
    ],
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          mangle: false,
          compress: {
            booleans: false,
            collapse_vars: false,
            conditionals: false,
            dead_code: false,
            evaluate: false,
            hoist_props: false,
            if_return: false,
            inline: false,
            join_vars: false,
            loops: false,
            reduce_funcs: false,
            reduce_vars: false,
            side_effects: false,
            switches: false,
            unused: false,
          },
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
