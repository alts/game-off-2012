(function(){
  var block = require('block.js'),
      clone = Object.create(block);

  clone.type = 'clone';

  clone.setFillStyle = function(){
    core.ctx.fillStyle = 'rgb(0, 180, 128)';
  };

  return clone;
})();