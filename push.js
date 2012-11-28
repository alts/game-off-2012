(function(){
  var block = require('block.js'),
      push = Object.create(block);

  push.type = 'push';

  push.setFillStyle = function(){
    core.ctx.fillStyle = 'rgb(212, 0, 255)';
  };

  return push;
})();