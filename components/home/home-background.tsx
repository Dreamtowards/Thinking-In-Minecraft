'use client';

import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
void main() {
  vec2 verts[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0);
}
`;

const TWIGL_HEAD = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
out vec4 fragColor;

const float PI = 3.141592653589793;

float fsnoise(vec2 c) {
  return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

mat3 rotate3D(float angle, vec3 axis) {
  vec3 a = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float rc = 1.0 - c;
  return mat3(
    a.x * a.x * rc + c,
    a.y * a.x * rc + a.z * s,
    a.z * a.x * rc - a.y * s,
    a.x * a.y * rc - a.z * s,
    a.y * a.y * rc + c,
    a.z * a.y * rc + a.x * s,
    a.x * a.z * rc + a.y * s,
    a.y * a.z * rc - a.x * s,
    a.z * a.z * rc + c
  );
}
`;

function twigl(body: string, extras = '') {
  return `${TWIGL_HEAD}
${extras}
void main() {
  vec2 r = iResolution.xy;
  vec4 FC = gl_FragCoord;
  float t = iTime;
  vec4 o = vec4(0.0);
${body}
  fragColor = vec4(o.rgb, 1.0);
}
`;
}

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
const ORB = twigl(`
  float z = 0.0;
  float d = 0.0;
  float f = 0.0;
  for (float i = 0.0; i++ < 1e2; ) {
    vec3 p = z * (FC.rgb * 2.0 - r.xyy) / r.y;
    vec3 c = p;
    p.z += 8.0;
    c.z *= 3.0;
    for (f = 1.0; f++ < 9.0; )
      c += sin(c.yzx * f + z + t * 0.5) / f;
    f = 0.1 + abs(0.2 * c.y + abs(p.y + 0.8));
    d = max(length(p) - 3.0, 0.9 - length(p - vec3(-1.0, 1.0, 3.0)));
    z += min(f, d) / 7.0;
    o += vec4(4.0, 6.0, 8.0 + z, 0.0) / f
      - min(dFdx(z) * r.y + z, 0.0) / exp(d * d / 0.1);
  }
  o = tanh(o / 2e3);
`);

// Cyclone — GOLF by @XorDev https://x.com/XorDev/status/2097409639054733531
const CYCLONE = twigl(`
  float z = 0.0;
  float d = 0.0;
  float a = 0.0;
  for (float i = 0.0; i < 90.0; i++) {
    vec3 p = z * normalize(2.0 * FC.rgb - r.xyy);
    p.z += 9.0;
    vec3 q = p;
    a = (p.y - length(p.xz)) / 2.0;
    p.xz *= mat2(cos(a + vec4(0.0, 5.0, 8.0, 0.0)));
    d = 2.0;
    for (float j = 0.0; j < 7.0; j++) {
      d /= 0.9;
      p += sin(p.yzx * d - vec3(t, 0.0, 0.0) * 6.0) / d;
    }
    d = min(length(p.xz), 8.0 - abs(p.y)) / 15.0 / (2.0 + cos(a - t));
    z += d;
    o += vec4(7.0, 5.0, z, 0.0) * d / length(q.xz + (p.xz / 2.0 + 3.0) * sin(t - a));
  }
  o = tanh(o * o / 1e3);
`);

// Heavenly — @XorDev https://x.com/XorDev/status/1917268381616534000
const HEAVENLY = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (cos(z + t + vec4(6, 1, 2, 3)) + 1.0) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z -= t;
    for (d = 1.0; d < 9.0; d /= 0.7)
      p += cos(p.yzx * d + z * 0.2) / d;
    z += d = 0.02 + 0.1 * abs(3.0 - length(p.xy));
  }
  o = tanh(o / 3e3);
`);

// LED — @XorDev https://x.com/XorDev/status/1540071403185127426
const LED = twigl(`
  vec4 S;
  vec4 C = vec4(0, 2, 4, 6);
  vec2 I = rotate2D(0.1) * (FC.xy - r * 0.5);
  vec2 p;
  for (vec2 i = vec2(1.0); i.x < 16.0; i += 1.0 / i) {
    p = I + rotate2D(2.4 * i.x) * i * I.y / 4e2;
    p = p / (r + r - p).y / 0.1 + t;
    S = max(
      sin(p * 4e1).y * sin(p.x * 4e1 + C)
        * clamp(cos((ceil(p.y) + fract(p.y) + C / 1e2) / fsnoise(ceil(p - sin(p)))), 0.03, 1.0),
      0.0
    );
    o += S * S * S;
  }
  o = sqrt(sqrt(o)) * 0.5;
