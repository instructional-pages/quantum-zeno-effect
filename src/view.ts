// Plain WebGL2 drawing of the sphere view: one pale color, lines and flat triangles, each
// vertex with its own brightness, added up on black. Drawn on demand, never per frame.

import { arc, arrow, camera, depthFade, outline, RIGHT, shape, toScreen, track, UP, type Vec3 } from "./sphere.ts";

const VERTEX = `#version 300 es
layout(location = 0) in vec3 a_point;
layout(location = 1) in float a_alpha;
uniform mat4 u_camera;
out float v_alpha;
void main() {
  gl_Position = u_camera * vec4(a_point, 1.0);
  v_alpha = a_alpha;
}`;

const FRAGMENT = `#version 300 es
precision mediump float;
in float v_alpha;
out vec4 color;
void main() {
  color = vec4(0.82, 0.86, 0.9, v_alpha);
}`;

// Brightness from 0 to 1: the sphere's shape is quiet, its outline a little less so, the
// circle in use clear (and not faded with depth, so it stands out from the outline it
// nearly follows), and the arrow brightest. The angle's arc sits between.
const SHAPE_ALPHA = 0.16;
const OUTLINE_ALPHA = 0.2;
const TRACK_ALPHA = 0.7;
const ARC_ALPHA = 0.6;
const ARC_RADIUS = 0.3;
const ARROW_ALPHA = 0.95;

// Four floats per vertex: x, y, z, alpha.
const STRIDE = 4;

export interface SphereScene {
  // Where the arrow points, or null for no arrow.
  angle: number | null;
  // Mark the angle with an arc from the top to the arrow.
  arc: boolean;
}

export interface SphereView {
  draw(scene: SphereScene): void;
  // Where a point in sphere coordinates lands on the canvas, in CSS pixels.
  screen(p: Vec3): [number, number];
}

const lines = (pieces: [Vec3, Vec3][], alpha: number, fade = true) =>
  pieces.flatMap((piece) => piece.flatMap((p) => [...p, fade ? alpha * depthFade(p) : alpha]));

export function createSphereView(canvas: HTMLCanvasElement): SphereView | null {
  const gl = canvas.getContext("webgl2", { antialias: true });
  if (!gl) return null;

  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
  gl.useProgram(program);
  const cameraLoc = gl.getUniformLocation(program, "u_camera");

  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE * 4, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 1, gl.FLOAT, false, STRIDE * 4, 12);

  // Additive blending on black: lines that cross stay visible.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 1);

  // The sphere itself never changes.
  const still = [...lines(shape(), SHAPE_ALPHA), ...lines(outline(), OUTLINE_ALPHA, false), ...lines(track(), TRACK_ALPHA, false)];

  return {
    draw({ angle, arc: marked }) {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniformMatrix4fv(cameraLoc, true, camera(width / height));
      gl.clear(gl.COLOR_BUFFER_BIT);

      const triangles = angle === null ? [] : arrow(angle).flatMap((p) => [...p, ARROW_ALPHA]);
      const segments = [...still, ...(angle !== null && marked && angle > 0 ? lines(arc([0, 0, 0], UP, RIGHT, ARC_RADIUS, 0, angle), ARC_ALPHA, false) : [])];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...triangles, ...segments]), gl.STREAM_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, triangles.length / STRIDE);
      gl.drawArrays(gl.LINES, triangles.length / STRIDE, segments.length / STRIDE);
    },
    screen(p) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      return toScreen(camera(width / height), p, width, height);
    },
  };
}
