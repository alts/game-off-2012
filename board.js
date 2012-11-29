(function() {
  var gem = require('gem.js');
  var push_block = require('push.js');
  var cursor = require('cursor.js');
  var board = {},
      BLOCK_SIZE = 100;
  var chute = require('chute.js');

  board.init = function(){
    this.columns = [
      [Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init()],
      [Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init()],
      [Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init()],
      [Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init()],
      [Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init(),Object.create(gem).init()]
    ];
    this.pushed_blocks = [];
    this.chute = Object.create(chute).init();
    this.cursor = Object.create(cursor).init();

    this.rememberCursor = null;
    return this;
  };

  // UNDO
  board.undoMerge = function(){
    this.rememberCursor = null;
    this.drawMergeHints = this.drawMergeHintsStage1;
    this.keyPressed = this.baseKeyPressed;
    this.undo = this.baseUndo;
  };

  board.undoClone = function(){
    this.rememberCursor = null;
    this.drawCloneHints = this.drawCloneHintsStage1;
    this.keyPressed = this.baseKeyPressed;
    this.undo = this.baseUndo;
  };

  board.baseUndo = function(){};
  board.undo = board.baseUndo;

  // ACTIONS
  board.takePushAction = function(){
    var cursor = this.cursor;
    if (this.columns[cursor.x - 1].length === 7 - cursor.y) {
      var b = this.columns[cursor.x - 1].pop();
      b.gx = cursor.x - 1;
      b.gy = cursor.y;
      b.push();
      this.pushed_blocks.push(b);
      this.chute.spendAction();
    }
  };


  board.takeCloneAction1 = function(){
    var cursor = this.cursor,
        column = this.columns[cursor.x - 1];

    // currently does not handle cloning in the chute
    var valid_click = cursor.y > 1 &&
        ((column.length < 5 && column.length > 6 - cursor.y) ||
        (cursor.x > 1 && this.columns[cursor.x - 2].length === 6 - cursor.y) ||
        (cursor.x < 5 && this.columns[cursor.x].length === 6 - cursor.y));

    if (valid_click) {
      console.log('yes');
      this.rememberCursor = [cursor.x, cursor.y];
      this.drawCloneHints = this.drawCloneHintsStage2;
      this.keyPressed = this.cloneKeyPressed;
      this.undo = this.undoClone;
    }
  };


  board.takeMergeAction1 = function(){
    var cursor = this.cursor;
    var valid_click = cursor.x > 0 &&
        this.columns[cursor.x - 1].length > 6 - cursor.y &&
        !this.isColumnUnmergeable(cursor.x - 1);

    if (valid_click){
      this.rememberCursor = [this.cursor.x, this.cursor.y];
      this.drawMergeHints = this.drawMergeHintsStage2;
      this.keyPressed = this.mergeKeyPressed;
      this.undo = this.undoMerge;
    }
  };

  board.takeMergeAction2 = function(){
    var cursor = this.cursor,
        old_x = this.rememberCursor[0],
        old_y = this.rememberCursor[1];

    var valid_click = cursor.x > 0 &&
        1 == Math.abs(cursor.x - old_x) + Math.abs(cursor.y - old_y) &&
        (6 - cursor.y) < this.columns[cursor.x - 1].length;

    if (valid_click) {
      this.columns[cursor.x - 1][6 - cursor.y].merge(
        this.columns[old_x - 1][6 - old_y]
      );
      this.columns[old_x - 1].splice(6 - old_y, 1);


      this.rememberCursor = null;
      this.drawMergeHints = this.drawMergeHintsStage1;
      this.keyPressed = this.baseKeyPressed;
      this.undo = this.baseUndo;
      this.chute.spendAction();
    };
  };


  // KEYPRESSED
  // for second half of merge operation
  board.mergeKeyPressed = function(code, event) {
    if (code == 101) {
      this.takeMergeAction2();
    } else {
      this.cursor.keyPressed(code, event);
    }
  }

  board.baseKeyPressed = function(code, event) {
    // 'e' key pressed
    if (code == 101 && this.chute.ready) {
      var action = this.chute.currentAction();
      if (action === 'push') {
        this.takePushAction();
      } else if (action === 'merge') {
        this.takeMergeAction1();
      } else if (action === 'clone') {
        this.takeCloneAction1();
      }
    } else {
      this.cursor.keyPressed(code, event);
    }
  };

  board.keyPressed = board.baseKeyPressed;


  // DRAW
  board.draw = function(offset_x, offset_y) {
    // create a window around the gem board
    core.ctx.save();
    core.ctx.beginPath();
    core.ctx.rect(
      offset_x + 110, offset_y,
      500, 700
    );
    core.ctx.clip();

    // draw danger line
    core.ctx.beginPath();
    var line_y = offset_y + 2 * BLOCK_SIZE,
        line_x = offset_x + 110,
        x_limit = offset_x + 100 + 5 * BLOCK_SIZE;

    core.ctx.strokeStyle = 'rgb(0, 0, 0)';
    core.ctx.moveTo(line_x, line_y);
    line_x += 15;
    core.ctx.lineTo(line_x, line_y);
    while (line_x < x_limit) {
      line_x += 20;
      core.ctx.moveTo(line_x, line_y);
      line_x += 30;
      core.ctx.lineTo(line_x, line_y);
    }
    core.ctx.stroke();

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

    if (this.chute.ready) {
      var action = this.chute.currentAction();
      if (action === 'push') {
        this.drawPushHints(offset_x, offset_y);
      } else if (action === 'merge') {
        this.drawMergeHints(offset_x, offset_y);
      } else if (action === 'clone') {
        this.drawCloneHints(offset_x, offset_y);
      }
    }
  };

  board.drawPushHints = function(offset_x, offset_y){
    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // tint unpushable gems
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

    // chute cannot be pushed
    core.ctx.fillRect(
      offset_x, offset_y,
      BLOCK_SIZE, 6 * BLOCK_SIZE
    );
  };


  board.drawCloneHintsStage1 = function(offset_x, offset_y){
    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    // tint uncloneable gems
    for (var i = 0, l = this.columns.length; i < l; i++){
      var height = this.columns[i].length;
      if (height >= 5) {
        var left_distance = i == 0 && 5 || this.columns[i - 1].length,
            right_distance = i == l -1 && 5 || this.columns[i + 1].length,
            min_distance = Math.min(left_distance, right_distance),
            max_distance = Math.max(left_distance, right_distance);

        if (min_distance > 0) {
          core.ctx.fillRect(
            offset_x + 110 + i * BLOCK_SIZE,
            offset_y + (7 - min_distance) * BLOCK_SIZE,
            BLOCK_SIZE,
            min_distance * BLOCK_SIZE
          );
        }

        if (min_distance < max_distance - 1) {
          core.ctx.fillRect(
            offset_x + 110 + i * BLOCK_SIZE,
            offset_y + (7 - max_distance) * BLOCK_SIZE,
            BLOCK_SIZE,
            (max_distance - min_distance - 1) * BLOCK_SIZE
          );
        }

        if (max_distance < height - 1) {
          core.ctx.fillRect(
            offset_x + 110 + i * BLOCK_SIZE,
            offset_y + (7 - height) * BLOCK_SIZE,
            BLOCK_SIZE,
            (height - max_distance - 1) * BLOCK_SIZE
          );
        }
      }
    }
  };


  board.drawCloneHintsStage2 = function(offset_x, offset_y){
    var cursor_x = this.rememberCursor[0],
        cursor_y = this.rememberCursor[1];

    for (var i = 0, l = this.columns.length; i < l; i++){
      var size = this.columns[i].length;
      if (i === cursor_x - 1) {
        core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // same column as selected
        if (size >= 5) {
          // column is full
          core.ctx.fillRect(
            offset_x + 110 + i * BLOCK_SIZE,
            offset_y + (7 - size) * BLOCK_SIZE,
            BLOCK_SIZE,
            size * BLOCK_SIZE
          );
        } else {
          // column has space
          if (7 - cursor_y === size) {
            // selected tip
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (8 - size) * BLOCK_SIZE,
              BLOCK_SIZE,
              (size - 1) * BLOCK_SIZE
            );
          } else {
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (7 - size) * BLOCK_SIZE,
              BLOCK_SIZE,
              (size - 7 + cursor_y) * BLOCK_SIZE
            );
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (cursor_y + 1) * BLOCK_SIZE,
              BLOCK_SIZE,
              (7 - cursor_y) * BLOCK_SIZE
            );
          }
        }
      } else if (Math.abs(i - cursor_x + 1) === 1) {
        // neightbor column
        if (size == 6 - cursor_y) {
          // neighbor is open
          core.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          core.ctx.fillRect(
            offset_x + 110 + i * BLOCK_SIZE,
            offset_y + (6 - size) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
        core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        core.ctx.fillRect(
          offset_x + 110 + i * BLOCK_SIZE,
          offset_y + (7 - size) * BLOCK_SIZE,
          BLOCK_SIZE,
          size * BLOCK_SIZE
        );
      } else {
        core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        core.ctx.fillRect(
          offset_x + 110 + i * BLOCK_SIZE,
          offset_y + (7 - size) * BLOCK_SIZE,
          BLOCK_SIZE,
          size * BLOCK_SIZE
        );
      }
    }
  };


  board.drawCloneHints = board.drawCloneHintsStage1;


  board.drawMergeHintsStage1 = function(offset_x, offset_y){
    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    var columns = this.columns,
        max_columns = this.columns.length,
        last_empty = -1;

    for (var i = 0, l = this.columns.length; i < l; i++) {
      if (this.isColumnUnmergeable(i)) {
        core.ctx.fillRect(
          offset_x + 110 + i * BLOCK_SIZE,
          offset_y + 6 * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }

    // chute cannot be merged
    core.ctx.fillRect(
      offset_x, offset_y,
      BLOCK_SIZE, 6 * BLOCK_SIZE
    );
  };

  board.drawMergeHintsStage2 = function(offset_x, offset_y){
    core.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    var cursor_x = this.rememberCursor[0],
        cursor_y = this.rememberCursor[1];

    for (var i = 0, l = this.columns.length; i < l; i++) {
      var column = this.columns[i];

      if (column.length > 0) {
        if (i < cursor_x - 2 || i > cursor_x) {
          // columns entirely inaccessible
          core.ctx.fillRect(
            offset_x + 110 + i * BLOCK_SIZE,
            offset_y + (7 - column.length) * BLOCK_SIZE,
            BLOCK_SIZE,
            column.length * BLOCK_SIZE
          );

        } else if (i === cursor_x - 1) {
          // column of the cursor

          // start filling two below cursor mark
          if (2 < 7 - cursor_y){
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (cursor_y + 2) * BLOCK_SIZE,
              BLOCK_SIZE,
              (6 - cursor_y) * BLOCK_SIZE
            );
          }

          // fill 2 above cursor mark
          if (column.length > 8 - cursor_y) {
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (7 - column.length) * BLOCK_SIZE,
              BLOCK_SIZE,
              (column.length - 8 + cursor_y) * BLOCK_SIZE
            );
          }

        } else {
          // neighbor columns of the cursor

          if (1 < 7 - cursor_y){
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (cursor_y + 1) * BLOCK_SIZE,
              BLOCK_SIZE,
              (7 - cursor_y) * BLOCK_SIZE
            );
          }

          // fill above cursor mark
          if (column.length > 7 - cursor_y) {
            core.ctx.fillRect(
              offset_x + 110 + i * BLOCK_SIZE,
              offset_y + (7 - column.length) * BLOCK_SIZE,
              BLOCK_SIZE,
              (column.length - 7 + cursor_y) * BLOCK_SIZE
            );
          }
        }
      }
    }

    // fill cursor point
    core.ctx.fillRect(
      offset_x + 110 + (cursor_x - 1) * BLOCK_SIZE,
      offset_y + cursor_y * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );

    // chute cannot be merged
    core.ctx.fillRect(
      offset_x, offset_y,
      BLOCK_SIZE, 6 * BLOCK_SIZE
    );
  };

  board.drawMergeHints = board.drawMergeHintsStage1;


  // UTIL
  board.isColumnUnmergeable = function(i){
    var l = this.columns.length;
    return this.columns[i].length === 1 &&
      (i === 0 || this.columns[i - 1].length === 0) &&
      (i === l - 1 || this.columns[i + 1].length === 0);
  };

  // UPDATES
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