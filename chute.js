(function (){
  var push_block = require('push.js'),
      merge_block = require('merge.js'),
      clone_block = require('clone.js');

  var chute = {},
      BLOCK_SIZE = 100;

  var createBlock = function(){
    var test = Math.random(),
        proto = null;

    if (test < 0.25) {
      proto = push_block;
    } else if (test < 0.5) {
      proto = merge_block;
    } else if (test < 0.75) {
      proto = clone_block;
    } else {
      proto = push_block;
    }

    return Object.create(proto);
  };

  chute.init = function(){
    this.actions = [];
    for (var i = 0; i < 7; i++) {
      this.actions.push(createBlock());
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

    core.ctx.fillStyle = 'rgb(0, 0, 0)';
    core.ctx.beginPath();
    core.ctx.moveTo(offset_x, offset_y);
    core.ctx.lineTo(offset_x + BLOCK_SIZE, offset_y);
    core.ctx.lineTo(
      offset_x + BLOCK_SIZE,
      offset_y + 6 * BLOCK_SIZE
    );
    core.ctx.lineTo(
      offset_x + BLOCK_SIZE - 10,
      offset_y + 6 * BLOCK_SIZE
    );
    core.ctx.lineTo(
      offset_x + BLOCK_SIZE - 10,
      offset_y + 10
    );
    core.ctx.lineTo(offset_x + 10, offset_y + 10);
    core.ctx.lineTo(offset_x + 10, offset_y + 6 * BLOCK_SIZE);
    core.ctx.lineTo(offset_x, offset_y + 6 * BLOCK_SIZE);
    core.ctx.closePath();
    core.ctx.fill();

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
        this.actions.push(createBlock());
        this.ready = true;
      }
    }
  };

  chute.currentAction = function(){
    return this.actions[0].type;
  };

  return chute;
})();