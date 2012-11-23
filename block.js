(function(){
  var pushed_block = require('pushed_block.js');
  var block = {},
      BLOCK_SIZE = 100,
      BLOCK_QUAD = 25;

  block.init = function(x, y){
    this.gx = x;
    this.gy = y;
    return this;
  };

  block.setFillStyle = function(){
    core.ctx.fillStyle = "rgb(100, 0, 0)";
  };

  block.push = function(){
    var new_block = Object.create(pushed_block).init(this);
    return new_block;
  };

  block.draw = function(offset_x, offset_y){
    var start_x = offset_x,
        start_y = offset_y;

    this.setFillStyle();
    core.ctx.fillRect(
      start_x,
      start_y,
      BLOCK_SIZE,
      BLOCK_SIZE
    );

    core.ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    core.ctx.beginPath();
    core.ctx.moveTo(start_x, start_y);
    core.ctx.lineTo(start_x + BLOCK_SIZE, start_y);
    core.ctx.lineTo(start_x + BLOCK_QUAD * 3, start_y + BLOCK_QUAD);
    core.ctx.lineTo(start_x + BLOCK_QUAD, start_y + BLOCK_QUAD);
    core.ctx.closePath();
    core.ctx.fill();

    core.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    core.ctx.beginPath();
    core.ctx.moveTo(start_x, start_y);
    core.ctx.lineTo(start_x + BLOCK_QUAD, start_y + BLOCK_QUAD);
    core.ctx.lineTo(start_x + BLOCK_QUAD, start_y + BLOCK_QUAD * 3);
    core.ctx.lineTo(start_x, start_y + BLOCK_SIZE);
    core.ctx.closePath();
    core.ctx.fill();

    core.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    core.ctx.beginPath();
    core.ctx.moveTo(start_x + BLOCK_SIZE, start_y);
    core.ctx.lineTo(start_x + BLOCK_QUAD * 3, start_y + BLOCK_QUAD);
    core.ctx.lineTo(start_x + BLOCK_QUAD * 3, start_y + BLOCK_QUAD * 3);
    core.ctx.lineTo(start_x + BLOCK_SIZE, start_y + BLOCK_SIZE);
    core.ctx.closePath();
    core.ctx.fill();

    core.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    core.ctx.beginPath();
    core.ctx.moveTo(start_x, start_y + BLOCK_SIZE);
    core.ctx.lineTo(start_x + BLOCK_SIZE, start_y + BLOCK_SIZE);
    core.ctx.lineTo(start_x + BLOCK_QUAD * 3, start_y + BLOCK_QUAD * 3);
    core.ctx.lineTo(start_x + BLOCK_QUAD, start_y + BLOCK_QUAD * 3);
    core.ctx.closePath();
    core.ctx.fill();

    core.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    core.ctx.strokeRect(
      start_x,
      start_y,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  };

  return block;
})();