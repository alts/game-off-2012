(function(){
  var block = {},
      BLOCK_SIZE = 100;

  block.init = function(x, y){
    this.gx = x;
    this.gy = y;
    return this;
  };

  block.draw = function(offset_x, offset_y){
    core.ctx.fillStyle = "rgb(100, 0, 0)";
    core.ctx.fillRect(
      offset_x + this.gx * BLOCK_SIZE,
      offset_y + this.gy * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  };

  return block;
})();