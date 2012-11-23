(function() {
  var board = require('board.js');
  var block = require('block.js');
  push_block = require('push.js');
  var play_scene = {};

  play_scene.init = function() {
    this.blocks = [
      Object.create(block).init(0, 6),
      Object.create(block).init(1, 6),
      Object.create(block).init(3, 6),
      Object.create(push_block).init(4, 6)
    ];
  };

  play_scene.draw = function(offset_x, offset_y) {
    core.ctx.strokeStyle = '#000000';
    // player 1
    // chute
    core.ctx.strokeRect(10, 10, 100, 600);
    // board
    core.ctx.strokeRect(120, 10, 500, 700);

    // player 2
    // board
    core.ctx.strokeRect(650, 10, 500, 700);
    // chute
    core.ctx.strokeRect(1160, 10, 100, 600);

    for (var i = 0, l = this.blocks.length; i < l; i++) {
      this.blocks[i].draw(120, 10);
    }

    board.draw(10, 10);
  };

  play_scene.update = function(dt) {

  };

  play_scene.keyPressed = function(code, event) {
    board.keyPressed(code, event);
  };

  play_scene.init();
  return play_scene
})();