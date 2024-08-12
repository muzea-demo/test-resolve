const a1 = require("webpack-resolve-test-a-1");

module.exports = function version() {
  a1();
  console.log("from b1");
};
