var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
uniform sampler2D u_Sampler3;
uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_whichTexture == 0) { 
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = vec4(0.41569, 0.55294, 0.45098, 1);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }`


// Global vars for setup
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

let a_UV;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;

// SETUP --------------------------------------------------------------------------
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);

}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return ([x, y]);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Modelmatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_Modelmatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // first of the 3 doesnt work grr
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('bruh');
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get u_ProjectionMatrix');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get u_whichTexture');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0'); //sky
  if (!u_Sampler0) {
    console.log('Failed to get u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1'); //grass
  if (!u_Sampler1) {
    console.log('Failed to get u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get u_Sampler2');
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get u_Sampler3');
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function initTextures() {
  var image = new Image();
  if (!image) {
    console.log('Failed to get image');
    return false;
  }
  image.onload = function () { sendImageToTEXTURE0(image); };
  image.crossOrigin = "anonymous";
  image.src = 'sky.jpg';

  var image1 = new Image();
  if (!image1) {
    console.log('Failed to get image1');
    return false;
  }
  image1.onload = function () { sendImageToTEXTURE1(image1); };
  //console.log('hi');
  image1.crossOrigin = "anonymous";
  image1.src = 'grass1.png';

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to get image2');
    return false;
  }
  image2.onload = function () { sendImageToTEXTURE2(image2); };
  //console.log('hi');
  image2.crossOrigin = "anonymous";
  image2.src = 'fox.png';

  var image3 = new Image();
  if (!image3) {
    console.log('Failed to get image3');
    return false;
  }
  image3.onload = function () { sendImageToTEXTURE3(image3); };
  //console.log('hi');
  image1.crossOrigin = "anonymous";
  image1.src = 'flower.png';

  //console.log('got grass');
  // add more textures here
  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture0');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  //console.log('finished load texture');
}

function sendImageToTEXTURE1(image1) {
  var texture = gl.createTexture();   // create a texture object
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
  gl.uniform1i(u_Sampler1, 1);
  //console.log('finished load texture');
}

function sendImageToTEXTURE2(image2) {
  var texture = gl.createTexture();   // create a texture object
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
  gl.uniform1i(u_Sampler2, 2);
  //console.log('finished load texture');
}

function sendImageToTEXTURE3(image3) {
  var texture = gl.createTexture();   // create a texture object
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
  gl.uniform1i(u_Sampler3, 3);
  //console.log('finished load texture');
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const PIC = 3;

// Globals for UI
let g_AngleX = 0;
let g_camSlider = -180;
let g_AngleY = 0;

let g_frontLeft = 0;
let g_frontRight = 0;
let g_backLeft = 0;
let g_backRight = 0;
let g_base = 0;
let g_middle = 0;
let g_tip = 0;
let g_animate = false;
let shift_key = false;
let g_hat = 0;
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
var g_camera;

function addActionForHtmlUI() {
  // Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function () { g_camSlider = this.value; renderScene(); });

  document.getElementById('frontLeft').addEventListener('mousemove', function () { g_frontLeft = this.value; renderScene(); });
  document.getElementById('frontRight').addEventListener('mousemove', function () { g_frontRight = this.value; renderScene(); });
  document.getElementById('backLeft').addEventListener('mousemove', function () { g_backLeft = this.value; renderScene(); });
  document.getElementById('backRight').addEventListener('mousemove', function () { g_backRight = this.value; renderScene(); });
  document.getElementById('base').addEventListener('mousemove', function () { g_base = this.value; renderScene(); });
  document.getElementById('middle').addEventListener('mousemove', function () { g_middle = this.value; renderScene(); });
  document.getElementById('tip').addEventListener('mousemove', function () { g_tip = this.value; renderScene(); });

  // Buttons
  document.getElementById('on').addEventListener('click', function () { g_animate = true; });
  document.getElementById('off').addEventListener('click', function () { g_animate = false; });

}

// MAIN --------------------------------------------------------------------------
var xyCoord = [0, 0];
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  canvas.onmousedown = click;
  document.onwheel = scroll;
  canvas.onmousemove = function (ev) {
    if (ev.buttons == 1) {
      click(ev, 1)
    } else {
      if (xyCoord[0] != 0) {
        xyCoord = [0, 0];
      }
    }
  }
  g_camera = new Camera();
  document.onkeydown = keydown;
  initTextures();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

function scroll(ev) {
  if (ev.deltaY > 0) {
    g_camera.forward(1);
  } else {
    g_camera.back(1);
  }
}

function click(ev, check) {
  // make rotation on y and x axis
  let [x, y] = convertCoordinatesEventToGL(ev);
  if (xyCoord[0] == 0) {
    xyCoord = [x, y];
  }
  g_AngleX += xyCoord[0] - x;
  g_AngleY += xyCoord[1] - y;
  if (Math.abs(g_AngleX / 360) > 1) {
    g_AngleX = 0;
  }
  if (Math.abs(g_AngleY / 360) > 1) {
    g_AngleY = 0;
  }
}

// TICK --------------------------------------------------------------------------
let time = 0;
function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

// UPDATE ANIMATION ANGLES -------------------------------------------------------
function updateAnimationAngles() {
  if (g_animate) {
    //legs
    g_frontLeft = (25 * Math.sin(g_seconds));
    g_frontRight = (25 * Math.sin(g_seconds));
    g_backLeft = (10 * Math.sin(g_seconds));
    g_backRight = (10 * Math.sin(g_seconds));
    //tail
    g_base = (10 * Math.sin(g_seconds));
    // g_middle = (5 * Math.sin(g_seconds));
    //g_tip = (25 * Math.sin(g_seconds));
  }
}

// KEYDOWN --------------------------------------

function keydown(ev) {
  if (ev.keyCode == 68) { //d
    g_camera.eye.elements[0] += 0.2;
  } else if (ev.keyCode == 65) { // a
    g_camera.eye.elements[0] -= 0.2;
  } else if (ev.keyCode == 87) { //w
    g_camera.forward();
  } else if (ev.keyCode == 83) {
    g_camera.back();
  } else if (ev.keyCode == 81) {
    g_camera.panLeft();
  } else if (ev.keyCode == 69) {
    g_camera.panRight();
  } else if (ev.keyCode == 73) {
    addBlock();
  }
  renderScene();
  //console.log(ev.keyCode);
}

function addBlock() {
  if ((g_camera.at.elements[0] + 16) < 32 && (g_camera.at.elements[0] + 16) >= 0 && (g_camera.at.elements[2] + 16) < 32 && (g_camera.at.elements[2] + 16) >= 0) {
    map[Math.round(g_camera.at.elements[0] + 16)][Math.round(g_camera.at.elements[2] + 16)] += 1;
    //console.log('add block sucessful');
    renderScene();
  } 
}

function deleteBlock() {

  if ((g_camera.at.elements[0] + 16) < 32 && (g_camera.at.elements[0] + 16) >= 0 && (g_camera.at.elements[2] + 16) < 32 && (g_camera.at.elements[2] + 16) >= 0) {
    if (map[Math.round(g_camera.at.elements[0] + 16)][Math.round(g_camera.at.elements[2] + 16)] >= 1) {
      map[Math.round(g_camera.at.elements[0] + 16)][Math.round(g_camera.at.elements[2] + 16)] -= 1;
      console.log('delete block sucessful');
      renderScene();
    }
  } else {
    console.log(g_camera.at.elements);
  }
}


// DRAWING CUBES ------------------------------------------------
var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawMap() {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 1;
        body.matrix.translate(x - 4, -.75, y - 4);
        body.renderfaster();
      } else if (g_map[x][y] == 2) {
        var body = new Cube();
        body.textureNum = 1;
        body.matrix.translate(x - 3.5, -.9, y - 4);
        body.render();
      } else if (g_map[x][y] == 3) {
        var body = new Cube();
        body.textureNum = 2;
        body.matrix.translate(x - 3.5, -.3, y - 4);
        body.render();
      }
    }
  }
}

// RENDER --------------------------------------------------------------------------
var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];

function renderScene() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width / canvas.height, .1, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


  var globalRotMat = new Matrix4().rotate(g_AngleX, 0, -1, 0);
  globalRotMat.rotate(g_camSlider, 0, 1, 0);
  globalRotMat.rotate(g_AngleY, -1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var light = [0.95294, 0.88627, 0.92549, 1.0];
  var taupe = [0.51765, 0.49412, 0.53725, 1.0];
  var darkLiver = [0.33725, 0.28627, 0.29804, 1.0];


  // floor
  var floor = new Cube();
  //floor.color = [1, 0, 0, 1];
  floor.textureNum = 4;
  floor.matrix.translate(0, -.212, 0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-.5, 0, -.5);
  floor.render();

  // sky
  var sky = new Cube();
  sky.color = [1, 0, 0, 1];
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  drawMap();

  // ANIMAL ----------------
  // body 
  var body = new Cube();
  body.color = light;
  body.textureNum = -2; // texture
  body.matrix.scale(0.275, 0.35, 0.6);
  body.matrix.translate(-.5, -0.3, -0.25);
  body.render();

  // head
  var head = new Cube();
  head.color = light;
  head.textureNum = -2;
  head.matrix.scale(0.35, 0.25, 0.35);
  head.matrix.translate(-.5, 0.25, -1.25);
  head.render();

  // snout
  var snout = new Cube();
  snout.color = taupe;
  snout.textureNum = -2;
  snout.matrix.scale(0.175, 0.125, 0.03);
  snout.matrix.translate(-.5, 0.475, -15.5);
  snout.render();

  // scruff
  var scruff = new Cube();
  scruff.color = light;
  scruff.textureNum = -2;
  scruff.matrix.scale(0.2, 0.15, 0.1);
  scruff.matrix.translate(-.5, -0.55, -2.5);
  scruff.render();

  // left ear
  var lEar = new Cube();
  lEar.color = taupe;
  lEar.textureNum = -2;
  lEar.matrix.scale(0.1, 0.1, 0.15);
  lEar.matrix.translate(-1.5, 2.8, -1.6);
  lEar.render();

  // right ear
  var rEar = new Cube();
  rEar.color = taupe;
  rEar.textureNum = -2;
  rEar.matrix.scale(0.1, 0.1, 0.15);
  rEar.matrix.translate(0.5, 2.8, -1.6);
  rEar.render();

  // left front leg
  var lfleg = new Cube();
  lfleg.color = darkLiver;
  lfleg.textureNum = -2;
  lfleg.matrix.rotate(g_frontLeft, 1, 0, 0);
  lfleg.matrix.scale(0.1, 0.2, 0.1);
  lfleg.matrix.translate(-1.5, -1, -1);
  lfleg.render();

  // right front leg
  var rfleg = new Cube();
  rfleg.color = taupe;
  rfleg.textureNum = -2;
  rfleg.matrix.rotate(-g_frontRight, 1, 0, 0);
  rfleg.matrix.scale(0.1, 0.2, 0.1);
  rfleg.matrix.translate(0.5, -1, -1);
  rfleg.render();

  // left back leg
  var lbleg = new Cube();
  lbleg.color = taupe;
  lbleg.textureNum = -2;
  lbleg.matrix.rotate(-g_backLeft, 1, 0, 0);
  lbleg.matrix.scale(0.1, 0.2, 0.1);
  lbleg.matrix.translate(-1.5, -1, 3.55);
  lbleg.render();

  // right back leg
  var rbleg = new Cube();
  rbleg.color = darkLiver;
  rbleg.textureNum = -2;
  rbleg.matrix.rotate(g_backRight, 1, 0, 0);
  rbleg.matrix.scale(0.1, 0.2, 0.1);
  rbleg.matrix.translate(0.5, -1, 3.55);
  rbleg.render();

  // tail base
  var tailb = new Cube();
  tailb.color = darkLiver;
  tailb.textureNum = -2;
  tailb.matrix.setRotate(45, 1, 0, 0);
  tailb.matrix.rotate(g_base, 0, 0, 1);
  var middleCoord = new Matrix4(tailb.matrix);
  //var tipCoord = new Matrix4(tailb.matrix);
  tailb.matrix.scale(0.05, 0.05, 0.3);
  tailb.matrix.translate(-0.5, 8, 0.5);
  tailb.render();

  // tail middle
  var tailm = new Cube();
  tailm.color = taupe;
  tailm.textureNum = -2;
  tailm.matrix = middleCoord;
  //tailm.matrix.setRotate(-45, 1, 0, 0);
  tailm.matrix.rotate(g_middle, 0, 1, 1);
  var tipCoord = new Matrix4(tailm.matrix);
  tailm.matrix.scale(0.05, 0.05, 0.2);
  tailm.matrix.translate(-0.5, 8, 2.25);
  tailm.render();

  // tail tip
  var tailt = new Cube();
  tailt.color = darkLiver;
  tailt.textureNum = -2;
  tailt.matrix = tipCoord;
  tailt.matrix.rotate(g_tip, 0, 1, 1);
  tailt.matrix.scale(0.05, 0.05, 0.05);
  tailt.matrix.translate(-0.5, 8, 13);
  tailt.render();

  // left eye
  var lefteye = new Cube();
  lefteye.color = [1, 1, 1, 1];
  lefteye.textureNum = -2;
  // lefteye.matrix.rotate(-10, 1, 0, 0);
  //lefteye.matrix.rotate(-head_animation, 1, 0, 0);
  lefteye.matrix.scale(0.1, 0.061, 0.04);
  lefteye.matrix.translate(-1.5, 3.5, -10.95);
  lefteye.render();

  var lefteyeblack = new Cube();
  lefteyeblack.color = [0, 0, 0, 1];
  lefteyeblack.textureNum = -2;
  // lefteyeblack.matrix.rotate(-10, 1, 0, 0);
  //lefteyeblack.matrix.rotate(-head_animation, 1, 0, 0);
  lefteyeblack.matrix.scale(0.05, 0.061, 0.04);
  lefteyeblack.matrix.translate(1, 3.5, -11);
  lefteyeblack.render();

  // right eye
  var righteye = new Cube();
  righteye.color = [1, 1, 1, 1];
  righteye.textureNum = -2;
  // righteye.matrix.rotate(-10, 1, 0, 0);
  //righteye.matrix.rotate(-head_animation, 1, 0, 0);
  righteye.matrix.scale(0.1, 0.061, 0.04);
  righteye.matrix.translate(0.5, 3.5, -10.95);
  righteye.render();

  var righteyeblack = new Cube();
  righteyeblack.color = [0, 0, 0, 1];
  righteyeblack.textureNum = -2;
  // righteyeblack.matrix.rotate(-10, 1, 0, 0);
  //righteyeblack.matrix.rotate(-head_animation, 1, 0, 0);
  righteyeblack.matrix.scale(0.05, 0.061, 0.04);
  righteyeblack.matrix.translate(-2, 3.5, -11);
  righteyeblack.render();

  //nose
  var nose = new Cube();
  nose.color = darkLiver;
  nose.textureNum = -2;
  // righteye.matrix.rotate(-10, 1, 0, 0);
  //righteye.matrix.rotate(-head_animation, 1, 0, 0);
  nose.matrix.scale(0.08, 0.05, 0.04);
  nose.matrix.translate(-0.5, 2.75, -11.95);
  nose.render();

  // party hat
  /*var party = new Cone();
  party.color = [0.70196, 0.85098, 1.00000, 1];
  party.textureNum = -2;
  party.matrix.rotate(90, 1, 0, 0);
  party.matrix.rotate(g_hat, 1, 0, 0);
  //party.matrix.scale(2,2, 2);
  party.matrix.translate(0, -0.275, -0.5);
  party.render()*/

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}