`);

// Topology — @XorDev https://x.com/XorDev/status/1903091482904478140
const TOPOLOGY = twigl(`
  vec3 p = vec3(0.0);
  vec3 v = vec3(0.0);
  vec3 a = vec3(0.0);
  p.z += 2.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; o += 0.01 / exp(d * d * 1e3)) {
    a = abs(v = p * rotate3D(t * 0.2, vec3(1.0)));
    v = round(v / max(a, max(a.yzx, a.zxy)) / 0.1);
    d = length(p) - 1.2 - dot(cos(v), sin(v.yxz * 0.6 + t)) * 0.1;
    p += (FC.rgb * 2.0 - r.xyy) / r.y * 0.1 * d;
  }
`);

// Dispersion — @XorDev https://x.com/XorDev/status/1978091803262783504
const DISPERSION = twigl(`
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  for (float i = 0.0; i++ < 2e1; o += (cos(s - z + vec4(0, 1, 8, 0)) + 1.0) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    vec3 a = p;
    for (d = 2.0; d++ < 7.0; )
      a -= sin(a * d + t + i).yzx / d;
    z += d = abs(2.0 - max(p = abs(p), p.y).x) + abs(cos(s = a.z + a.y - t)) / 7.0;
  }
  o = tanh(o / 2e2);
`);

// Paradise 3 — @XorDev https://x.com/XorDev/status/1958193141573353887
const PARADISE3 = twigl(`
  float z = 0.0;
  float f = 0.0;
  vec3 c = vec3(0.0);
  vec3 p = vec3(0.0);
  for (float i = 0.0; i++ < 5e1; p += c, z += f = length(cos(p / p.y) / 8.0 + sin(p.y / 7.0) * 0.4), o += (cos(c.y / 14.0 - vec4(7, 2, 3, 0)) + 1.0) * z * z / (0.9 + p.y * f) / max(length(c.xy / z - 0.6) - 0.1, 0.1)) {
    p = z * (FC.rgb / 0.4 - r.xyy) / r.y;
    p.y = abs(p.y + 2.0);
    c = p;
    p.x *= f = 0.2;
    for (; f++ < 9.0; p += cos(p.yzx * f - t / 4.0) / f);
  }
  o = tanh(o / 1e4);
`);

// Graycloud — @XorDev https://x.com/XorDev/status/1918698128204517712
const GRAYCLOUD = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; ) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z -= t * PI / 10.0;
    for (d = 1.0; d < 64.0; d += d)
      p += 0.5 * sin(p.yzx * d - t * d * PI / 10.0) / d;
    z += d = 0.03 + 0.1 * abs(abs(p.y) - 1.5);
    o += (cos(p.y / 0.4 - vec4(0, 1, 2, 3) - 3.0) + 1.5) / d;
  }
  o = tanh(o / 5e3);
`);

// Church1 — @XorDev https://x.com/XorDev/status/1918756104785277081
const CHURCH1 = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; ) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z -= t * PI / 10.0;
    p.xy *= rotate2D(z * 0.2);
    for (d = 1.0; d < 64.0; d += d)
      p += 0.7 * cos(p.yzx * d) / d;
    z += d = 0.03 + 0.1 * max(d = dot(cos(p), sin(p.yzx)) + 5.0 - z * 0.2 - length(p.xy), -d * 0.2);
    o += (cos(z - vec4(6, 1, 2, 3)) + 1.4) / d / z;
  }
  o = tanh(o * o / 3e5);
`);

// Gamma — @XorDev https://x.com/XorDev/status/1938254250372374690
const GAMMA = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 4e1; ) {
    vec3 P = z * normalize(FC.rgb * 2.0 - r.xyx);
    P.z += 9.0;
    vec3 p = vec3(atan(P.z, P.x + 0.1) * 2.0 - 0.3 * P.y, 0.6 * P.y - t, length(P.xz) - 4.0);
    for (d = 1.0; d < 9.0; d++)
      p += sin(p.yzx * d - t + 0.4 * i) / d;
    z += d = 0.2 * length(vec4(cos(p + P.y * 0.2) - 1.0, p.z));
    o += vec4(4.0, z, 2.0, 0.0) / d / d / z;
  }
  o = tanh(o / 4e2);
`);

