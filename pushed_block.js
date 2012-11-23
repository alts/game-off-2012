(function(){
  var pushed_block = {},
      BLOCK_SIZE = 100,
      Y_VELOCITY = 5;

  pushed_block.init = function(block){
    this.block = block;
    this.y = 0;
    return this;
  };

  pushed_block.draw = function(offset_x, offset_y){
    this.block.draw(offset_x, offset_y);
  };

  pushed_block.update = function(dt){
    this.y -= Y_VELOCITY * dt;
  };

  return pushed_block;
})();