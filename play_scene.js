(function() {
  var board = require('board.js');
  var play_scene = {};

  play_scene.init = function() {
    this.board = Object.create(board).init();
    return this;
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

    this.board.draw(10, 10);
  };

  play_scene.update = function(dt) {
    this.board.update(dt);
  };

  play_scene.keyPressed = function(code, event) {
    this.board.keyPressed(code, event);
  };

  return play_scene.init();
})();