// Gradient4 — @XorDev https://x.com/XorDev/status/1929554778893271246
const GRADIENT4 = twigl(`
  vec2 p = (FC.xy * 2.0 - r) / r.y;
  o = (sin(p.y / 0.4 + fract(cos(dot(tan(p), r)) * 4e4) - p.x + p.y * cos(p / 0.2 + cos(p / 0.3)).x - vec4(0, 0.6, 1, 0)) + 1.5)
    / (2.5 + abs(cos(p.x / 0.1)));
`);

// Frames — @XorDev https://x.com/XorDev/status/2016904976174317637
const FRAMES = twigl(
  `
  vec2 p = (FC.xy * 2.0 - r) / r.y / 0.4;
  vec2 v;
  float l;
  for (float i = 0.0; i++ < 9.0; o += 0.04 / abs(l = length(v) - 1.0) * (cos(i * 0.3 + 0.1 / l + vec4(0, 1, 2, 3)) + 1.0)) {
    v = p;
    for (float f = 0.0; f++ < 7.0; )
      v = (v + sin(v * f / 0.6 + i * 0.3 + cos(i + vec2(0, 2) + t / 2.0)) / f).yx;
  }
  vec4 prev = texture(b, (FC.xy + r.y * 0.02 * sin(FC.xy + FC.yx / 0.6)) / r);
  o = max(tanh(o + prev * prev), 0.0);
`,
  'uniform sampler2D b;',
);

// Cloud Compute — @XorDev https://x.com/XorDev/status/1918680610127659112
const CLOUDCOMPUTE = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 8e1; ) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xxy);
    p.xz -= t;
    p.y = 4.0 - abs(p.y);
    for (d = 0.7; d < 2e1; d /= 0.5)
      p += cos(round(p.yzx * d) - 0.2 * t) / d;
    z += d = 0.01 + abs(p.y) / 15.0;
    o += (cos(vec4(0, 1, 2, 0) - p.y * 2.0) + 1.1) / z / d;
  }
  o = tanh(o / 7e2);
`);

// Radiant — @XorDev https://x.com/XorDev/status/1947652770393153850
const RADIANT = twigl(`
  vec3 p;
  vec3 v;
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 5e1; o += vec4(z, 2, 1, 1) / d / z) {
    p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z += 6.0;
    v = normalize(cos(t / 4.0 + vec3(0, 2, 4)));
    p = abs(dot(v, p) * v + cross(v, p));
    v = p + sin(min(p, 2.0) * 6.0);
    z += d = 0.1 * abs(max(p.x, max(p.y, p.z)) - 2.0) + 0.1 * length(min(v, v.yzx) - 1.0);
  }
  o = tanh(o / 4e2);
`);

// Laser Dance — @XorDev https://x.com/XorDev/status/1923037860485075114
const LASERDANCE = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (cos(z + vec4(0, 2, 3, 0)) + 1.5) / d / z) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy) + 0.8;
    d = max(-p.y, 0.0);
    p.y += d + d - 1.0;
    float ground = d;
    p = cos(p + t) + cos(p / 0.6).yzx;
    d = ground + 1.0;
    z += d = 0.3 * (0.01 + 0.1 * ground + length(min(p, p.zxy)) / d / d);
  }
  o = tanh(o / 7e2);
`);

// Neutron — @XorDev https://x.com/XorDev/status/1940496912718991572
const NEUTRON = twigl(`
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (cos(s + vec4(0, 1, 2, 0)) + 1.0) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    vec3 a = normalize(cos(vec3(7, 1, 0) + t - 0.3 * s));
    p.z += 9.0;
    a = a * dot(a, p) - cross(a, p);
    for (d = 0.5; d++ < 9.0; )
      a += sin(a * d + t).yzx / d;
    z += d = 0.01 * abs(s = length(a) - 5.0) + 0.05 * abs(a.y);
  }
  o = tanh(o / 3e3);
`);

// Particles — @XorDev https://x.com/XorDev/status/2018817870495641914
const PARTICLES = twigl(`
  vec3 p = vec3(0.0);
  float z = 0.0;
  float d = 0.0;
  float f = 0.0;
  for (float i = 0.0; i++ < 6e1; p = z * normalize(FC.rgb * 2.0 - r.xyy), p.z += 9.0) {
    z += d = 0.4 * max(
      f = abs(z - 5.0) * 0.05,
      length(vec4(dot(sin(p), sin(p / 0.6)) - length(p) + 5.0, sin(p / 0.1 + t) * cos(p.yzx / 0.1 + t) * 0.3)) - f
    );
    o += (cos(p.y + i * 0.2 + d / 0.2 + vec4(0, 1, 2, 3)) + 1.1) / d;
  }
  o = tanh(o * o / 3e5);
`);

