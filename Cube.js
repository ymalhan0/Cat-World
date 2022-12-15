class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;
    this.verts = [
      // Front
      0, 0, 0, 1, 1, 0, 1, 0, 0,
      0, 0, 0, 0, 1, 0, 1, 1, 0,
      // Top
      0, 1, 0, 0, 1, 1, 1, 1, 1,
      0, 1, 0, 1, 1, 1, 1, 1, 0,
      // Bottom
      0, 1, 0, 0, 1, 1, 1, 1, 1,
      0, 1, 0, 1, 1, 1, 1, 1, 0,
      // Left
      1, 0, 0, 1, 1, 1, 1, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 1, 1,
      // Right 
      0, 0, 0, 0, 1, 1, 0, 1, 0,
      0, 0, 0, 0, 0, 1, 0, 1, 1,
      // Back
      0, 0, 1, 1, 1, 1, 0, 1, 1,
      0, 0, 1, 1, 0, 1, 1, 1, 1
    ];
    this.uvVerts = [
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1
    ];
  }

  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front of cube
    drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);

    // Top of cube
    gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    drawTriangle3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);

    // Bottom of cube
    gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 1]);

    // Left side of cube
    gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
    drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([1, 0, 0, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);

    // Right side of cube
    gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1]);

    // Back of cube
    gl.uniform4f(u_FragColor, rgba[0] * .7, rgba[1] * .7, rgba[2] * .7, rgba[3]);
    drawTriangle3DUV([0, 0, 1, 1, 1, 1, 0, 1, 1], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
  }

  renderfaster() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3DUV(this.verts, this.uvVerts);
  }

}