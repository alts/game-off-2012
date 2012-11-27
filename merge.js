(function(){
  var block = require('block.js'),
      merge = Object.create(block);

  merge.type = 'merge';

  merge.setFillStyle = function(){
    core.ctx.fillStyle = 'rgb(255, 128, 0)';
  };

  return merge;
})();