// Bloxels — @XorDev https://x.com/XorDev/status/1831732594846921030
const BLOXELS = twigl(`
  vec2 c = FC.xy - r * 0.5;
  vec2 f = 1.0 - abs(c.yy / r.y) / 0.6;
  vec2 p = c / vec2(14.0, 10.0) / (1.0 + 0.02 * f * asin(cos(c.y / 20.0 + t / 0.2))) + t / 0.1;
  o = vec4(1, 2, 3, 0);
  p += sin(p += sin(p += sin(p) * f) * f) * f;
  o = tanh(snoise2D(p * 0.1) * 0.5 * o + cos(p.x * 0.2 + p.y * 0.1 + o)) * 0.5 + 0.5;
`);

// Juice — @XorDev https://x.com/XorDev/status/1943747695501320447
const JUICE = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; ) {
    vec4 c;
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyx);
    p.z += 9.0;
    p.xy *= mat2(c = cos(i * 0.1 + vec4(0, 33, 11, 0)));
    for (d = 1.0; d < 7.0; d++)
      p += sin(p.yzx * d + t - i * 0.1) / d;
    z += d = 0.2 * length(cos(p + i * 0.3) + 1.0);
    o += (c + 1.0) / d * z;
  }
  o = tanh(o * o / 1e8);
`);

// Lapse — @XorDev https://x.com/XorDev/status/1975230424982183956
const LAPSE = twigl(`
  float z = 0.0;
  float d = 0.0;
  float h = 0.0;
  for (float i = 0.0; i++ < 5e1; o += vec4(3, z, i, 1) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    vec3 a = vec3(0.0, 1.0, 0.0);
    p.z += 7.0;
    h = length(p) - t;
    a = mix(dot(a, p) * a, p, sin(h)) + cos(h) * cross(a, p);
    for (d = 0.0; d++ < 9.0; )
      a += sin(round(a * d) - t).zxy / d;
    z += d = 0.1 * length(a.xz);
  }
  o = tanh(o / 1e4);
`);

// LAUNCH — @XorDev https://x.com/XorDev/status/1950699117367189854
const LAUNCH = twigl(`
  float z = 0.0;
  float d = 0.0;
  float f = 0.0;
  for (float i = 0.0; i++ < 1e2; o += vec4(3, 1, d, z / f) / z) {
    vec3 v = vec3(0, -2, 7);
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyx) + v;
    vec3 a = p;
    a.y *= 0.3;
    for (d = 1.0; d++ < 9.0; )
      a -= 0.1 * sin((a.zxy + t * v + d) * d) * p.y / d;
    f = 0.2 + abs(length(a.xz - cos(a.zx * 6.0)) + max(p.y / 0.1, -0.6));
    z += d = min(max(-p.y, length(a) - 2.0), f) / 8.0;
  }
  o = tanh(o * o.a / 1e3);
`);

// Quasar 2 — @XorDev https://x.com/XorDev/status/1968828619435782446
const QUASAR2 = twigl(`
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  for (float i = 0.0; i++ < 7e1; o += vec4(z, 2, s, 1) / s / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    vec3 a = vec3(0.0);
    p.z += 9.0;
    a -= 0.57;
    s -= t;
    a = mix(dot(a, p) * a, p, cos(s)) - sin(s) * cross(a, p);
    s = sqrt(length(a.xz - a.y));
    for (d = 1.0; d++ < 9.0; )
      a += sin(a * d - t).yzx / d;
    z += d = length(sin(a) + dot(a, a / a) * 0.2) * s / 2e1;
  }
  o = tanh(o / 2e3);
`);

// Port — @XorDev https://x.com/XorDev/status/2021248551678849313
const PORT = twigl(`
  vec3 w = vec3(0.0);
  vec3 p = vec3(0.0);
  float z = 0.0;
  float d = 0.1;
  float f;
  for (float i = 0.0; i++ < 1e2; o += 0.03 / abs(mix(p, w, 0.1).y + vec4(0, 1, 2, 3) / 1e2) * d, z += d = 0.3 * (length(cos(p.xz)) - 0.4)) {
    p = z * (FC.rgb * 2.0 - r.xyy) / r.y + 1.0;
    w = p;
    for (f = 0.0; f++ < 5.0; )
      w += sin(w.zxy * f - 9.0 * exp(-d / 0.1) + t) / f;
  }
  o = tanh(o);
