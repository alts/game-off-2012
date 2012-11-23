(function() {
  var block = require('block.js');
  var push_block = require('push.js');
  var cursor = require('cursor.js');
  var board = {},
      BLOCK_SIZE = 100;
  var chute = require('chute.js');

  board.init = function(){
    this.columns = [
      [Object.create(block)],
      [Object.create(block)],
      [],
      [Object.create(block)],
      [Object.create(block)]
    ];
    this.chute = Object.create(chute).init();
    this.cursor = Object.create(cursor).init();
    return this;
  };

  board.keyPressed = function(code, event) {
    if (code == 101) {
      if (this.columns[this.cursor.x - 1].length > 6 - this.cursor.y) {
        this.columns[this.cursor.x - 1][6 - this.cursor.y].push();
      }
    } else {
      this.cursor.keyPressed(code, event);
    }
  };

  board.draw = function(offset_x, offset_y) {
    core.ctx.save();
    core.ctx.beginPath();
    core.ctx.rect(
      offset_x + 110, offset_y,
      500, 700
    );
    core.ctx.clip();
    for (var i = 0, l = this.columns.length; i < l; i++) {
      var column = this.columns[i];
      for (var j = 0, ll = column.length; j < ll; j++) {
        column[j].draw(
          offset_x + 110 + i * BLOCK_SIZE,
          offset_y + (6 - j) * BLOCK_SIZE
        );
      }
    }

    core.ctx.restore();

    this.chute.draw(offset_x, offset_y);

    this.cursor.draw(offset_x, offset_y);
  };

  board.update = function(dt){
    this.cursor.update(dt);

    for (var i = 0, l = this.columns.length; i < l; i++) {
      var column = this.columns[i];
      for (var j = 0, ll = column.length; j < ll; j++) {
        column[j].update(dt);
      }
    }
  };

  return board;
})();