/* =========================================================
   Castor 3D — renderizador WebGL mínimo (sem bibliotecas)
   ---------------------------------------------------------
   Desenha assets/castor.glb: malha low-poly não indexada,
   com POSITION (float32) e COLOR_0 (uint8 normalizado) —
   exatamente o formato gerado para este site. Cada face é
   chapada (normal da face), o que dá o visual facetado.

   Uso:  Castor3D.mount(canvas, url).then((c) => c.look(yaw, pitch))
   yaw/pitch em radianos; positivo = olhar para a direita / para baixo.
   Se algo falhar (sem WebGL, arquivo fora), a Promise rejeita e
   quem chamou mantém a imagem PNG.
   ========================================================= */
(() => {
  const VS = `
    attribute vec3 aPos; attribute vec3 aNrm; attribute vec4 aCol;
    uniform mat4 uModel; uniform mat4 uProj;
    varying vec3 vCol;
    void main() {
      vec3 n = mat3(uModel) * aNrm;
      // a cor da imagem já traz sombreado; a luz real só reforça as facetas ao girar
      float key = max(dot(n, normalize(vec3(-0.45, 0.6, 1.0))), 0.0);
      float rim = max(dot(n, normalize(vec3(0.8, -0.2, 0.4))), 0.0);
      vCol = aCol.rgb * (0.6 + 0.48 * key + 0.12 * rim);
      gl_Position = uProj * uModel * vec4(aPos, 1.0);
    }`;
  const FS = `
    precision mediump float;
    varying vec3 vCol;
    void main() { gl_FragColor = vec4(vCol, 1.0); }`;

  // lê o GLB: cabeçalho de 12 bytes, chunk JSON, chunk BIN
  function parseGLB(buf) {
    const dv = new DataView(buf);
    if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('não é GLB');
    const jsonLen = dv.getUint32(12, true);
    const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 20, jsonLen)));
    const binStart = 20 + jsonLen + 8;
    const read = (i, Type, comps) => {
      const acc = json.accessors[i];
      const view = json.bufferViews[acc.bufferView];
      return new Type(buf, binStart + (view.byteOffset || 0) + (acc.byteOffset || 0), acc.count * comps);
    };
    const attrs = json.meshes[0].primitives[0].attributes;
    return { pos: read(attrs.POSITION, Float32Array, 3), col: read(attrs.COLOR_0, Uint8Array, 4) };
  }

  // normal chapada de cada triângulo, repetida nos 3 vértices
  function flatNormals(p) {
    const n = new Float32Array(p.length);
    for (let i = 0; i < p.length; i += 9) {
      const ax = p[i + 3] - p[i], ay = p[i + 4] - p[i + 1], az = p[i + 5] - p[i + 2];
      const bx = p[i + 6] - p[i], by = p[i + 7] - p[i + 1], bz = p[i + 8] - p[i + 2];
      let x = ay * bz - az * by, y = az * bx - ax * bz, z = ax * by - ay * bx;
      const l = Math.hypot(x, y, z) || 1;
      x /= l; y /= l; z /= l;
      for (let k = 0; k < 9; k += 3) { n[i + k] = x; n[i + k + 1] = y; n[i + k + 2] = z; }
    }
    return n;
  }

  // matrizes 4x4 em coluna (padrão WebGL)
  const perspective = (fov, aspect, near, far) => {
    const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  };
  // Translação(0,0,-dist) · RotX(pitch) · RotY(yaw)
  const model = (yaw, pitch, dist) => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
    return [cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -dist, 1];
  };

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  async function mount(canvas, url) {
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) throw new Error('sem WebGL');

    const res = await fetch(url);
    if (!res.ok) throw new Error(`castor: ${res.status}`);
    const { pos, col } = parseGLB(await res.arrayBuffer());
    const nrm = flatNormals(pos);

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const attr = (name, data, size, type, normalized) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, type, normalized, 0, 0);
    };
    attr('aPos', pos, 3, gl.FLOAT, false);
    attr('aNrm', nrm, 3, gl.FLOAT, false);
    attr('aCol', col, 4, gl.UNSIGNED_BYTE, true);
    const uModel = gl.getUniformLocation(prog, 'uModel');
    const uProj = gl.getUniformLocation(prog, 'uProj');
    const count = pos.length / 3;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);

    let yaw = 0, pitch = 0;
    const draw = () => {
      // resolução acompanha o tamanho na tela e a densidade de pixels
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniformMatrix4fv(uProj, false, perspective(0.62, w / h || 1, 0.1, 20));
      gl.uniformMatrix4fv(uModel, false, model(yaw, pitch, 4.1));
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    };
    draw();

    return {
      look(y, p) { yaw = y; pitch = p; draw(); },
      redraw: draw,
    };
  }

  window.Castor3D = { mount };
})();
