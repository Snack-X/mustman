var Split = require("split.js");
var T = require("./template");

window.addEventListener("load", function() {
  var third = 100 / 3;
  var split = Split([".pane-left", ".pane-middle", ".pane-right"], {
    sizes: [ third, third, third ],
    minSize: 150,
  });
});
