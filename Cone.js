class Cone {
  constructor() {
    this.type = 'cone'
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {

    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var delta = 0.1;
    var angle = 360 / 10;
    for (var step = 0; step < 360; step += angle) {
      let a1 = step;
      let a2 = step + angle;
      let v1 = [Math.cos((a1 * Math.PI) / 180) * delta, Math.sin((a1 * Math.PI) / 180) * delta];
      let v2 = [Math.cos((a2 * Math.PI) / 180) * delta, Math.sin((a2 * Math.PI) / 180) * delta];

      let p1 = [0 + v1[0], 0 + v1[1]];
      let p2 = [0 + v2[0], 0 + v2[1]];
      drawTriangle3D([0, 0, 0, p1[0], p1[1], 0.2, p2[0], p2[1], 0.2]);
    }
  }
}