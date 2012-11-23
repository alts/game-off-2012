(function(){
  var cursor = {},
      BLOCK_SIZE = 100,
      CURSOR_SIZE = 20;

  cursor.init = function(){
    this.x = 1;
    this.y = 0;
    this.t = 0;
    return this;
  };

  cursor.keyPressed = function(code, event){
    console.log(this);
    if (code == 119) {
      // W
      if (this.y > 0) {
        this.y--;
      }
    } else if (code == 97) {
      // A
      if (this.x > 0 && !(this.x == 1 && this.y == 6)) {
        this.x--;
      }
    } else if (code == 115) {
      // S
      if (this.y < 6 && !(this.x == 0 && this.y == 5)) {
        this.y++;
      }
    } else if (code == 100) {
      // D
      if (this.x < 5) {
        this.x++;
      }
    }
  };

  cursor.draw = function(offset_x, offset_y){
    var x = offset_x + BLOCK_SIZE * this.x,
        y = offset_y + BLOCK_SIZE * this.y;

    if (this.x > 0) {
      x += 10;
    }

    var color = [0, 0, 0];
    if (this.t < 20) {
      color[0] = 1;
      color[1] = this.t / 20;
    } else if (this.t < 40) {
      color[0] = 1 - (this.t - 20) / 20;
      color[1] = 1;
    } else if (this.t < 60) {
      color[1] = 1;
      color[2] = (this.t - 40) / 20;
    } else if (this.t < 80) {
      color[1] = 1 - (this.t - 60) / 20;
      color[2] = 1;
    } else if (this.t < 100) {
      color[0] = (this.t - 80) / 20;
      color[2] = 1;
    } else {
      color[0] = 1;
      color[2] = 1 - (this.t - 100) / 20;
    }

    color[0] = parseInt(color[0] * 255);
    color[1] = parseInt(color[1] * 255);
    color[2] = parseInt(color[2] * 255);

    core.ctx.strokeStyle = 'rgb(' + color.join(',') + ')';
    core.ctx.beginPath();
    core.ctx.moveTo(x + CURSOR_SIZE, y);
    core.ctx.lineTo(x, y);
    core.ctx.lineTo(x, y + CURSOR_SIZE);

    core.ctx.moveTo(x, y + BLOCK_SIZE - CURSOR_SIZE);
    core.ctx.lineTo(x, y + BLOCK_SIZE);
    core.ctx.lineTo(x + CURSOR_SIZE, y + BLOCK_SIZE);

    core.ctx.moveTo(x + BLOCK_SIZE - CURSOR_SIZE, y + BLOCK_SIZE);
    core.ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
    core.ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE - CURSOR_SIZE);

    core.ctx.moveTo(x + BLOCK_SIZE - CURSOR_SIZE, y);
    core.ctx.lineTo(x + BLOCK_SIZE, y);
    core.ctx.lineTo(x + BLOCK_SIZE, y + CURSOR_SIZE);

    core.ctx.stroke();
  };

  cursor.update = function(dt){
    // r -> r,g -> g -> g,b -> b -> b,r -> r
    this.t = (this.t + 1) % 120;
  };

  return cursor;
})();