`);

// Who? — @XorDev https://x.com/XorDev/status/1915755845473706361
const WHO = twigl(`
  float z = 0.0;
  float d = 0.0;
  vec3 c = vec3(1, 2, 3);
  for (float i = 0.0; i++ < 5e1; ) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    vec3 v = p;
    v.z += exp(3.0 - sin(t));
    p.xy *= mat2(cos(p.z * 0.3 + vec4(0, 33, 11, 0)));
    for (d = 1.0; d < 9.0; d /= 0.4)
      p += cos((p - t * c * c).yzx * d) / d;
    v *= rotate3D(t, c);
    vec3 rotated = v;
    v = sin(round(rotated / 0.3));
    v = abs(rotated) - c.xxy + 0.3 * abs(v.yxx * v.zzy);
    z += d = 0.01 + min(abs(length(p.xy) - 6.0) * 0.6, abs(max(v, max(v.y, v.z)).x) - 0.01 / length(v)) / 4.0;
    o.rgb += exp(c * z * 0.1) / d;
  }
  o /= o + 3e3;
`);

// CUBE — @XorDev https://x.com/XorDev/status/1920505484206895334
const CUBE = twigl(`
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  for (float i = 0.0; i++ < 1e2; ) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z += 2.0;
    p.zx *= mat2(cos(0.5 * t + vec4(0, 11, 33, 0)));
    vec3 v = p;
    for (d = 1.0; d < i; d += d)
      p += sin(p.yzx * d) / d;
    z += d = 0.2 * max(0.02 + abs(s = cos(p.y * 3.0)) / 7.0, length(v - clamp(v, -1.0, 1.0)));
    o += (cos(p.y / 0.5 + s + s - vec4(9, 4, 5, 0)) + 1.5) / d;
  }
  o = tanh(o * o / 2e8);
`);

// Roadway — @XorDev https://x.com/XorDev/status/1936894143029981434
const ROADWAY = twigl(`
  vec2 p = (FC.xy * 2.0 - r) / r.y / 0.1;
  o = tanh(0.4 / abs(min(p.y, p.y / 0.3) / cos(p.x + cos(p.x * 0.6 - t) + vec4(0, 0.3, 0.6, 1)) / sin(p.x * 0.4 - t)));
`);

// Digital Angel — @XorDev https://x.com/XorDev/status/1915101233989234999
const DIGITALANGEL = twigl(`
  float z = 0.0;
  float d = 0.0;
  float j;
  for (float i = 0.0; i++ < 5e1; o += (cos(z + vec4(0, 1, 2, 0)) + 1.1) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z += 6.0;
    p.xz *= mat2(cos(p.y * 0.5 + vec4(0, 33, 11, 0)));
    for (j = 1.0; j < 9.0; j /= 0.8)
      p += cos(ceil(p.yzx - t * vec3(3, 1, 0)) * j) / j;
    z += d = 0.01 + abs(length(p.xz) - 0.5) / 7.0;
  }
  o = tanh(o / 1e3);
`);

// Paradise — @XorDev https://x.com/XorDev/status/1957906463793328462
const PARADISE = twigl(`
  float z = 0.0;
  float f = 0.0;
  vec3 c = vec3(0.0);
  vec3 p = vec3(0.0);
  for (float i = 0.0; i++ < 1e2; p += c, z += f = length(cos(p / 6.0 + z) * 0.1 + sin(p.y / 9.0) * 0.4), o += (cos(c.y / z / 0.6 + vec4(6, 1, 2, 0)) + 1.1) * f * f) {
    p = z * (FC.rgb / 0.4 - r.xyy) / r.y;
    p.y = abs(p.y + 7.0);
    c = p;
    p.x *= f = 0.3;
    for (; f++ < 6.0; p += cos(p.yzx * f - t) / f);
  }
  o = tanh(o / 4e1 / length(c.xy / p.z + 0.3));
