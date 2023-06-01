const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  devServer: {
    static: path.resolve(__dirname, "./src"),
    compress: true,
    port: 9000,
  },
};
