'use client';

import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
void main() {
  vec2 verts[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0);
}
`;

// "Sunset" by @XorDev — https://www.shadertoy.com/view/Wf3SWn
const SUNSET = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
out vec4 fragColor;

#define BRIGHTNESS 0.85
#define COLOR_BASE 1.5
#define COLOR_SPEED 0.5
#define RGB vec3(0.0, 1.0, 2.0)
#define COLOR_WAVE 14.0
#define COLOR_DOT vec3(1,-1,0)
#define WAVE_STEPS 8.0
#define WAVE_FREQ 5.0
#define WAVE_AMP 0.6
#define WAVE_EXP 1.8
#define WAVE_VELOCITY vec3(0.2)
#define PASSTHROUGH 0.2
#define SOFTNESS 0.005
#define STEPS 80.0
#define SKY 10.0
#define FOV 1.0

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  vec3 dir = normalize(vec3(2.0 * fragCoord - iResolution.xy, -FOV * iResolution.y));
  vec3 col = vec3(0.0);

  for (float i = 0.0; i < STEPS; i++) {
    vec3 p = z * dir;
    for (float j = 0.0, f = WAVE_FREQ; j < WAVE_STEPS; j++, f *= WAVE_EXP)
      p += WAVE_AMP * sin(p * f - WAVE_VELOCITY * iTime).yzx / f;

    s = 0.3 - abs(p.y);
    d = SOFTNESS + max(s, -s * PASSTHROUGH) / 4.0;
    z += d;
    float phase = COLOR_WAVE * s + dot(p, COLOR_DOT) + COLOR_SPEED * iTime;
    col += (cos(phase - RGB) + COLOR_BASE) * exp(s * SKY) / d;
  }

  col *= SOFTNESS / STEPS * BRIGHTNESS;
  fragColor = vec4(tanh(col * col), 1.0);
}
`;

// Compact twigl raymarch: sphere + folded noise field.
const ORB = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
out vec4 fragColor;

void main() {
  vec2 r = iResolution.xy;
  vec4 FC = gl_FragCoord;
  vec4 o = vec4(0.0);
  float z = 0.0;
  float d = 0.0;
  float f = 0.0;

  for (float i = 0.0; i++ < 1e2; ) {
    vec3 p = z * (FC.rgb * 2.0 - r.xyy) / r.y;
    vec3 c = p;
    p.z += 8.0;
    c.z *= 3.0;
    for (f = 1.0; f++ < 9.0; )
      c += sin(c.yzx * f + z + iTime * 0.5) / f;
    f = 0.1 + abs(0.2 * c.y + abs(p.y + 0.8));
    d = max(length(p) - 3.0, 0.9 - length(p - vec3(-1.0, 1.0, 3.0)));
    z += min(f, d) / 7.0;
    o += vec4(4.0, 6.0, 8.0 + z, 0.0) / f
      - min(dFdx(z) * r.y + z, 0.0) / exp(d * d / 0.1);
  }

  o = tanh(o / 2e3);
  fragColor = vec4(o.rgb, 1.0);
}
`;

export const BG_EFFECTS = [
  { id: 'sunset', label: '日落 Sunset' },
  { id: 'orb', label: '星核 Orb' },
] as const;

export type BgEffectId = (typeof BG_EFFECTS)[number]['id'];

const FRAGS: Record<BgEffectId, string> = {
  sunset: SUNSET,
  orb: ORB,
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HomeBackground({ effect }: { effect: BgEffectId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAGS[effect]);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const resolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const timeLoc = gl.getUniformLocation(program, 'iTime');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scale = reduced ? 0.4 : 0.55;
    let frame = 0;
    let running = true;
    let start = performance.now();

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform3f(resolutionLoc, canvas.width, canvas.height, 1);
      gl.uniform1f(timeLoc, reduced ? 8 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else if (!reduced) {
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    draw(performance.now());
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteVertexArray(vao);
    };
  }, [effect]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#14080c]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/75" />
    </div>
  );
}
