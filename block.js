(function(){
  var block = {},
      BLOCK_SIZE = 100,
      BLOCK_QUAD = 25;

  block.init = function(){
    return this;
  };

  block.setFillStyle = function(){
    core.ctx.fillStyle = "rgb(100, 0, 0)";
  };

  block.push = function(){
    this.dy = 0;
    this.vy = 1/1000;
    this.update = this.update_moving;
    this.draw = this.draw_moving;
  };

  block.update_moving = function(dt){
    this.dy -= this.vy * dt;
  };

  block.update_fixed = function(dt){
  };

  block.update = block.update_fixed;

  block.draw_moving = function(offset_x, offset_y){
    return this.draw_fixed(offset_x, offset_y + this.dy);
  };

  block.draw_fixed = function(offset_x, offset_y){
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

  block.draw = block.draw_fixed;

  return block;
})();