(function(){
  var block = require('block.js');
  var gem = Object.create(block),
      BLOCK_SIZE = 100;

  gem.init = function(){
    Object.getPrototypeOf(gem).init.call(this);
    this.weight = 1;
    return this;
  };

  gem.push = function(){
    this.vy = -1.5;
    this.update = this.update_moving;
    this.draw = this.draw_moving;
  };

  gem.merge = function(other_block){
    this.weight += other_block.weight;
  };

  gem.draw_fixed = function(offset_x, offset_y){
    Object.getPrototypeOf(gem).draw_fixed.call(this, offset_x, offset_y);
    core.ctx.fillStyle = 'rgb(255, 255, 255)';
    core.ctx.font = '42px Helvetica';
    core.ctx.textAlign = 'center';
    core.ctx.fillText(
      this.weight,
      offset_x + BLOCK_SIZE / 2,
      offset_y + BLOCK_SIZE / 2 + 15
    );
  };

  gem.draw = gem.draw_fixed;

  return gem;
})();