`);

// IGNITE — @XorDev https://x.com/XorDev/status/1953128872435745272
const IGNITE = twigl(`
  float z = 0.0;
  float d = 0.0;
  float f = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (3.0 + vec4(9, 4, f, 0)) * d / z / f) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z += 7.0;
    vec3 c = p;
    for (f = 1.0; f++ < 9.0; )
      c += sin(c.zxy * f + f + t) / f;
    f = 0.1 + length(c) + c.y;
    z += d = min(f, min(length(p.xz) + tanh(0.6 * p.y - 2.0), length(max(c = sin(p * 5.0), c.yzx) - 1.2 + p.x / 8.0))) / 6.0;
  }
  o = tanh(o * o / 2e2);
`);

// Lens — @XorDev https://x.com/XorDev/status/1936080043681120406
const LENS = twigl(`
  vec2 p = (FC.xy * 2.0 - r) / r.y;
  float l = 0.8 - length(p);
  o = tanh((3.0 + sin((p.x + p.y) * max(l / 0.1, 1.0 + l / 0.3) + t + vec4(0, 1, 2, 0))) * 0.2 * (0.1 / max(l, -l / 0.2) + 0.1 / length(p * l - 0.1)));
  o *= o;
`);

// Depth — @XorDev https://x.com/XorDev/status/1983553936159314148
const DEPTH = twigl(`
  vec3 p;
  vec3 v = vec3(1, 2, 1);
  float d = 0.0;
  float z = 0.0;
  for (float i = 0.0; i++ < 4e1; o += (cos(i / 4.0 + vec4(2, 1, 6, 0)) + 1.0) / d / d) {
    p = z * normalize(FC.rgb * 2.0 - r.xyy);
    d = abs(z - 3.0 + cos(t) / 0.7) / 2e1;
    z += d = 0.6 * max(d, length(abs(fract(p / v) - 0.5) * v - 0.1) - d);
  }
  o = tanh(o / 3e4);
`);

// Spinner — @XorDev https://x.com/XorDev/status/1942746323440062613
const SPINNER = twigl(`
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (cos(i * 0.4 + vec4(0, 1, 2, 0)) + 1.0) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    vec3 a = normalize(cos(vec3(0, 1, 4) + t - 0.4 * s - i / 1e2));
    p.z += 9.0;
    a = abs(a * dot(a, p) - cross(a, p));
    s = length(a);
    z += d = 0.1 * (abs(sin(s * 4.0 - t)) + a.y);
  }
  o = tanh(o / 1e3);
`);

// Facility — @XorDev https://x.com/XorDev/status/1934380431173947533
const FACILITY = twigl(`
  vec3 p;
  vec3 q;
  float z = 0.0;
  float d = 0.0;
  float i;
  for (float l = 0.0; l++ < 3e1; z += d, o += 0.1 * pow(d * d * exp(p.yyyy), vec4(0.7, 0.6, 0.5, 1))) {
    p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z -= t;
    p += 1.0;
    q = p;
    d = -9.0;
    for (i = 4.0; i > 0.01; i *= 0.3) {
      q = i * 0.7 - abs(mod(q + i, i + i) - i);
      d = max(d, min(min(q, q.y).x, q.z)) / (1.0 + z / 3e1);
      q.zy *= rotate2D(2.0);
    }
  }
  o = tanh(o * o);
`);

// Vortex — @XorDev https://x.com/XorDev/status/1930594981963505793
const VORTEX = twigl(`
  float z = fract(dot(FC, sin(FC)));
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (sin(z - t + vec4(6, 2, 4, 0)) + 1.5) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z += 6.0;
    for (d = 1.0; d < 9.0; d /= 0.8)
      p += cos(p.yzx * d - t) / d;
    z += d = 0.002 + abs(length(p) - 0.5) / 4e1;
  }
  o = tanh(o / 7e3);
`);

// Digital Vortex — @XorDev https://x.com/XorDev/status/1930633822715990114
const DIGITALVORTEX = twigl(`
  float z = fract(dot(FC, sin(FC)));
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; o += (sin(z - t + vec4(6, 2, 4, 0)) + 1.5) / d) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.z += 6.0;
    for (d = 1.0; d < 9.0; d /= 0.8)
      p += cos(ceil(p.yzx * d - t)) / d;
    z += d = 0.002 + abs(length(p) - 0.5) / 4e1;
  }
  o = tanh(o / 7e3);
