(function (){
  var push_block = require('push.js');
  var chute = {},
      BLOCK_SIZE = 100;

  chute.init = function(){
    this.actions = [];
    for (var i = 0; i < 7; i++) {
      this.actions.push(Object.create(push_block));
    }
    return this;
  };

  chute.draw = function(offset_x, offset_y){
    for (var i = 0, l = this.actions.length; i < l; i++) {
      this.actions[i].draw(offset_x, offset_y + i * BLOCK_SIZE);
    }

    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    core.ctx.fillRect(
      offset_x, offset_y,
      BLOCK_SIZE, 6 * BLOCK_SIZE
    );
  };

  return chute;
})();