var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

window.requestAnimationFrame = requestAnimationFrame;

var canvas = document.getElementById('canvas');

var core = {
  scene: null,
  ctx: canvas.getContext('2d')
};

var play_scene = require('play_scene.js');
var obj = require('test_obj.js');

core.scene = play_scene;

core.update = function(dt) {
  if (this.scene) {
    this.scene.update(dt);
  }
};

core.draw = function() {
  if (this.scene) {
    this.scene.draw();
  }
};

core.keyPressed = function(event) {
  if (this.scene) {
    this.scene.keyPressed(event.keyCode || event.charCode, event);
  }
};

core.registerScene = function(scene) {
  this.scene = scene
};

var start = Date.now();
function step(time) {
  var dt = time - start;
  core.ctx.clearRect(0, 0, 1300, 720);
  core.ctx.fillStyle = '#666';
  core.ctx.fillRect(0, 0, 1300, 720);
  core.update(dt);
  core.draw();
  requestAnimationFrame(step);
}
requestAnimationFrame(step);

document.body.addEventListener('keypress', function (e) {
  core.keyPressed(e);
});