(function(){
  var block = require('block.js'),
      push = Object.create(block);

  push.setFillStyle = function(){
    core.ctx.fillStyle = "rgb(128, 0, 255)";
  };

  return push;
})();