`);

// Bits 2 — @XorDev https://x.com/XorDev/status/1930600792899125680
const BITS2 = twigl(`
  float z = 0.0;
  float d = 0.0;
  for (float i = 0.0; i++ < 1e2; ) {
    vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
    p.y += t;
    for (d = 0.6; d < 9.0; d /= 0.7)
      p += cos(round(p.zxy * d) - 0.5 * t) / d;
    z += d = 0.002 + abs(abs(p.z + 8.0) - 0.5) / 4e1;
    o += (sin(z + p.y + vec4(0, 1, 3, 0)) + 1.5) / d;
  }
  o = tanh(o / 9e3);
`);

// V2 — @XorDev https://x.com/XorDev/status/1880357157289501093
const V2 = twigl(`
  vec2 p = (FC.xy - r * 0.5) / r.y * mat2(8, -6, 6, 8);
  for (float i = 0.0; i < 50.0; o += (cos(sin(i) * vec4(1, 2, 3, 0)) + 1.0) * exp(sin(i + i * t * 0.1)) / length(max(p, p * vec2((3.0 + snoise2D(p + vec2(t / 0.1, i))) * 0.02, 0.5)))) {
    p += cos(++i * i + t * 0.2 + p.x * 0.02 + i * vec2(11, 9)) * 2.0;
  }
  o = tanh(0.01 * p.y * vec4(0, 1, 2, 3) + o * o / 1e4);
