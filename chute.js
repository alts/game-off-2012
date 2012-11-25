(function (){
  var push_block = require('push.js');
  var chute = {},
      BLOCK_SIZE = 100;

  chute.init = function(){
    this.actions = [];
    for (var i = 0; i < 8; i++) {
      this.actions.push(Object.create(push_block));
    }
    return this;
  };

  chute.draw = function(offset_x, offset_y){
    core.ctx.save();
    core.ctx.rect(
      offset_x, offset_y,
      BLOCK_SIZE, 700
    );
    core.ctx.clip();

    for (var i = 0, l = this.actions.length; i < l; i++) {
      this.actions[l - i - 1].draw(
        offset_x,
        offset_y + (i - 1) * BLOCK_SIZE
      );
    }

    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    core.ctx.fillRect(
      offset_x, offset_y,
      BLOCK_SIZE, 6 * BLOCK_SIZE
    );

    core.ctx.restore();
  };

  chute.spendAction = function(){
    this.actions.shift();
  };

  return chute;
})();