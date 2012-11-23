(function() {
  var board = {},
      BLOCK_SIZE = 100,
      CURSOR_SIZE = 20,
      cursor = [1, 0];

  board.keyPressed = function(code, event) {
    if (code == 119) {
      // W
      if (cursor[1] > 0) {
        cursor[1]--;
      }
    } else if (code == 97) {
      // A
      if (cursor[0] > 0 && !(cursor[0] == 1 && cursor[1] == 6)) {
        cursor[0]--;
      }
    } else if (code == 115) {
      // S
      if (cursor[1] < 6 && !(cursor[0] == 0 && cursor[1] == 5)) {
        cursor[1]++;
      }
    } else if (code == 100) {
      // D
      if (cursor[0] < 5) {
        cursor[0]++;
      }
    }
  };

  board.draw = function(offset_x, offset_y) {
    var x = offset_x + BLOCK_SIZE * cursor[0],
        y = offset_y + BLOCK_SIZE * cursor[1];

    if (cursor[0] > 0) {
      x += 10;
    }

    core.ctx.strokeStyle = 'rgb(255, 0, 255)';
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

  return board;
})();