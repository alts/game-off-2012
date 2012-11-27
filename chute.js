(function (){
  var push_block = require('push.js');
  var chute = {},
      BLOCK_SIZE = 100;

  chute.init = function(){
    this.actions = [];
    for (var i = 0; i < 7; i++) {
      this.actions.push(Object.create(push_block));
    }

    this.drop_offset = 0;
    this.ready = true;

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
        offset_y + (i - 1) * BLOCK_SIZE + this.drop_offset
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
    this.ready = false;
  };

  chute.update = function(dt){
    if (this.actions.length < 8) {
      // one block length in one half second
      this.drop_offset += BLOCK_SIZE * dt / 500
      if (this.drop_offset >= BLOCK_SIZE) {
        this.drop_offset = 0;
        this.actions.push(Object.create(push_block));
        this.ready = true;
      }
    }
  };

  chute.currentAction = function(){
    return this.actions[0].type;
  };

  return chute;
})();