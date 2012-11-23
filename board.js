(function() {
  var block = require('block.js');
  var push_block = require('push.js');
  var cursor = require('cursor.js');
  var board = {},
      BLOCK_SIZE = 100;
  var chute = require('chute.js');

  board.init = function(){
    this.blocks = [
      Object.create(block).init(0, 6),
      Object.create(block).init(1, 6),
      Object.create(block).init(3, 6),
      Object.create(block).init(4, 6)
    ];
    this.chute = Object.create(chute).init();
    this.cursor = Object.create(cursor).init();
    return this;
  };

  board.keyPressed = function(code, event) {
    this.cursor.keyPressed(code, event);
  };

  board.draw = function(offset_x, offset_y) {
    for (var i = 0, l = this.blocks.length; i < l; i++) {
      var block = this.blocks[i];
      this.blocks[i].draw(
        offset_x + 110 + block.gx * BLOCK_SIZE,
        offset_y + block.gy * BLOCK_SIZE
      );
    }

    this.chute.draw(offset_x, offset_y);

    this.cursor.draw(offset_x, offset_y);
  };

  board.update = function(dt){
    this.cursor.update(dt);
  };

  return board;
})();