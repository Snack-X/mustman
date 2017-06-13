const path = require("path");

module.exports = {
  entry: "./src/staticApp.js",
  output: {
    path: path.join(__dirname, "static"),
    filename: "app.js",
  },
};
