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
      [Object.create(block),Object.create(block)],
      [],
      [Object.create(block),Object.create(block),Object.create(block)],
      [Object.create(block)]
    ];
    this.pushed_blocks = [];
    this.chute = Object.create(chute).init();
    this.cursor = Object.create(cursor).init();
    return this;
  };

  board.takePushAction = function(){
    if (this.columns[this.cursor.x - 1].length > 6 - this.cursor.y) {
      var b = this.columns[this.cursor.x - 1].pop();
      b.gx = this.cursor.x - 1;
      b.gy = this.cursor.y;
      b.push();
      this.pushed_blocks.push(b);
      this.chute.spendAction();
    }
  };

  board.keyPressed = function(code, event) {
    // 'e' key pressed
    if (code == 101 && this.chute.ready) {
      var action = this.chute.currentAction();
      if (action === 'push') {
        this.takePushAction();
      }
    } else {
      this.cursor.keyPressed(code, event);
    }
  };

  board.draw = function(offset_x, offset_y) {
    // create a window around the gem board
    core.ctx.save();
    core.ctx.beginPath();
    core.ctx.rect(
      offset_x + 110, offset_y,
      500, 700
    );
    core.ctx.clip();

    // draw gems in play
    for (var i = 0, l = this.columns.length; i < l; i++) {
      var column = this.columns[i];
      for (var j = 0, ll = column.length; j < ll; j++) {
        column[j].draw(
          offset_x + 110 + i * BLOCK_SIZE,
          offset_y + (6 - j) * BLOCK_SIZE
        );
      }
    }

    // undo windowing
    core.ctx.restore();

    this.chute.draw(offset_x, offset_y);
    this.cursor.draw(offset_x, offset_y);

    // animating pushed blocks
    for (var i = 0, l = this.pushed_blocks.length; i < l; i++) {
      var b = this.pushed_blocks[i];
      b.draw(
        offset_x + 110 + b.gx * BLOCK_SIZE,
        offset_y + b.gy * BLOCK_SIZE
      );
    }

    var action = this.chute.currentAction();
    if (action === 'push') {
      this.drawPushHints(offset_x, offset_y);
    }
  };

  board.drawPushHints = function(offset_x, offset_y){
    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // draw unpushable gems
    for (var i = 0, l = this.columns.length; i < l; i++) {
      var height = this.columns[i].length;
      if (height > 1) {
        core.ctx.fillRect(
          offset_x + 110 + i * BLOCK_SIZE,
          offset_y + (8 - height) * BLOCK_SIZE,
          BLOCK_SIZE,
          (height - 1) * BLOCK_SIZE
        );
      }
    }
  };

  board.update = function(dt){
    this.cursor.update(dt);
    this.chute.update(dt);

    // update each block
    for (var i = 0, l = this.columns.length; i < l; i++) {
      var column = this.columns[i];
      for (var j = 0, ll = column.length; j < ll; j++) {
        column[j].update(dt);
      }
    }

    // determine which blocks have passed out of sight
    var expired_index = null;
    for (var i = 0, l = this.pushed_blocks.length; i < l; i++) {
      var b = this.pushed_blocks[i];
      b.update(dt);

      if (b.dy > -BLOCK_SIZE * 8) {
        break;
      }

      expired_index = i;
    }

    // clear all those beyond sight
    if (expired_index !== null) {
      this.pushed_blocks.splice(0, expired_index + 1);
    }
  };

  return board;
})();