(function(){
  var block = require('block.js'),
      clone = Object.create(block);

  clone.type = 'clone';

  clone.setFillStyle = function(){
    core.ctx.fillStyle = 'rgb(42, 255, 0)';
  };

  return clone;
})();