`);

export const BG_EFFECTS = [
  { id: 'sunset', label: 'Sunset', credit: 'https://www.shadertoy.com/view/Wf3SWn' },
  { id: 'orb', label: 'Orb', credit: 'https://x.com/XorDev/status/1953620412648014334' },
  { id: 'cyclone', label: 'Cyclone', credit: 'https://x.com/XorDev/status/2097409639054733531' },
  { id: 'heavenly', label: 'Heavenly', credit: 'https://x.com/XorDev/status/1917268381616534000' },
  { id: 'led', label: 'LED', credit: 'https://x.com/XorDev/status/1540071403185127426' },
  { id: 'topology', label: 'Topology', credit: 'https://x.com/XorDev/status/1903091482904478140' },
  { id: 'dispersion', label: 'Dispersion', credit: 'https://x.com/XorDev/status/1978091803262783504' },
  { id: 'paradise3', label: 'Paradise 3', credit: 'https://x.com/XorDev/status/1958193141573353887' },
  { id: 'graycloud', label: 'Graycloud', credit: 'https://x.com/XorDev/status/1918698128204517712' },
  { id: 'church1', label: 'Church1', credit: 'https://x.com/XorDev/status/1918756104785277081' },
  { id: 'gamma', label: 'Gamma', credit: 'https://x.com/XorDev/status/1938254250372374690' },
  { id: 'gradient4', label: 'Gradient4', credit: 'https://x.com/XorDev/status/1929554778893271246' },
  { id: 'frames', label: 'Frames', credit: 'https://x.com/XorDev/status/2016904976174317637' },
  { id: 'cloudcompute', label: 'Cloud Compute', credit: 'https://x.com/XorDev/status/1918680610127659112' },
  { id: 'radiant', label: 'Radiant', credit: 'https://x.com/XorDev/status/1947652770393153850' },
  { id: 'laserdance', label: 'Laser Dance', credit: 'https://x.com/XorDev/status/1923037860485075114' },
  { id: 'neutron', label: 'Neutron', credit: 'https://x.com/XorDev/status/1940496912718991572' },
  { id: 'particles', label: 'Particles', credit: 'https://x.com/XorDev/status/2018817870495641914' },
  { id: 'bloxels', label: 'Bloxels', credit: 'https://x.com/XorDev/status/1831732594846921030' },
  { id: 'juice', label: 'Juice', credit: 'https://x.com/XorDev/status/1943747695501320447' },
  { id: 'lapse', label: 'Lapse', credit: 'https://x.com/XorDev/status/1975230424982183956' },
  { id: 'launch', label: 'LAUNCH', credit: 'https://x.com/XorDev/status/1950699117367189854' },
  { id: 'quasar2', label: 'Quasar 2', credit: 'https://x.com/XorDev/status/1968828619435782446' },
  { id: 'port', label: 'Port', credit: 'https://x.com/XorDev/status/2021248551678849313' },
  { id: 'who', label: 'Who?', credit: 'https://x.com/XorDev/status/1915755845473706361' },
  { id: 'cube', label: 'CUBE', credit: 'https://x.com/XorDev/status/1920505484206895334' },
  { id: 'roadway', label: 'Roadway', credit: 'https://x.com/XorDev/status/1936894143029981434' },
  { id: 'digitalangel', label: 'Digital Angel', credit: 'https://x.com/XorDev/status/1915101233989234999' },
  { id: 'paradise', label: 'Paradise', credit: 'https://x.com/XorDev/status/1957906463793328462' },
  { id: 'ignite', label: 'IGNITE', credit: 'https://x.com/XorDev/status/1953128872435745272' },
  { id: 'lens', label: 'Lens', credit: 'https://x.com/XorDev/status/1936080043681120406' },
  { id: 'depth', label: 'Depth', credit: 'https://x.com/XorDev/status/1983553936159314148' },
  { id: 'spinner', label: 'Spinner', credit: 'https://x.com/XorDev/status/1942746323440062613' },
  { id: 'facility', label: 'Facility', credit: 'https://x.com/XorDev/status/1934380431173947533' },
  { id: 'vortex', label: 'Vortex', credit: 'https://x.com/XorDev/status/1930594981963505793' },
  { id: 'digitalvortex', label: 'Digital Vortex', credit: 'https://x.com/XorDev/status/1930633822715990114' },
  { id: 'bits2', label: 'Bits 2', credit: 'https://x.com/XorDev/status/1930600792899125680' },
  { id: 'v2', label: 'V2', credit: 'https://x.com/XorDev/status/1880357157289501093' },
] as const;

export type BgEffectId = (typeof BG_EFFECTS)[number]['id'];

const FRAGS: Record<BgEffectId, string> = {
  sunset: SUNSET,
  orb: ORB,
  cyclone: CYCLONE,
  heavenly: HEAVENLY,
  led: LED,
  topology: TOPOLOGY,
  dispersion: DISPERSION,
  paradise3: PARADISE3,
  graycloud: GRAYCLOUD,
  church1: CHURCH1,
  gamma: GAMMA,
  gradient4: GRADIENT4,
  frames: FRAMES,
  cloudcompute: CLOUDCOMPUTE,
  radiant: RADIANT,
  laserdance: LASERDANCE,
  neutron: NEUTRON,
  particles: PARTICLES,
  bloxels: BLOXELS,
  juice: JUICE,
  lapse: LAPSE,
  launch: LAUNCH,
  quasar2: QUASAR2,
  port: PORT,
  who: WHO,
  cube: CUBE,
  roadway: ROADWAY,
  digitalangel: DIGITALANGEL,
  paradise: PARADISE,
  ignite: IGNITE,
  lens: LENS,
  depth: DEPTH,
  spinner: SPINNER,
  facility: FACILITY,
  vortex: VORTEX,
  digitalvortex: DIGITALVORTEX,
  bits2: BITS2,
  v2: V2,
};

const FEEDBACK = new Set<BgEffectId>(['frames']);

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

function makeTarget(gl: WebGL2RenderingContext, w: number, h: number) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { tex, fbo };
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
    const backLoc = gl.getUniformLocation(program, 'b');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scale = reduced ? 0.4 : 0.55;
    const feedback = FEEDBACK.has(effect);
    let targets: { tex: WebGLTexture; fbo: WebGLFramebuffer }[] | null = null;
    let read = 0;
    let fboW = 0;
    let fboH = 0;
    let frame = 0;
    let running = true;
    let start = performance.now();

    const destroyTargets = () => {
      if (!targets) return;
      for (const item of targets) {
        gl.deleteTexture(item.tex);
        gl.deleteFramebuffer(item.fbo);
      }
      targets = null;
    };

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (feedback && (fboW !== w || fboH !== h)) {
        destroyTargets();
        targets = [makeTarget(gl, w, h), makeTarget(gl, w, h)];
        fboW = w;
        fboH = h;
        read = 0;
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      resize();
      const write = 1 - read;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform3f(resolutionLoc, canvas.width, canvas.height, 1);
      gl.uniform1f(timeLoc, reduced ? 8 : (now - start) / 1000);

      if (feedback && targets && backLoc) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, targets[write].fbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, targets[read].tex);
        gl.uniform1i(backLoc, 0);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (feedback && targets) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, targets[write].fbo);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        gl.blitFramebuffer(
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height,
          gl.COLOR_BUFFER_BIT,
          gl.NEAREST,
        );
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        read = write;
      }

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
      destroyTargets();
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
