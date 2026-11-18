import { jsxs as Pt, jsx as ft } from "react/jsx-runtime";
import { forwardRef as ue, useRef as st, useState as fe, useImperativeHandle as de, useLayoutEffect as me, useEffect as pe } from "react";
const ct = {
  colorful: {
    colors: [[255, 201, 21], [126, 196, 255], [180, 40, 230], [235, 100, 160], [255, 176, 122], [154, 160, 255], [127, 217, 238]],
    ahead: [255, 122, 182],
    behind: [90, 190, 255]
  },
  green: {
    colors: [[53, 186, 0], [140, 235, 90], [0, 196, 110], [190, 250, 130], [40, 160, 60], [110, 225, 160], [90, 210, 40]],
    ahead: [196, 255, 120],
    behind: [0, 150, 70]
  },
  ocean: {
    colors: [[40, 120, 255], [90, 200, 255], [20, 80, 200], [120, 230, 240], [60, 150, 255], [150, 180, 255], [0, 180, 220]],
    ahead: [150, 230, 255],
    behind: [30, 70, 220]
  },
  sunset: {
    colors: [[255, 140, 60], [255, 90, 120], [255, 200, 80], [240, 70, 90], [255, 170, 120], [220, 90, 200], [255, 120, 80]],
    ahead: [255, 220, 120],
    behind: [200, 60, 160]
  },
  mono: {
    colors: [[240, 240, 245], [200, 205, 215], [255, 255, 255], [170, 175, 190], [225, 228, 235], [190, 195, 205], [245, 245, 250]],
    ahead: [255, 255, 255],
    behind: [160, 165, 180]
  }
}, nt = (s, t, e) => [s[0] + (t[0] - s[0]) * e, s[1] + (t[1] - s[1]) * e, s[2] + (t[2] - s[2]) * e];
function ge(s) {
  return {
    colors: [s, nt(s, [255, 255, 255], 0.25), s, nt(s, [0, 0, 0], 0.15)],
    ahead: nt(s, [255, 255, 255], 0.45),
    behind: nt(s, [0, 0, 0], 0.3)
  };
}
function ve(s) {
  const t = parseInt(s.replace("#", ""), 16);
  return [t >> 16 & 255, t >> 8 & 255, t & 255];
}
function $i(s) {
  return "#" + s.map((t) => Math.round(t).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function Ct(s) {
  const t = {
    type: s,
    anticipation: 0.5,
    travel: 2.28,
    launchGap: 0,
    linger: -0.35,
    rimFade: 3.03,
    returnSpeed: 1.45,
    pull: 24,
    inhale: 56,
    gatherGlow: 0.33,
    gatherDots: 1,
    amplitude: 34,
    lensWidth: 150,
    aberration: 0.78,
    swell: 22,
    blur: 18,
    blurAhead: 90,
    blurBehind: 240,
    lead: 130,
    tail: 300,
    strength: 0.92,
    rimWidth: 14,
    rimUnevenness: 1,
    rimStrength: 0.82,
    rimSoftness: 343,
    cornerRadius: 62,
    rimPulse: 0.6,
    hairlineWidth: 1.5,
    hairlineOpacity: 0.9,
    hairlineWhite: 0.95,
    hairlineLinger: 0.47,
    hairlineFade: 3,
    orientation: 0.5,
    particleCount: 64,
    particleSize: 1.8,
    particleReach: 150,
    particleFlight: 30,
    particleGap: 24,
    particleLife: 2.19,
    particleSpread: 1,
    palette: ct.colorful
  };
  return s !== "center" ? t : {
    ...t,
    anticipation: 0.25,
    travel: 3.43,
    rimFade: 2.51,
    hairlineLinger: 0.96,
    strength: 0.6,
    rimStrength: 0.6,
    aberration: 0,
    gatherGlow: 0,
    gatherDots: 0,
    particleCount: 89,
    particleLife: 3.93,
    particleSpread: 0.64,
    palette: ct.green,
    cornerRadius: 48,
    pull: 14.4,
    inhale: 33.6,
    amplitude: 20.4,
    lensWidth: 90,
    swell: 13.2,
    blur: 10.8,
    blurAhead: 54,
    blurBehind: 144,
    lead: 78,
    tail: 180,
    rimSoftness: 205.8,
    particleReach: 90,
    particleFlight: 18,
    particleGap: 11
  };
}
function tt(s) {
  return s.anticipation + Math.max(s.travel * 0.6, s.linger + s.rimFade, s.linger + s.hairlineLinger + s.hairlineFade, s.particleLife);
}
function ut(s, t, e, i) {
  const n = (o, a, l) => {
    const r = 1 - o;
    return 3 * r * r * o * a + 3 * r * o * o * l + o * o * o;
  };
  return (o) => {
    if (o <= 0) return 0;
    if (o >= 1) return 1;
    let a = 0, l = 1;
    for (let r = 0; r < 24; r++) {
      const c = (a + l) / 2;
      n(c, s, e) < o ? a = c : l = c;
    }
    return n((a + l) / 2, t, i);
  };
}
const Zt = ut(0.22, 1, 0.36, 1);
let J = [0.22, 1, 0.36, 1], _t = Zt;
function we(s) {
  const t = s.easeX1 ?? 0.22, e = s.easeY1 ?? 1, i = s.easeX2 ?? 0.36, n = s.easeY2 ?? 1;
  return t === 0.22 && e === 1 && i === 0.36 && n === 1 ? Zt : ((t !== J[0] || e !== J[1] || i !== J[2] || n !== J[3]) && (J = [t, e, i, n], _t = ut(Math.min(Math.max(t, 0), 1), e, Math.min(Math.max(i, 0), 1), n)), _t);
}
const $t = ut(0.42, 0, 0.58, 1), I = (s, t, e) => {
  const i = Math.min(Math.max((e - s) / (t - s), 0), 1);
  return i * i * (3 - 2 * i);
};
function yt() {
  return {
    ox: 0,
    oy: 0,
    tilt: 0,
    spine: 0,
    radius: 0,
    moved: 0,
    squash: 1,
    time: 0,
    energy: 0,
    swell: 0,
    width: 0,
    height: 0,
    gravity: 0,
    glow: 0,
    clearRadius: 0,
    hairClearRadius: 0,
    rim: 0,
    sparkle: 0,
    flying: 0,
    launched: !1,
    hasCleared: !1,
    ring: !1,
    sideways: !1,
    hold: 0
  };
}
const Qt = 60, be = 1.4, ye = 0.22, xe = 0.5, Re = 100, Ee = 0.45, Ae = 0.2, Se = 0.55;
function dt(s, t, e, i, n, o, a) {
  const l = tt(n), r = Math.min(Math.max(s, 0), 1) * l, c = r - n.anticipation, u = I(0, Math.max(n.anticipation, 1e-3), r), h = Math.min(Math.max(c / n.travel, 0), 1), f = we(n)(h), w = n.type === "center", x = n.type === "horizontal", d = w ? 1 : be, v = t.x + t.w / 2, g = t.y + t.h / 2, A = Math.min(t.w, t.h) / 2, b = x ? t.h : t.w, m = w ? 0 : Math.max(0, b / 2 - A), y = x ? Math.PI / 2 : 0, C = Math.cos(y), _ = Math.sin(y);
  let F = 0;
  if (!w && o) {
    const q = x ? o.y - g : o.x - v;
    F = Math.min(Math.max(q / Math.max(b / 2, 1), -1), 1);
  }
  const k = F * b / 2 * n.orientation, L = F * n.orientation * Ee, z = y + L, B = I(0, 0.45, f), S = Math.cos(z), M = Math.sin(z);
  let O = 0;
  for (let q = 0; q < 4; q++) {
    const Q = (q & 1 ? e : 0) - v - k * C, Lt = (q & 2 ? i : 0) - g - k * _;
    O = Math.max(O, Math.hypot((S * Q + M * Lt) * d, -M * Q + S * Lt));
  }
  const N = O + (n.swell + Qt) * d, p = 1 - I(Ae, Se, h), R = A + Math.max(n.launchGap, 0), T = c < 0 ? R + n.inhale * (1 - u) : R + (N + Re - R) * f, $ = Math.min(xe * Math.max(n.gatherGlow, 0), 1), P = A - n.rimSoftness, D = O + (n.rimSoftness + n.swell) * d, E = a ?? yt(), j = I(0, 0.1, f);
  return E.ox = v + k * j * C, E.oy = g + k * j * _, E.tilt = y + L * j, E.spine = m * (1 - B), E.radius = T, E.moved = f, E.squash = 1 + (d - 1) * I(0, 0.5, f), E.time = r, E.energy = I(0, 0.05, h) * p, E.swell = n.swell * I(0, 0.3, f), E.width = e, E.height = i, E.gravity = n.pull * u * (1 - I(0, ye, c)), E.glow = c < 0 ? $ * u : ($ + (1 - $) * I(0, 0.07, h)) * p, E.clearRadius = P + (D - P) * $t((c - n.linger) / Math.max(n.rimFade, 0.01)), E.hairClearRadius = P + (D - P) * $t((c - n.linger - n.hairlineLinger) / Math.max(n.hairlineFade, 0.01)), E.rim = n.rimStrength * I(0, 0.1, h) * (1 - I(0.9, 1, r / l)), E.sparkle = I(0, Math.max(n.anticipation, 1e-3) * 0.35, r), E.flying = Math.max(c, 0), E.launched = c > 0, E.hasCleared = T > N, E.ring = w, E.sideways = x, E.hold = w ? A : 0, E;
}
const Y = 7, Te = new Float32Array(Y * 3), mt = (s, t, e) => {
  const i = Math.sin(s * t + e) * 43758.5453;
  return i - Math.floor(i);
};
function Dt(s, t, e, i, n) {
  const o = Math.max(t / 2 - i, 0), a = Math.max(e / 2 - i, 0), l = 4 * (o + a + 0.5 * Math.PI * i), r = Te;
  for (let c = 0; c < Y; c++) {
    const u = mt(c, 12.9898, 1.3), h = mt(c, 78.233, 4.1), f = mt(c, 39.425, 2.7), w = l * (c + 0.35 * u) / Y + s * (-22 + 44 * h) * (1 + 2 * n), x = l / Y * (0.2 + 0.25 * f), d = (0.25 + 0.3 * n) * Math.sin(s * (1.1 + 1.2 * u) * (1 + n) + c * 2.4);
    r[c * 3] = w, r[c * 3 + 1] = x, r[c * 3 + 2] = (0.2 + 2.6 * h) * (1 + d);
  }
  return r;
}
const ke = 0.22, Me = 0.3, rt = (s, t, e) => {
  const i = Math.sin(s * 12.9898 + t * 78.233 + e * 37.719) * 43758.5453;
  return i - Math.floor(i);
};
function Fe(s) {
  const t = [];
  for (let e = 0; e < Math.round(s.particleCount); e++) {
    const i = e + 1, n = (a) => i * a % 1, o = n(0.5497004779);
    t.push({
      index: i,
      column: (n(0.7548776662) * 2 - 1) * 0.92,
      heading: n(0.7548776662) * 2 * Math.PI,
      pace: 0.35 + 0.72 * Math.sqrt(n(0.8191725134)),
      drift: 15 + 50 * n(0.6710436067),
      sway: 3 + 11 * n(0.4142135624),
      swayRate: 2.5 + 3.5 * n(0.7320508076),
      twinkleRate: 8 + 12 * n(0.2360679775),
      phase: n(0.6180339887) * 2 * Math.PI,
      life: s.particleLife * (0.4 + 0.6 * n(0.6457513111)),
      size: s.particleSize * (0.55 + 0.45 * o * o),
      brightness: 0.3 + 0.7 * n(0.6055512755),
      hop: 0.16 + 0.14 * n(0.1231056256),
      hopOffset: n(0.472135955)
    });
  }
  return t;
}
function Le(s, t, e, i, n = { x: 0, y: 0, a: 0 }) {
  const o = 0.5 + 0.5 * Math.sin(t.time * s.twinkleRate + s.phase), a = s.brightness * (0.7 + 0.3 * o), l = Math.min(Math.max(i.particleSpread, 0), 1), r = e.x + e.w / 2, c = e.y + e.h / 2;
  if (!t.launched) {
    const b = t.time / s.hop + s.hopOffset, m = Math.floor(b), y = b - m, C = I(0, 0.25, y) * (1 - I(0.55, 1, y)), _ = 1 - I(i.anticipation * 0.75, i.anticipation, t.time), F = t.sparkle * C * _ * a * i.gatherDots;
    if (t.ring) {
      const E = rt(s.index, m, 1) * 2 * Math.PI, j = Math.min(e.w, e.h) / 2 + i.particleGap + i.particleFlight, Q = j + Math.max(i.particleReach - j, 0) * rt(s.index, m, 2) - i.particleFlight * y * y;
      return n.x = r + Math.cos(E) * Q, n.y = c + Math.sin(E) * Q, n.a = F, n;
    }
    const k = (t.sideways ? e.h : e.w) / 2, L = (t.sideways ? e.w : e.h) / 2, z = (rt(s.index, m, 1) * 2 - 1) * (k + 24), B = i.particleGap + i.particleFlight, S = B + Math.max(i.particleReach - B, 0) * rt(s.index, m, 2), M = Math.min(e.w, e.h) / 2, O = L + S, N = Math.min(Math.max(z, -k + M), k - M), p = t.sideways ? r + O : r + z, R = t.sideways ? c + z : c - O, T = (t.sideways ? r + L : r + N) - p, $ = (t.sideways ? c + N : c - L) - R, P = Math.max(Math.hypot(T, $), 1), D = i.particleFlight * y * y;
    return n.x = p + T / P * D, n.y = R + $ / P * D, n.a = F, n;
  }
  const h = (1 - I(s.life * 0.55, s.life, t.flying)) * a, f = s.sway * Math.sin(s.swayRate * t.flying + s.phase) * Math.min(t.flying / 0.25, 1);
  if (t.ring) {
    const b = Math.min(e.w, e.h) / 2, m = b + ((t.radius - b) * s.pace + s.drift * t.flying) * l, y = Math.cos(s.heading), C = Math.sin(s.heading);
    return n.x = t.ox + y * m - C * f, n.y = t.oy + C * m + y * f, n.a = h, n;
  }
  const w = Math.min(e.w, e.h) / 2, x = 1 + ke * t.moved * s.pace * l, d = s.column * (t.sideways ? e.h : e.w) / 2 * x + f, v = (w + (t.radius - w) * s.pace * l) * (1 - Me * s.column * s.column) + s.drift * t.flying * l, g = Math.cos(t.tilt), A = Math.sin(t.tilt);
  return n.x = t.ox + g * d + A * v, n.y = t.oy + A * d - g * v, n.a = h, n;
}
function pt(s) {
  const t = (r) => {
    const c = r / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }, [e, i, n] = [t(s[0]), t(s[1]), t(s[2])], o = Math.cbrt(0.4122214708 * e + 0.5363325363 * i + 0.0514459929 * n), a = Math.cbrt(0.2119034982 * e + 0.6806995451 * i + 0.1073969566 * n), l = Math.cbrt(0.0883024619 * e + 0.2817188376 * i + 0.6299787005 * n);
  return [
    0.2104542553 * o + 0.793617785 * a - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * a + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * a - 0.808675766 * l
  ];
}
const gt = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`, Pe = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uStep;
uniform float uSigma;
out vec4 outColor;
void main() {
  float r = ceil(uSigma * 3.0);
  vec4 acc = vec4(0.0);
  float wsum = 0.0;
  for (float i = -48.0; i <= 48.0; i += 1.0) {
    if (abs(i) > r) continue;
    float w = exp(-0.5 * i * i / (uSigma * uSigma));
    acc += texture(uTex, vUv + uStep * i) * w;
    wsum += w;
  }
  outColor = acc / wsum;
}`, Ce = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uLod;
out vec4 outColor;
void main() { outColor = textureLod(uTex, vUv, uLod); }`, _e = `#version 300 es
precision highp float;
uniform vec2 uSize;
uniform vec2 uPx;
uniform float uF[19];
uniform sampler2D uC0;
uniform sampler2D uC1;
uniform sampler2D uC2;
uniform sampler2D uR0;
uniform sampler2D uR1;
uniform sampler2D uR2;
uniform int uContent;
uniform int uRevealed;
uniform int uLens;
uniform int uLive;
uniform int uSame;
uniform int uRound;
uniform float uFloor;
uniform float uAmplitude;
uniform float uLensWidth;
uniform float uAberration;
uniform float uBlur;
uniform float uBlurAhead;
uniform float uBlurBehind;
uniform float uNear;
uniform vec3 uPal[9];
uniform int uPalCount;
uniform vec3 uAhead;
uniform vec3 uBehind;
uniform float uLead;
uniform float uTail;
uniform float uStrength;
uniform float uRimWidth;
uniform float uRimSoftness;
uniform float uCorner;
uniform float uUneven;
uniform float uPulse;
uniform float uHairW;
uniform float uHairO;
uniform float uHairWhite;
uniform vec3 uLumps[${Y}];
out vec4 outColor;

const float coverZone = ${Qt.toFixed(1)};
const float PI = 3.14159265;

struct Field { float d; vec2 n; vec2 q; vec2 raw; float g; };

float heldAt(vec2 p) {
  if (uF[16] <= 0.0) return 1.0;
  return smoothstep(uF[16] * 0.9, uF[16] * 1.8, length(p - vec2(uF[0], uF[1])));
}

Field fieldAt(vec2 p) {
  vec2 raw = p - vec2(uF[0], uF[1]);
  float cs = cos(uF[14]), sn = sin(uF[14]);
  vec2 q = vec2(cs * raw.x + sn * raw.y, -sn * raw.x + cs * raw.y);
  float spine = uF[2], radius = uF[3], squash = uF[4], time = uF[5], swell = uF[7];
  float mx = q.x * squash;
  vec2 v = vec2(max(abs(mx) - spine, 0.0), q.y);
  float l = max(length(v), 1e-3);
  vec2 grad = vec2(v.x * sign(q.x) * squash, v.y) / l;
  float g = max(length(grad), 1e-3);
  float bend;
  if (uF[15] > 0.5) {
    float a = atan(q.y, q.x);
    bend = 0.62 * sin(2.0 * a + time * 1.1) + 0.38 * sin(3.0 * a - time * 1.5 + 1.7);
  } else {
    float s = mx * 0.0058;
    bend = 0.62 * sin(s + time * 1.1) + 0.38 * sin(s * 2.1 - time * 1.5 + 1.7);
  }
  vec2 n = grad / g;
  Field o;
  o.d = (l - radius) / g + swell * bend;
  o.n = vec2(cs * n.x - sn * n.y, sn * n.x + cs * n.y);
  o.q = q;
  o.raw = raw;
  o.g = g;
  return o;
}

/* The progressive blur, as the stacked blurred copies: near over sharp, far
   over that, each taking over where the last ends.

   Every read names its level. These calls sit inside branches that differ
   from one pixel to the next, where the derivatives a plain texture() picks
   its mip level from are undefined: along each branch's boundary it would
   read a far smaller level, and draw the boundary as a thin dotted line. */
vec3 side(sampler2D a, sampler2D b, sampler2D c, vec2 s, float tn, float tf) {
  vec2 uv = clamp(s, vec2(0.5), uSize - 0.5) / uSize;
  vec3 col = textureLod(a, uv, 0.0).rgb;
  if (tn > 0.0) col = mix(col, textureLod(b, uv, 0.0).rgb, tn);
  if (tf > 0.0) col = mix(col, textureLod(c, uv, 0.0).rgb, tf);
  return col;
}

const vec3 spectrum[5] = vec3[5](
  vec3(0.571, 0.0, 0.0), vec3(0.343, 0.206, 0.0), vec3(0.086, 0.588, 0.086), vec3(0.0, 0.206, 0.343), vec3(0.0, 0.0, 0.571)
);

vec3 lensed(int which, vec2 s, vec2 split, float tn, float tf) {
  if (dot(split, split) < 0.0625) {
    return which == 0 ? side(uC0, uC1, uC2, s, tn, tf) : side(uR0, uR1, uR2, s, tn, tf);
  }
  vec3 o = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float along = float(i) / 4.0 * 2.0 - 1.0;
    vec3 c = which == 0 ? side(uC0, uC1, uC2, s + split * along, tn, tf) : side(uR0, uR1, uR2, s + split * along, tn, tf);
    o += c * spectrum[i];
  }
  return o;
}

float continuousRectSDF(vec2 p, vec2 halfSize, float radius) {
  float a = min(radius * 1.528665, min(halfSize.x, halfSize.y));
  vec2 q = abs(p) - (halfSize - a);
  if (q.x <= 0.0 || q.y <= 0.0) return max(abs(p.x) - halfSize.x, abs(p.y) - halfSize.y);
  const float n = 3.26;
  vec2 u = q / a;
  float norm = pow(pow(u.x, n) + pow(u.y, n), 1.0 / n);
  vec2 gg = pow(u / max(norm, 1e-4), vec2(n - 1.0));
  return (norm - 1.0) * a / max(length(gg), 1e-3);
}

/* The area's edge: the continuous corners of an iOS screen, or the circular
   ones CSS draws. */
float edgeSDF(vec2 p, vec2 halfSize, float radius) {
  if (uRound == 0) return continuousRectSDF(p, halfSize, radius);
  float r = min(radius, min(halfSize.x, halfSize.y));
  vec2 q = abs(p) - (halfSize - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec2 perimeterAt(vec2 p, vec2 halfSize, float r) {
  float ex = max(halfSize.x - r, 0.0);
  float ey = max(halfSize.y - r, 0.0);
  float arc = 0.5 * PI * r;
  float P = 4.0 * (ex + ey + arc);
  float ax = abs(p.x), ay = abs(p.y);
  if (ax > ex && ay > ey) {
    vec2 v = p - vec2(sign(p.x) * ex, sign(p.y) * ey);
    float a, base;
    if (p.x >= 0.0 && p.y < 0.0) { a = atan(v.x, -v.y); base = ex; }
    else if (p.x >= 0.0) { a = atan(v.y, v.x); base = ex + arc + 2.0 * ey; }
    else if (p.y >= 0.0) { a = atan(-v.x, v.y); base = 3.0 * ex + 2.0 * arc + 2.0 * ey; }
    else { a = atan(-v.y, -v.x); base = 3.0 * ex + 3.0 * arc + 4.0 * ey; }
    return vec2(base + r * clamp(a, 0.0, 0.5 * PI), P);
  }
  bool sideHit = ax > ex ? true : (ay > ey ? false : (halfSize.x - ax) < (halfSize.y - ay));
  if (sideHit) return vec2(p.x >= 0.0 ? ex + arc + (p.y + ey) : 3.0 * ex + 3.0 * arc + 2.0 * ey + (ey - p.y), P);
  return vec2(p.y < 0.0 ? (p.x >= 0.0 ? p.x : P + p.x) : ex + 2.0 * arc + 2.0 * ey + (ex - p.x), P);
}

float rimThickness(float s, float P) {
  float t = 0.08;
  for (int i = 0; i < ${Y}; i++) {
    float ds = s - uLumps[i].x;
    ds -= P * floor(ds / P + 0.5);
    float k = ds / uLumps[i].y;
    t += uLumps[i].z * exp(-k * k);
  }
  return t / 1.0498;
}

float dither(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))) - 0.5; }

vec3 paletteAt(float u) {
  float x = fract(u) * float(uPalCount);
  int i = min(int(x), uPalCount - 1);
  int j = i + 1 == uPalCount ? 0 : i + 1;
  float m = fract(x);
  m = m * m * (3.0 - 2.0 * m);
  return mix(uPal[i], uPal[j], m);
}

vec3 oklabToSRGB(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  vec3 lin = clamp(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0, 1.0);
  return mix(12.92 * lin, 1.055 * pow(lin, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), lin));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uPx.y - gl_FragCoord.y) * (uSize.x / uPx.x);

  if (uLive == 0) {
    outColor = vec4(uRevealed == 1 ? textureLod(uR0, p / uSize, 0.0).rgb : textureLod(uC0, p / uSize, 0.0).rgb, 1.0);
    return;
  }

  Field w = fieldAt(p);
  float energy = uF[6], gravity = uF[10];
  float held = heldAt(p);

  // ─── The two screens, through the swell (waveLens) ───
  vec2 s = p;
  vec2 split = vec2(0.0);
  if (uLens == 1) {
    float u = w.d / (uLensWidth * (w.d > 0.0 ? 0.85 : 1.5));
    float lift = exp(-u * u);
    float r = max(length(w.raw), 1.0);
    vec2 swollen = w.n * energy * uAmplitude * lift * held;
    vec2 inward = w.raw / r;
    s = p - swollen + inward * gravity * exp(-r / 900.0) * held;
    split = (swollen - inward * gravity * exp(-r / 240.0) * held) * uAberration;
  }
  // The progressive blur, read where the pixel is (waveBlurMask).
  float bu = w.d / (w.d > 0.0 ? uBlurAhead : uBlurBehind);
  float radius = energy * uBlur * exp(-bu * bu) * held;
  float tn = clamp(radius / max(uNear, 1e-3), 0.0, 1.0);
  tn = tn * tn * (3.0 - 2.0 * tn);
  float tf = clamp((radius - uNear) / max(uBlur - uNear, 1e-3), 0.0, 1.0);
  tf = tf * tf * (3.0 - 2.0 * tf);

  float cover = 1.0;
  if (uContent == 1 && uF[17] > 0.5) cover = smoothstep(-coverZone, coverZone, w.d);
  if (uContent == 0) cover = 0.0;

  // How much of this pixel the canvas owns. All of it when opaque; over a
  // page, only what the wave changes: where the lens moves, splits or blurs
  // the screen, and where the revealed screen has taken over from the
  // content the page is still showing. Each reaches 1 well before its
  // effect can be seen, so the hand-over to the page has no seam.
  float own = uFloor;
  if (own < 1.0) {
    float moved = max(smoothstep(0.03, 0.4, length(s - p)), smoothstep(0.03, 0.4, length(split)));
    own = max(own, max(moved, smoothstep(0.0, 0.6, radius)));
    if (uSame == 0 && uContent == 1) own = max(own, 1.0 - smoothstep(0.9, 1.0, cover));
  }

  vec3 col = vec3(0.0);
  if (own > 0.0) {
    if (uSame == 1) {
      col = lensed(0, s, split, tn, tf);
    } else {
      bool showRevealed = uRevealed == 1 && w.d <= coverZone + 6.0 && cover < 1.0;
      if (showRevealed) col = lensed(1, s, split, tn, tf);
      if (cover > 0.0) col = mix(col, lensed(0, s, split, tn, tf), cover);
    }
  }

  // ─── The colour (waveBand) ───
  float d = w.d, time = uF[5], glow = uF[11], rim = uF[13];
  vec2 c = p - uSize * 0.5;
  float inset = max(-edgeSDF(c, uSize * 0.5, uCorner), 0.0);
  bool nearEdge = rim > 0.0 && inset < max(uRimWidth * 2.2 * (1.0 + 1.9 * uUneven), uHairW * 0.5 + 0.75);
  if (glow <= 0.0 && !nearEdge) {
    outColor = vec4((col + dither(gl_FragCoord.xy) / 255.0) * own, own);
    return;
  }
  bool ring = uF[15] > 0.5;
  float turn = atan(w.q.y, w.q.x);
  float along = w.q.x * 0.0068;
  float lobes = ring
    ? 0.5 + 0.5 * sin(2.0 * turn + time * 1.4) * cos(turn - time * 0.7 + 1.2)
    : 0.5 + 0.5 * sin(along * 1.3 + time * 1.4) * cos(along * 0.6 - time * 0.7 + 1.2);
  float bandA = 0.0;
  if (glow > 0.0 && d < uLead) {
    if (d >= 0.0) {
      float k = 1.0 - d / uLead;
      bandA = k * k * k * (k * (k * 6.0 - 15.0) + 10.0);
    } else {
      bandA = pow(1.0 - clamp(-d / (uTail * mix(0.6, 1.3, lobes)), 0.0, 1.0), 2.3);
    }
    bandA *= glow * uStrength * mix(0.6, 1.0, exp(-inset / 140.0)) * held;
  }
  float aroundA = atan(c.y / uSize.y, c.x / uSize.x);
  float rimA = 0.0;
  float hairA = 0.0;
  float shimmer = 0.5;
  if (nearEdge) {
    vec2 edge = perimeterAt(c, uSize * 0.5, uCorner);
    float thickness = 1.0;
    if (uUneven > 0.0) thickness = max(1.0 + (rimThickness(edge.x, edge.y) - 1.0) * uUneven, 0.04);
    float hk = inset / (uRimWidth * thickness);
    float hug = exp(-hk * hk);
    float reached = 1.0 - smoothstep(-uLead * 0.7, uLead * 0.5, d);
    float kept = smoothstep(-uRimSoftness, uRimSoftness, d + (uF[3] - uF[12]) / w.g);
    shimmer = 0.5 + 0.5 * sin(time * 3.4 - edge.x / edge.y * 4.0 * PI);
    rimA = hug * reached * kept * rim * mix(1.0, 0.7 + 0.3 * shimmer, uPulse);
    if (uHairW > 0.0) {
      float line = 1.0 - smoothstep(uHairW * 0.5, uHairW * 0.5 + 0.75, inset);
      float hairKept = smoothstep(-uRimSoftness, uRimSoftness, d + (uF[3] - uF[18]) / w.g);
      hairA = line * reached * hairKept * rim * uHairO
        * mix(0.5, 1.0, smoothstep(0.1, 1.5, thickness))
        * mix(1.0, 0.55 + 0.45 * shimmer, uPulse);
    }
  }
  float a = 1.0 - (1.0 - bandA) * (1.0 - rimA);
  float total = 1.0 - (1.0 - a) * (1.0 - hairA);
  if (total <= 0.0005) {
    outColor = vec4((col + dither(gl_FragCoord.xy) / 255.0) * own, own);
    return;
  }
  float flow = 0.62 + (ring ? turn / (2.0 * PI) : along * 0.2) + time * 0.13 + d * 0.0015 + (ring ? 0.0 : 0.05 * sin(w.q.y * 0.009 + time));
  vec3 lab = paletteAt(flow);
  lab = mix(lab, uAhead, 0.5 * exp(-pow((d - 30.0) / 50.0, 2.0)));
  lab = mix(lab, uBehind, 0.5 * exp(-pow((d + 84.0) / 72.0, 2.0)));
  lab.yz *= 1.22;
  lab = mix(lab, vec3(0.99, 0.0, 0.0), 0.7 * exp(-pow((d + 8.0) / 26.0, 2.0)));
  vec3 rimLab = paletteAt(aroundA / (2.0 * PI) + time * (0.12 + 0.25 * uPulse) + inset * 0.0012);
  rimLab.yz *= 1.1;
  lab = mix(lab, rimLab, rimA / (rimA + bandA + 1e-4));
  vec3 rgb = oklabToSRGB(lab);
  if (hairA > 0.0) {
    vec3 hair = mix(oklabToSRGB(rimLab), vec3(1.0), uHairWhite * (0.5 + 0.5 * shimmer));
    rgb = (rgb * a * (1.0 - hairA) + hair * hairA) / total;
  }
  float noise = dither(gl_FragCoord.xy) * 2.0 / 255.0;
  // The colour over the screens, as the band view over the transition —
  // premultiplied, so it lies as well over the page where the canvas is clear.
  float over = clamp(total + noise, 0.0, 1.0);
  outColor = vec4(col * own * (1.0 - over) + clamp(rgb + noise, 0.0, 1.0) * over, 1.0 - (1.0 - own) * (1.0 - over));
}`, $e = `#version 300 es
in vec3 aDot;
uniform vec2 uSize;
uniform float uPoint;
out float vA;
void main() {
  vec2 clip = vec2(aDot.x / uSize.x * 2.0 - 1.0, 1.0 - aDot.y / uSize.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = uPoint;
  vA = aDot.z;
}`, De = `#version 300 es
precision highp float;
in float vA;
uniform float uScale;
uniform float uPoint;
out vec4 outColor;
void main() {
  float a = fract(vA);
  float size = floor(vA) / 10.0;
  float r = length(gl_PointCoord - 0.5) * uPoint;
  float edge = size * uScale * 0.5;
  float cov = clamp(edge - r + 0.5, 0.0, 1.0);
  outColor = vec4(vec3(1.0) * a * cov, a * cov);
}`;
function It(s, t, e) {
  const i = s.createShader(t);
  if (s.shaderSource(i, e), s.compileShader(i), !s.getShaderParameter(i, s.COMPILE_STATUS))
    throw new Error(`${t === s.VERTEX_SHADER ? "vertex" : "fragment"} shader: ${s.isContextLost() ? "context lost" : s.getShaderInfoLog(i)}`);
  return i;
}
function ot(s, t, e) {
  const i = s.createProgram();
  if (s.attachShader(i, It(s, s.VERTEX_SHADER, t)), s.attachShader(i, It(s, s.FRAGMENT_SHADER, e)), s.bindAttribLocation(i, 0, "aPos"), s.bindAttribLocation(i, 0, "aDot"), s.linkProgram(i), !s.getProgramParameter(i, s.LINK_STATUS)) throw new Error(s.getProgramInfoLog(i) || "link");
  const n = /* @__PURE__ */ new Map();
  return { p: i, loc: (a) => (n.has(a) || n.set(a, s.getUniformLocation(i, a)), n.get(a)) };
}
const Ie = ["uC0", "uC1", "uC2", "uR0", "uR1", "uR2"], H = 7;
function zt(s) {
  const t = s;
  return {
    w: t.naturalWidth || t.videoWidth || t.displayWidth || t.width || 1,
    h: t.naturalHeight || t.videoHeight || t.displayHeight || t.height || 1
  };
}
class Bt {
  constructor(t, e = {}) {
    this.canvas = t, this.screens = { content: null, revealed: null }, this.blank = null, this.sizePt = { w: 1, h: 1 }, this.farBlur = -1, this.field = new Float32Array(19), this.dotsSize = 0, this.pal = new Float32Array(27), this.palKey = null, this.ahead = new Float32Array(3), this.behind = new Float32Array(3), this.scratches = /* @__PURE__ */ new Map(), this.alpha = !!e.alpha;
    const i = t.getContext("webgl2", {
      antialias: !1,
      premultipliedAlpha: !0,
      alpha: this.alpha,
      depth: !1,
      stencil: !1,
      preserveDrawingBuffer: !1
    });
    if (this.ok = !!i, this.gl = i, !i) {
      this.quad = this.dots = null, this.main = this.blur = this.copy = this.dot = null;
      return;
    }
    this.main = ot(i, gt, _e), this.blur = ot(i, gt, Pe), this.copy = ot(i, gt, Ce), this.dot = ot(i, $e, De), this.quad = i.createBuffer(), i.bindBuffer(i.ARRAY_BUFFER, this.quad), i.bufferData(i.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), i.STATIC_DRAW), this.dots = i.createBuffer();
  }
  /** True once the browser has taken the context away; make a new renderer
      on the canvas when `webglcontextrestored` fires. */
  get lost() {
    return !this.ok || this.gl.isContextLost();
  }
  /** The largest picture a screen can hold, per side, in pixels. */
  get maxTextureSize() {
    return this.ok ? this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE) : 0;
  }
  /** Whether a screen has been given for this slot. */
  has(t) {
    return !!this.screens[t];
  }
  texture(t, e, i, n = !1) {
    const o = this.gl, a = o.createTexture();
    return o.bindTexture(o.TEXTURE_2D, a), o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), i ? o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, o.RGBA, o.UNSIGNED_BYTE, i) : o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, t, e, 0, o.RGBA, o.UNSIGNED_BYTE, null), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, n ? o.LINEAR_MIPMAP_LINEAR : o.LINEAR), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, o.LINEAR), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE), n && o.generateMipmap(o.TEXTURE_2D), a;
  }
  target(t, e) {
    const i = this.gl, n = this.texture(t, e), o = i.createFramebuffer();
    return i.bindFramebuffer(i.FRAMEBUFFER, o), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, n, 0), { tex: n, fb: o, w: t, h: e };
  }
  drop(t) {
    t && (this.gl.deleteTexture(t.tex), this.gl.deleteFramebuffer(t.fb));
  }
  quadDraw(t) {
    const e = this.gl;
    e.useProgram(t.p), e.bindBuffer(e.ARRAY_BUFFER, this.quad), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0), e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
  }
  /** A blurred copy of `sharp` into `into` (made, or remade at a new size):
      downsampled so the kernel stays short, then blurred along x and y.
      `sigmaPt` is the blur radius in points. */
  blurred(t, e, i, n, o) {
    const a = this.gl, l = e / this.sizePt.w, r = n * l, c = Math.max(1, Math.round(r / 5)), u = Math.max(1, Math.round(e / c)), h = Math.max(1, Math.round(i / c));
    let f = o;
    (!f || f.w !== u || f.h !== h) && (this.drop(f), f = this.target(u, h));
    const w = this.scratch(u, h);
    a.viewport(0, 0, u, h), a.bindFramebuffer(a.FRAMEBUFFER, f.fb), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, t), a.useProgram(this.copy.p), a.uniform1i(this.copy.loc("uTex"), 0), a.uniform1f(this.copy.loc("uLod"), Math.log2(c)), this.quadDraw(this.copy);
    const x = r / c;
    return a.useProgram(this.blur.p), a.uniform1i(this.blur.loc("uTex"), 0), a.uniform1f(this.blur.loc("uSigma"), Math.max(x, 0.01)), a.bindFramebuffer(a.FRAMEBUFFER, w.fb), a.bindTexture(a.TEXTURE_2D, f.tex), a.uniform2f(this.blur.loc("uStep"), 1 / u, 0), this.quadDraw(this.blur), a.bindFramebuffer(a.FRAMEBUFFER, f.fb), a.bindTexture(a.TEXTURE_2D, w.tex), a.uniform2f(this.blur.loc("uStep"), 0, 1 / h), this.quadDraw(this.blur), a.bindFramebuffer(a.FRAMEBUFFER, null), f;
  }
  scratch(t, e) {
    const i = `${t}x${e}`;
    let n = this.scratches.get(i);
    return n || (n = this.target(t, e), this.scratches.set(i, n)), n;
  }
  /** A screen — any picture WebGL can read, drawn at the backing resolution —
        with its blurred copies. `widthPt` × `heightPt` is the wave's area.
  
        With only the content given, both sides of the wave show it, as both
        sides of the app's wave show the same morphing view; give the revealed
        screen too and the wave carries one into the other. Called again while
        a screen changes: the textures are refilled in place. */
  setScreen(t, e, i, n, o = "content") {
    if (!this.ok) return;
    const a = this.gl, { w: l, h: r } = zt(t);
    this.sizePt.w = e, this.sizePt.h = i;
    let c = this.screens[o];
    c && (c.w !== l || c.h !== r) && (this.dropScreen(c), c = null), c ? (a.bindTexture(a.TEXTURE_2D, c.sharp), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, t), a.generateMipmap(a.TEXTURE_2D)) : c = { sharp: this.texture(l, r, t, !0), near: null, far: null, w: l, h: r }, c.near = this.blurred(c.sharp, c.w, c.h, H, c.near), c.far = this.blurred(c.sharp, c.w, c.h, Math.max(n, H), c.far), this.screens[o] = c, this.farBlur = n;
  }
  /** The wave's area in points, where no screen has said it: a renderer
      over a page can draw the colour alone. */
  setSize(t, e) {
    this.sizePt.w = Math.max(t, 1), this.sizePt.h = Math.max(e, 1);
  }
  /** Lets a screen go: the revealed one, to go back to one screen on both
      sides, or the content, to draw the colour alone. */
  clearScreen(t) {
    this.ok && (this.dropScreen(this.screens[t]), this.screens[t] = null);
  }
  dropScreen(t) {
    t && (this.gl.deleteTexture(t.sharp), this.drop(t.near), this.drop(t.far));
  }
  /** Writes `source` over part of a screen, its top left corner at pixel
      (x, y): a part of the element that changes while the wave is out, such
      as a canvas animating under it. Call `reblur` once the frame's patches
      are in, so the blurred copies carry them too. */
  patchScreen(t, e, i, n) {
    if (!this.ok) return;
    const o = this.screens[t];
    if (!o) return;
    const { w: a, h: l } = zt(e);
    if (i < 0 || n < 0 || i + a > o.w || n + l > o.h) return;
    const r = this.gl;
    r.bindTexture(r.TEXTURE_2D, o.sharp), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.texSubImage2D(r.TEXTURE_2D, 0, i, n, r.RGBA, r.UNSIGNED_BYTE, e), r.generateMipmap(r.TEXTURE_2D);
  }
  /** Remakes a screen's blurred copies from its sharp one, after patches. */
  reblur(t) {
    if (!this.ok) return;
    const e = this.screens[t];
    e && (e.near = this.blurred(e.sharp, e.w, e.h, H, e.near), e.far = this.blurred(e.sharp, e.w, e.h, Math.max(this.farBlur, H), e.far));
  }
  /** Remake the far copies when the style's blur radius moves. */
  setBlur(t) {
    if (!(!this.ok || t === this.farBlur)) {
      this.farBlur = t;
      for (const e of [this.screens.content, this.screens.revealed])
        e && (e.far = this.blurred(e.sharp, e.w, e.h, Math.max(t, H), e.far));
    }
  }
  /** Empties the canvas: over a page, the page alone shows. */
  clear() {
    if (!this.ok) return;
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT);
  }
  /** A single clear texel, bound where a screen is missing. */
  blankTexture() {
    if (!this.blank) {
      const t = this.gl;
      this.blank = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.blank), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST);
    }
    return this.blank;
  }
  /** One frame. `front` null draws the content at rest — or, over a page,
        nothing: the page is the picture.
  
        Without a content screen an opaque renderer has nothing to draw; one
        over a page draws the colour, the rim and the dots alone. */
  render(t, e, i, n, o = {}) {
    if (!this.ok) return;
    const a = this.screens.content;
    if (!a && !this.alpha) return;
    if (!t && this.alpha) {
      this.clear();
      return;
    }
    const l = o.same ? a : this.screens.revealed ?? a, r = this.gl, c = this.canvas.width, u = this.canvas.height;
    r.bindFramebuffer(r.FRAMEBUFFER, null), r.viewport(0, 0, c, u), r.disable(r.BLEND);
    const h = this.main;
    r.useProgram(h.p);
    const f = a ? null : this.blankTexture();
    for (let m = 0; m < 6; m++) {
      const y = m < 3 ? a : l, C = y ? m % 3 === 0 ? y.sharp : m % 3 === 1 ? y.near.tex : y.far.tex : f;
      r.activeTexture(r.TEXTURE0 + m), r.bindTexture(r.TEXTURE_2D, C), r.uniform1i(h.loc(Ie[m]), m);
    }
    r.uniform2f(h.loc("uSize"), this.sizePt.w, this.sizePt.h), r.uniform2f(h.loc("uPx"), c, u);
    const w = !!t;
    if (r.uniform1i(h.loc("uLive"), w ? 1 : 0), !t) {
      r.uniform1i(h.loc("uRevealed"), 0), this.quadDraw(h);
      return;
    }
    const x = a ? Math.min(Math.max(o.gain ?? 1, 0), 1) : 0, d = t.energy * x, v = t.gravity * x, g = this.field;
    g[0] = t.ox, g[1] = t.oy, g[2] = t.spine, g[3] = t.radius, g[4] = t.squash, g[5] = t.time, g[6] = d, g[7] = t.swell, g[8] = t.width, g[9] = t.height, g[10] = v, g[11] = t.glow, g[12] = t.clearRadius, g[13] = t.rim, g[14] = t.tilt, g[15] = t.ring ? 1 : 0, g[16] = t.hold, g[17] = t.launched ? 1 : 0, g[18] = t.hairClearRadius, r.uniform1fv(h.loc("uF"), g);
    const A = d > 0;
    r.uniform1i(h.loc("uContent"), t.hasCleared ? 0 : 1), r.uniform1i(h.loc("uRevealed"), t.launched ? 1 : 0), r.uniform1i(h.loc("uLens"), A || v > 0 ? 1 : 0), r.uniform1i(h.loc("uSame"), o.same || l === a ? 1 : 0), r.uniform1i(h.loc("uRound"), o.round ? 1 : 0), r.uniform1f(h.loc("uFloor"), Math.min(Math.max(o.floor ?? (this.alpha ? 0 : 1), 0), 1)), r.uniform1f(h.loc("uAmplitude"), e.amplitude), r.uniform1f(h.loc("uLensWidth"), e.lensWidth), r.uniform1f(h.loc("uAberration"), e.aberration), r.uniform1f(h.loc("uBlur"), A ? Math.max(e.blur, H) : 0), r.uniform1f(h.loc("uBlurAhead"), e.blurAhead), r.uniform1f(h.loc("uBlurBehind"), e.blurBehind), r.uniform1f(h.loc("uNear"), H);
    const b = Math.min(e.palette.colors.length, 9);
    if (this.palKey !== e.palette) {
      this.palKey = e.palette;
      for (let m = 0; m < b; m++) this.pal.set(pt(e.palette.colors[m]), m * 3);
      this.ahead.set(pt(e.palette.ahead)), this.behind.set(pt(e.palette.behind));
    }
    if (r.uniform3fv(h.loc("uPal"), this.pal), r.uniform1i(h.loc("uPalCount"), Math.max(b, 1)), r.uniform3fv(h.loc("uAhead"), this.ahead), r.uniform3fv(h.loc("uBehind"), this.behind), r.uniform1f(h.loc("uLead"), e.lead), r.uniform1f(h.loc("uTail"), e.tail), r.uniform1f(h.loc("uStrength"), e.strength), r.uniform1f(h.loc("uRimWidth"), e.rimWidth), r.uniform1f(h.loc("uRimSoftness"), e.rimSoftness), r.uniform1f(h.loc("uCorner"), e.cornerRadius), r.uniform1f(h.loc("uUneven"), e.rimUnevenness), r.uniform1f(h.loc("uPulse"), e.rimPulse), r.uniform1f(h.loc("uHairW"), e.hairlineWidth), r.uniform1f(h.loc("uHairO"), e.hairlineOpacity), r.uniform1f(h.loc("uHairWhite"), e.hairlineWhite), r.uniform3fv(h.loc("uLumps"), i), this.quadDraw(h), n && n.count > 0) {
      const m = this.dot;
      r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA), r.useProgram(m.p), r.uniform2f(m.loc("uSize"), this.sizePt.w, this.sizePt.h);
      const y = c / this.sizePt.w;
      r.uniform1f(m.loc("uScale"), y), r.uniform1f(m.loc("uPoint"), Math.ceil((e.particleSize + 1) * y) + 2), r.bindBuffer(r.ARRAY_BUFFER, this.dots), this.dotsSize < n.data.length && (r.bufferData(r.ARRAY_BUFFER, n.data.byteLength, r.DYNAMIC_DRAW), this.dotsSize = n.data.length), r.bufferSubData(r.ARRAY_BUFFER, 0, n.data, 0, n.count * 3), r.enableVertexAttribArray(0), r.vertexAttribPointer(0, 3, r.FLOAT, !1, 0, 0), r.drawArrays(r.POINTS, 0, n.count), r.disable(r.BLEND);
    }
  }
  /** Draws a frame nobody sees. A driver puts off the last of the work on a
      program until it first draws with it, and that would otherwise land in
      the first frame of the first wave. Call it with the screens in, at
      rest: the canvas is left clear. */
  prime(t, e, i, n, o = {}) {
    if (!this.ok) return;
    const a = this.gl;
    a.enable(a.SCISSOR_TEST), a.scissor(0, 0, 1, 1), this.render(t, e, i, n, o), a.disable(a.SCISSOR_TEST), this.clear();
  }
  /* Frees the textures and programs, but keeps the context: React's strict
     mode mounts the same canvas again straight after, and a lost context
     would not come back. The canvas going away frees it. */
  dispose() {
    if (!this.ok) return;
    const t = this.gl;
    this.dropScreen(this.screens.content), this.dropScreen(this.screens.revealed), this.screens = { content: null, revealed: null }, this.blank && t.deleteTexture(this.blank), this.blank = null;
    for (const e of this.scratches.values()) this.drop(e);
    this.scratches.clear();
    for (const e of [this.main, this.blur, this.copy, this.dot]) t.deleteProgram(e.p);
    t.deleteBuffer(this.quad), t.deleteBuffer(this.dots);
  }
}
const it = "http://www.w3.org/1999/xhtml", K = "http://www.w3.org/2000/svg", ze = new RegExp(
  "^(?:" + [
    "animation",
    "transition",
    "view-timeline",
    "scroll-timeline",
    "timeline-scope",
    "view-transition",
    "scroll-behavior",
    "scroll-snap",
    "scroll-margin",
    "scroll-padding",
    "scroll-marker",
    "scroll-target",
    "overscroll-behavior",
    "anchor-",
    "position-anchor",
    "position-area",
    "position-try",
    "position-visibility",
    "cursor$",
    "pointer-events$",
    "user-select$",
    "-webkit-user-",
    "-moz-user-",
    "touch-action$",
    "will-change$",
    "resize$",
    "caret-",
    "interactivity$",
    "app-region$",
    "-webkit-app-region$",
    "-webkit-tap-highlight",
    "orphans$",
    "widows$",
    "page",
    "break-",
    "speak",
    "interpolate-size$",
    "field-sizing$",
    "reading-flow$",
    "reading-order$",
    "-moz-window",
    "-moz-force-broken",
    "-moz-context-properties$",
    "-moz-orient$",
    "-webkit-line-grid",
    "-webkit-nbsp-mode",
    "-webkit-cursor",
    "-webkit-touch-callout"
  ].join("|") + ")"
), Be = /(?:^|-)(?:block|inline)(?:-|$)|^border-(?:start|end)-(?:start|end)-radius$/, Oe = new Set(
  "border-collapse border-spacing caption-side color color-scheme direction empty-cells font-family font-feature-settings font-kerning font-language-override font-optical-sizing font-palette font-size font-size-adjust font-stretch font-width font-style font-synthesis-weight font-synthesis-style font-synthesis-small-caps font-synthesis-position font-variant-alternates font-variant-caps font-variant-east-asian font-variant-emoji font-variant-ligatures font-variant-numeric font-variant-position font-variation-settings font-weight forced-color-adjust hanging-punctuation hyphenate-character hyphenate-limit-chars hyphens image-orientation image-rendering letter-spacing line-break line-height line-height-step list-style-image list-style-position list-style-type math-depth math-shift math-style overflow-wrap paint-order print-color-adjust quotes ruby-align ruby-position tab-size text-align text-align-last text-anchor text-autospace text-combine-upright text-decoration-skip-ink text-emphasis-color text-emphasis-position text-emphasis-style text-indent text-justify text-orientation text-rendering text-shadow text-size-adjust text-spacing-trim text-transform text-underline-offset text-underline-position text-wrap-mode text-wrap-style text-wrap white-space-collapse white-space visibility word-break word-spacing writing-mode fill fill-opacity fill-rule stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width clip-rule color-interpolation color-interpolation-filters color-rendering shape-rendering marker-start marker-mid marker-end -webkit-font-smoothing -moz-osx-font-smoothing -webkit-text-fill-color -webkit-text-stroke-color -webkit-text-stroke-width -webkit-text-security -webkit-locale -webkit-rtl-ordering -webkit-text-orientation -webkit-writing-mode -webkit-line-break -webkit-border-horizontal-spacing -webkit-border-vertical-spacing -webkit-print-color-adjust -webkit-text-decorations-in-effect -webkit-text-size-adjust -webkit-hyphenate-character -webkit-text-emphasis-color -webkit-text-emphasis-position -webkit-text-emphasis-style -webkit-text-combine -webkit-ruby-position -webkit-text-zoom -webkit-box-direction -webkit-user-modify -moz-text-size-adjust -moz-tab-size -moz-box-direction -webkit-hyphens -webkit-text-underline-position -webkit-font-kerning -webkit-font-feature-settings".split(" ")
), Ue = /* @__PURE__ */ new Set([
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "column-rule-color",
  "-webkit-text-decoration-color"
]), Ne = /* @__PURE__ */ new Set(["script", "style", "noscript", "template", "link", "meta", "title", "head", "base", "source", "track", "param", "datalist"]), We = /* @__PURE__ */ new Set(["area", "br", "col", "embed", "hr", "img", "input", "wbr"]), Ge = /^[A-Za-z_][\w.-]*$/, qe = /^(?:(?:xlink|xml):)?[A-Za-z_][\w.-]*$/, Ot = {
  "*": ["dir", "lang"],
  input: ["type", "placeholder", "disabled", "min", "max", "step", "size", "multiple", "readonly"],
  textarea: ["placeholder", "rows", "cols", "disabled", "readonly"],
  select: ["multiple", "size", "disabled"],
  button: ["disabled", "type"],
  option: ["disabled", "label"],
  optgroup: ["disabled", "label"],
  progress: ["value", "max"],
  meter: ["value", "min", "max", "low", "high", "optimum"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
  col: ["span"],
  colgroup: ["span"],
  ol: ["start", "reversed", "type"],
  li: ["value"],
  details: ["open"],
  dialog: ["open"]
};
let U = null, W = [], G = [], Tt = [], kt = 0, lt = 0, Jt = -1, te = -1, ee = -1, et = -1, xt = [], ie = [], Mt = { inh: [], non: [] };
const Rt = /* @__PURE__ */ new Map();
function He() {
  if (U && U.frame.isConnected && U.frame.contentDocument === U.doc && U.hidden.isConnected) return !0;
  if (typeof document > "u") return !1;
  U == null || U.frame.remove(), U = null, Rt.clear();
  const s = document.createElement("iframe");
  s.setAttribute("aria-hidden", "true"), s.setAttribute("tabindex", "-1"), s.setAttribute("data-dw-skip", ""), s.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;border:0;margin:0;padding:0;visibility:hidden;pointer-events:none;", (document.body ?? document.documentElement).appendChild(s);
  const t = s.contentDocument, e = s.contentWindow;
  if (!t || !e)
    return s.remove(), !1;
  t.open(), t.write(`<!doctype html><html><head></head><body><div id="h" style="display:none"><svg xmlns="${K}"></svg></div></body></html>`), t.close();
  const i = t.getElementById("h");
  if (!i)
    return s.remove(), !1;
  if (U = { frame: s, win: e, doc: t, hidden: i, svg: i.firstElementChild }, !W.length) {
    const n = t.createElement("div");
    i.appendChild(n);
    const o = e.getComputedStyle(n), a = [], l = [];
    for (let h = 0; h < o.length; h++) {
      const f = o[h];
      f.startsWith("--") || ze.test(f) || Be.test(f) || (Oe.has(f) ? a : l).push(f);
    }
    n.remove(), W = a, G = l, Tt = l.map((h) => Ue.has(h)), kt = a.indexOf("color"), lt = a.indexOf("font-family"), Jt = l.indexOf("transform"), te = l.indexOf("transform-origin"), ee = l.indexOf("perspective-origin"), et = l.indexOf("appearance"), et < 0 && (et = l.indexOf("-webkit-appearance"));
    const r = /^border-(?:top|right|bottom|left)-(?:width|style|color)$/, c = /^background-(?:color|image)$/, u = /^padding-(?:top|right|bottom|left)$/;
    ie = l.map((h) => r.test(h) || c.test(h) || u.test(h)), xt = l.map((h, f) => r.test(h) || c.test(h) ? f : -1).filter((h) => h >= 0);
  }
  return Mt = se("div", it, ""), !0;
}
function se(s, t, e) {
  const i = t === K, n = i ? "svg:" + s : e ? s + ":" + e : s, o = Rt.get(n);
  if (o) return o;
  const a = U;
  let l;
  try {
    l = i ? a.doc.createElementNS(K, s) : a.doc.createElement(s);
  } catch {
    l = a.doc.createElement("span");
  }
  e && l.setAttribute("type", e), (i && s !== "svg" ? a.svg : a.hidden).appendChild(l);
  const r = a.win.getComputedStyle(l), c = { inh: W.map((u) => r.getPropertyValue(u)), non: G.map((u) => r.getPropertyValue(u)) };
  return l.remove(), Rt.set(n, c), c;
}
const V = /* @__PURE__ */ new Map(), vt = /* @__PURE__ */ new Map(), Xe = 400;
function Ve(s, t) {
  if (V.size >= Xe) {
    const e = V.keys().next().value;
    e !== void 0 && V.delete(e);
  }
  V.set(s, t);
}
function ne(s) {
  return new Promise((t) => {
    const e = new FileReader();
    e.onload = () => t(typeof e.result == "string" ? e.result : null), e.onerror = () => t(null), e.readAsDataURL(s);
  });
}
async function je(s) {
  try {
    const t = new AbortController(), e = setTimeout(() => t.abort(), 4e3), i = await fetch(s, { signal: t.signal });
    return clearTimeout(e), i.ok ? await i.text() : null;
  } catch {
    return null;
  }
}
async function Z(s) {
  try {
    const t = new AbortController(), e = setTimeout(() => t.abort(), 4e3), i = await fetch(s, { signal: t.signal });
    return clearTimeout(e), i.ok ? await ne(await i.blob()) : null;
  } catch {
    return null;
  }
}
async function Ye(s, t, e, i) {
  try {
    const n = document.createElement("canvas");
    n.width = e, n.height = i;
    const o = n.getContext("2d");
    if (!o) return Z(t);
    o.imageSmoothingQuality = "high", o.drawImage(s, 0, 0, e, i);
    const a = await new Promise((l) => n.toBlob(l, "image/webp", 0.96));
    if (a) return await ne(a);
  } catch {
  }
  return Z(t);
}
function re(s, t) {
  let e = vt.get(s);
  return e || (e = t().catch(() => null).then((i) => {
    Ve(s, i), vt.delete(s);
  }), vt.set(s, e)), e;
}
let Ut = [], Et = "";
const Nt = /* @__PURE__ */ new Map(), oe = (s) => s.trim().replace(/^(["'])(.*)\1$/, "$2"), Ft = (s) => oe(s).toLowerCase(), Ke = (s) => s.trim().toLowerCase().replace(/\bnormal\b/g, "400").replace(/\bbold\b/g, "700") || "400", Ze = (s) => s.toLowerCase().split(",").map((t) => t.trim().replace(/^u\+/, "").split("-").map((e) => e.replace(/^0+(?=.)/, "")).join("-")).filter(Boolean).join(",") || "0-10ffff", ae = (s, t, e, i) => `${Ft(s)}|${t.trim().toLowerCase() || "normal"}|${Ke(e)}|${Ze(i)}`;
function Qe(s) {
  const t = {};
  let e = 0, i = "", n = 0;
  const o = (a) => {
    const l = s.slice(n, a), r = l.indexOf(":");
    r > 0 && (t[l.slice(0, r).trim().toLowerCase()] = l.slice(r + 1).trim());
  };
  for (let a = 0; a < s.length; a++) {
    const l = s[a];
    i ? l === "\\" ? a++ : l === i && (i = "") : l === '"' || l === "'" ? i = l : l === "(" ? e++ : l === ")" ? e = Math.max(0, e - 1) : l === ";" && e === 0 && (o(a), n = a + 1);
  }
  return o(s.length), t;
}
const Je = [
  "font-style",
  "font-weight",
  "font-stretch",
  "font-width",
  "unicode-range",
  "font-feature-settings",
  "font-variation-settings",
  "ascent-override",
  "descent-override",
  "line-gap-override",
  "size-adjust"
];
function Wt(s, t, e) {
  const i = /@font-face\s*\{([^}]*)\}/gi;
  let n;
  for (; n = i.exec(s); ) {
    const o = Qe(n[1]), a = o["font-family"], l = o.src;
    if (!a || !l) continue;
    let r = `font-family:"${oe(a).replace(/["\\]/g, "\\$&")}";`;
    for (const c of Je) o[c] && (r += `${c}:${o[c]};`);
    e.push({
      family: Ft(a),
      key: ae(a, o["font-style"] ?? "", o["font-weight"] ?? "", o["unicode-range"] ?? ""),
      descriptors: r,
      src: l,
      base: t
    });
  }
}
async function ti() {
  const s = Array.from(document.styleSheets), t = s.length + "|" + s.map((o) => {
    var a, l;
    return o.href ?? ((l = (a = o.ownerNode) == null ? void 0 : a.textContent) == null ? void 0 : l.length) ?? 0;
  }).join(",");
  if (t === Et) return Ut;
  const e = [], i = [], n = (o, a) => {
    const l = o.href ?? document.baseURI;
    let r;
    try {
      r = o.cssRules;
    } catch {
      if (o.href) {
        const u = o.href;
        let h = Nt.get(u);
        h || Nt.set(u, h = je(u)), i.push(h.then((f) => void (f && Wt(f, u, e))));
      }
      return;
    }
    const c = (u) => {
      for (let h = 0; h < u.length; h++) {
        const f = u[h];
        if (f.constructor.name === "CSSFontFaceRule" || f.cssText.startsWith("@font-face")) Wt(f.cssText, l, e);
        else if (f.styleSheet && a < 4) n(f.styleSheet, a + 1);
        else if (f.cssRules && !f.cssText.startsWith("@keyframes"))
          try {
            c(f.cssRules);
          } catch {
          }
      }
    };
    c(r);
  };
  for (const o of s) n(o, 0);
  if (document.adoptedStyleSheets) for (const o of document.adoptedStyleSheets) n(o, 0);
  return await Promise.all(i), Ut = e, Et = t, e;
}
function ei(s, t) {
  const e = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)(?:\s*format\(\s*["']?([\w-]+)["']?\s*\))?/g;
  let i = null, n;
  for (; n = e.exec(s); ) {
    const o = n[1] ?? n[2] ?? n[3] ?? "";
    let a = o;
    if (!o.startsWith("data:"))
      try {
        a = new URL(o, t).href;
      } catch {
        continue;
      }
    const l = (n[4] ?? "").toLowerCase();
    if (l === "woff2" || /\.woff2(?:[?#]|$)/i.test(a)) return { url: a, format: "woff2" };
    i ?? (i = { url: a, format: l });
  }
  return i;
}
async function ii(s) {
  if (!s.size || !document.fonts) return "";
  const t = await ti();
  if (!t.length) return "";
  const e = /* @__PURE__ */ new Set();
  document.fonts.forEach((l) => {
    l.status === "loaded" && e.add(ae(l.family, l.style, l.weight, l.unicodeRange));
  });
  const i = t.filter((l) => s.has(l.family) && (e.has(l.key) || !/url\(/i.test(l.src))), n = [], o = i.map((l) => {
    if (!/url\(/i.test(l.src)) return { f: l, source: null };
    const r = ei(l.src, l.base);
    return r && !r.url.startsWith("data:") && V.get("u:" + r.url) === void 0 && n.push(re("u:" + r.url, () => Z(r.url))), { f: l, source: r };
  });
  n.length && await Promise.all(n);
  let a = "";
  for (const { f: l, source: r } of o) {
    if (!r) {
      a += `@font-face{${l.descriptors}src:${l.src};}`;
      continue;
    }
    const c = r.url.startsWith("data:") ? r.url : V.get("u:" + r.url);
    c && (a += `@font-face{${l.descriptors}src:url("${c}")${r.format ? ` format("${r.format}")` : ""};}`);
  }
  return a;
}
const le = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, At = (s) => /[&<>\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/.test(s) ? s.replace(le, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : s, X = (s) => /[&<"\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/.test(s) ? s.replace(le, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;") : s;
function ht(s, t, e) {
  const i = V.get(t);
  return i !== void 0 ? i : (s.missing.has(t) || s.missing.set(t, e), null);
}
const si = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/g;
function ce(s, t) {
  return s.replace(si, (e, i, n, o) => {
    const a = i ?? n ?? o ?? "";
    if (!a || a.startsWith("data:") || a.startsWith("#")) return e;
    let l;
    try {
      l = new URL(a, document.baseURI).href;
    } catch {
      return e;
    }
    const r = l.indexOf("#");
    if (r >= 0 && l.slice(0, r) === location.href.split("#")[0]) return `url("${l.slice(r)}")`;
    const c = ht(t, "u:" + l, () => Z(l));
    return c ? `url("${c}")` : "none";
  });
}
function ni(s, t) {
  for (const e of s.split(",")) t.families.add(Ft(e));
}
function ri(s, t) {
  const e = s.currentSrc || s.src;
  if (!e) return null;
  if (e.startsWith("data:")) return e;
  if (!s.complete || !s.naturalWidth) return null;
  const i = s.naturalWidth, n = s.naturalHeight, o = Math.max(s.clientWidth, 1) * t.o.scale, a = Math.max(s.clientHeight, 1) * t.o.scale, l = Math.min(1, Math.max(o / i, a / n));
  if (l > 0.62 || i * n < 4e5 || /\.svg(?:[?#]|$)/i.test(e)) return ht(t, "u:" + e, () => Z(e));
  const r = Math.max(1, Math.ceil(i * l / 16) * 16), c = Math.max(1, Math.round(r * n / i));
  return ht(t, `i:${e}|${r}`, () => Ye(s, e, r, c));
}
function oi(s) {
  try {
    if (s instanceof HTMLCanvasElement) return s.width && s.height ? s.toDataURL() : null;
    if (!s.videoWidth || s.readyState < 2) return null;
    const t = document.createElement("canvas");
    return t.width = s.videoWidth, t.height = s.videoHeight, t.getContext("2d").drawImage(s, 0, 0), t.toDataURL("image/jpeg", 0.92);
  } catch {
    return null;
  }
}
function ai(s) {
  if (!s) return "";
  let t = "";
  for (const e in s) t += `${e}:${s[e]};`;
  return t;
}
function Gt(s, t, e, i) {
  const n = getComputedStyle(s, t), o = n.getPropertyValue("content");
  if (!o || o === "none" || o === "normal" || o === "-moz-alt-content" || n.getPropertyValue("display") === "none") return "";
  let a = "", l = "";
  for (let u = 0; u < W.length; u++) {
    const h = n.getPropertyValue(W[u]);
    u === kt && (l = h), h !== e[u] && (a += `${W[u]}:${h};`);
  }
  const r = Mt.non;
  for (let u = 0; u < G.length; u++) {
    let h = n.getPropertyValue(G[u]);
    h !== r[u] && (Tt[u] && h === l || (h.indexOf("url(") >= 0 && (h = ce(h, i)), a += `${G[u]}:${h};`));
  }
  const c = "dw" + i.classes++;
  return i.rules.push(`.${c}${t}{${a}}`), c;
}
function he(s, t, e, i, n) {
  var S, M, O, N;
  if (!(s === n.root) && ((M = (S = n.o).skip) != null && M.call(S, s))) return;
  const a = s.namespaceURI, l = a === K;
  if (!l && a !== it) return;
  let r = s.localName;
  if (!l && Ne.has(r) || !Ge.test(r)) return;
  const c = getComputedStyle(s);
  if (c.getPropertyValue("display") === "none") return;
  n.nodes++;
  let u = "", h = null, f = !1;
  if (!l)
    if (r === "img") {
      const p = ri(s, n);
      p && (u += ` src="${X(p)}"`);
    } else if (r === "canvas" || r === "video") {
      const p = oi(s);
      r = "img", p && (u += ` src="${X(p)}"`);
    } else if (r === "iframe" || r === "object" || r === "embed" || r === "audio")
      r = "div", f = !0;
    else if (r === "textarea")
      h = s.value;
    else if (r === "input") {
      const p = s;
      p.type !== "file" && (u += ` value="${X(p.value)}"`), p.checked && (u += ' checked=""');
    } else r === "option" && s.selected && (u += ' selected=""');
  const w = !l && (r === "input" || r === "button") ? (s.getAttribute("type") ?? "").toLowerCase() : "", x = se(r, a, w), d = l ? x : Mt, v = new Array(W.length);
  let g = "";
  const A = x.inh, b = d.inh;
  for (let p = 0; p < W.length; p++) {
    const R = c.getPropertyValue(W[p]);
    v[p] = R, (t === null || A[p] !== b[p] || R !== t[p]) && (g += `${W[p]}:${R};`);
  }
  const m = v[kt];
  (t === null || v[lt] !== t[lt]) && ni(v[lt], n);
  const y = x.non, C = d.non, _ = !i && c.getPropertyValue("transform") === "none" && (c.getPropertyValue("translate") || "none") === "none" && (c.getPropertyValue("rotate") || "none") === "none" && (c.getPropertyValue("scale") || "none") === "none" && (c.getPropertyValue("offset-path") || "none") === "none";
  let F = !1;
  if (!l && et >= 0 && y[et] !== "none")
    for (let p = 0; p < xt.length; p++) {
      const R = xt[p];
      if (c.getPropertyValue(G[R]) !== y[R]) {
        F = !0;
        break;
      }
    }
  for (let p = 0; p < G.length; p++) {
    let R = c.getPropertyValue(G[p]);
    const T = C[p], $ = y[p] === T && !(F && ie[p]);
    if (p === Jt && i)
      R = R === "none" ? i : `${i} ${R}`;
    else if ($ && (R === T || Tt[p] && R === m || p === te && _ || p === ee && c.getPropertyValue("perspective") === "none"))
      continue;
    R.indexOf("url(") >= 0 && (R = ce(R, n)), g += `${G[p]}:${R};`;
  }
  g += ai((N = (O = n.o).force) == null ? void 0 : N.call(O, s));
  const k = Gt(s, "::before", v, n), L = Gt(s, "::after", v, n);
  if (l) {
    const p = s.attributes;
    for (let R = 0; R < p.length; R++) {
      const { name: T, value: $ } = p[R];
      if (T === "style" || T === "class" || T === "xmlns" || T.startsWith("on") || T.startsWith("xmlns:") || !qe.test(T)) continue;
      let P = $;
      if ((T === "href" || T === "xlink:href") && P && !P.startsWith("#") && !P.startsWith("data:")) {
        let D = P;
        try {
          D = new URL(P, document.baseURI).href;
        } catch {
          continue;
        }
        const E = ht(n, "u:" + D, () => Z(D));
        if (!E) continue;
        P = E;
      }
      u += ` ${T}="${X(P)}"`;
    }
  } else {
    for (const R of Ot["*"]) {
      const T = s.getAttribute(R);
      T !== null && (u += ` ${R}="${X(T)}"`);
    }
    const p = Ot[r];
    if (p)
      for (const R of p) {
        const T = s.getAttribute(R);
        T !== null && (u += ` ${R}="${X(T)}"`);
      }
  }
  const z = k && L ? `${k} ${L}` : k || L, B = `<${r}${a !== e ? ` xmlns="${a}"` : ""}${z ? ` class="${z}"` : ""} style="${X(g)}"${u}`;
  if (!l && We.has(r)) {
    n.out.push(B + "/>");
    return;
  }
  if (n.out.push(B + ">"), h !== null) n.out.push(At(h));
  else if (!f) {
    const p = s.scrollLeft, R = s.scrollTop, T = p || R ? `translate(${-p}px,${-R}px)` : "", $ = s.shadowRoot;
    let P = $ ? $.childNodes : s.childNodes;
    if (!l && r === "slot") {
      const D = s.assignedNodes({ flatten: !0 });
      D.length && (P = D);
    }
    for (let D = 0; D < P.length; D++) {
      const E = P[D];
      E.nodeType === 1 ? he(E, v, a, T, n) : E.nodeType === 3 && n.out.push(At(E.data));
    }
  }
  n.out.push(`</${r}>`);
}
function qt(s, t) {
  const e = { o: t, root: s, out: [], rules: [], classes: 0, nodes: 0, missing: /* @__PURE__ */ new Map(), families: /* @__PURE__ */ new Set() };
  return he(s, null, it, "", e), e;
}
const li = { "%": "%25", "#": "%23", "\n": "%0A", "\r": "%0D", "	": "%09" };
function ci(s) {
  return new Promise((t, e) => {
    const i = new Image();
    i.onload = () => t(i), i.onerror = () => e(new Error("distortion-waves: the snapshot would not load")), i.src = "data:image/svg+xml;charset=utf-8," + s.replace(/[%#\n\r\t]/g, (n) => li[n]);
  });
}
function hi(s) {
  return !s || s === "transparent" || /(?:,|\/)\s*0(?:\.0+)?%?\s*\)$/.test(s);
}
function ui(s) {
  for (let t = s.parentElement; t; t = t.parentElement) {
    const e = getComputedStyle(t).backgroundColor;
    if (!hi(e)) return e;
  }
  return "#fff";
}
const fi = typeof navigator < "u" && /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//.test(navigator.userAgent), di = typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("zoom", "2") && !(typeof navigator < "u" && /Firefox\//.test(navigator.userAgent));
async function mi(s, t) {
  if (!He()) throw new Error("distortion-waves: no document to read styles in");
  const e = performance.now();
  let i = qt(s, t), n = performance.now() - e;
  if (i.missing.size) {
    await Promise.all(Array.from(i.missing, ([A, b]) => re(A, b)));
    const g = performance.now();
    i = qt(s, t), n += performance.now() - g;
  }
  const o = await ii(i.families), a = performance.now(), l = +t.width.toFixed(3), r = +t.height.toFixed(3), c = Math.max(1, Math.round(t.width * t.scale)), u = Math.max(1, Math.round(t.height * t.scale)), h = o.length > 0 || i.out.some((g) => g.indexOf("data:") >= 0), f = `<style>${At(o + i.rules.join(""))}</style>` + i.out.join(""), w = di && t.scale !== 1 ? `<svg xmlns="${K}" xmlns:xlink="http://www.w3.org/1999/xlink" width="${c}" height="${u}" viewBox="0 0 ${c} ${u}"><foreignObject x="0" y="0" width="${c}" height="${u}"><div xmlns="${it}" style="position:relative;width:${c}px;height:${u}px;overflow:hidden;"><div style="position:relative;width:${l}px;height:${r}px;overflow:hidden;zoom:${+t.scale.toFixed(4)};">` + f + "</div></div></foreignObject></svg>" : `<svg xmlns="${K}" xmlns:xlink="http://www.w3.org/1999/xlink" width="${l}" height="${r}" viewBox="0 0 ${l} ${r}"><foreignObject x="0" y="0" width="${l}" height="${r}"><div xmlns="${it}" style="position:relative;width:${l}px;height:${r}px;overflow:hidden;">` + f + "</div></foreignObject></svg>", x = await ci(w);
  try {
    await x.decode();
  } catch {
  }
  fi && h && await new Promise((g) => setTimeout(g, 60));
  const d = t.into ?? document.createElement("canvas");
  (d.width !== c || d.height !== u) && (d.width = c, d.height = u);
  const v = d.getContext("2d", { alpha: !1 });
  if (!v) throw new Error("distortion-waves: no 2D canvas");
  return v.setTransform(1, 0, 0, 1, 0, 0), v.fillStyle = "#fff", v.fillRect(0, 0, c, u), v.fillStyle = t.background, v.fillRect(0, 0, c, u), v.drawImage(x, 0, 0, c, u), { canvas: d, walk: n, raster: performance.now() - a, nodes: i.nodes, size: w.length };
}
function pi() {
  Et = "";
}
const gi = 393 * 852, vi = ut(0.22, 1, 0.36, 1), Ht = (s) => s, wi = 0.12, bi = 150, yi = 300, xi = 9e6, Ri = 3e4, Ei = 2e3, Ai = "button, a[href], [role=button], input, select, textarea, summary, label, [data-wave-source]", Xt = (s, t, e) => Math.min(Math.max(s, t), e), at = (s) => parseFloat(s) || 0, Vt = (s) => {
  const t = window;
  typeof t.requestIdleCallback == "function" ? t.requestIdleCallback(s, { timeout: 600 }) : window.setTimeout(s, 1);
}, jt = /* @__PURE__ */ new Map();
function Si(s, t) {
  if (!s) return t;
  if (typeof s != "string") return s;
  if (s in ct) return ct[s];
  if (!/^#?[0-9a-f]{6}$/i.test(s)) return t;
  const e = s.replace("#", "").toLowerCase();
  let i = jt.get(e);
  return i || (i = ge(ve(e)), jt.set(e, i)), i;
}
function Ti(s, t) {
  if (s === t) return !0;
  if (!s || !t) return !1;
  const e = Object.keys(s);
  if (e.length !== Object.keys(t).length) return !1;
  const i = s, n = t;
  for (const o of e) if (i[o] !== n[o]) return !1;
  return !0;
}
const ki = ["content"], Mi = ["content", "revealed"], wt = () => ({ canvas: null, ready: !1, stale: !0, busy: !1, dirty: 0, cost: 0, last: 0, began: 0, broken: !1, nodes: 0, size: 0, walk: 0, raster: 0, count: 0 });
function bt(s, t, e) {
  s.style.opacity = t >= 1 ? "" : String(Math.max(t, 0)), s.style.pointerEvents = e ? "" : "none", s.toggleAttribute("inert", !e), e ? s.removeAttribute("aria-hidden") : s.setAttribute("aria-hidden", "true");
}
class Fi {
  constructor(t, e, i = null) {
    this.opts = {}, this.first = !0, this.destroyed = !1, this.canvas = null, this.renderer = null, this.failed = !1, this.positioned = !1, this.geom = null, this.geomDirty = !0, this.epoch = 0, this.style = Ct("vertical"), this.styleDirty = !0, this.total = tt(this.style), this.particles = [], this.particlesKey = "", this.dots = { data: new Float32Array(0), count: 0 }, this.front = yt(), this.probe = yt(), this.spot = { x: 0, y: 0, a: 0 }, this.frame = { floor: 0, gain: 0, round: !0, same: !0 }, this.patch = null, this.primed = !1, this.slots = { content: wt(), revealed: wt() }, this.waiting = { content: !1, revealed: !1 }, this.p = 0, this.run = null, this.runAt = 0, this.raf = 0, this.scrubbing = !1, this.fading = !1, this.mode = null, this.lensAt = null, this.lastProp = void 0, this.shown = NaN, this.srcEl = null, this.srcCss = { x: 0, y: 0, w: 1, h: 1 }, this.focusCss = null, this.src = { x: 0, y: 0, w: 1, h: 1 }, this.focus = null, this.held = !1, this.playOpts = null, this.launchAt = 0, this.clearAt = 1, this.press = null, this.pointerInside = !1, this.focusInside = !1, this.refreshTimer = 0, this.releaseTimer = 0, this.abort = new AbortController(), this.still = null, this.lastGain = 0, this.lastFloor = 0, this.lastDraw = 0, this.tick = (n) => {
      this.raf = 0;
      const o = this.run;
      if (!o) {
        this.scrubbing && this.paint(n);
        return;
      }
      o.t0 < 0 && (o.t0 = n);
      const a = o.dur > 0 ? (n - o.t0) / o.dur : 1;
      if (a >= 1) {
        this.finish();
        return;
      }
      this.p = o.from + (o.to - o.from) * o.ease(a), this.paint(n), this.raf = requestAnimationFrame(this.tick);
    }, this.root = t, this.a = e, this.b = i, getComputedStyle(t).position === "static" && (t.style.position = "relative", this.positioned = !0), this.still = typeof matchMedia == "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null, this.observer = new MutationObserver((n) => this.onMutations(n)), this.observer.observe(t, { subtree: !0, childList: !0, attributes: !0, characterData: !0 }), this.resizer = new ResizeObserver(() => this.onResize()), this.resizer.observe(t), this.listen();
  }
  // ─── The outside ───
  /** The options as they now stand. Cheap when nothing has changed: call it
      on every render. */
  update(t) {
    if (this.destroyed) return;
    const e = this.opts;
    this.opts = t;
    const i = this.first;
    this.first = !1, (i || e.type !== t.type || e.palette !== t.palette || !Ti(e.waveStyle, t.waveStyle)) && (this.styleDirty = !0), (i || e.scale !== t.scale || e.resolution !== t.resolution || e.cornerRadius !== t.cornerRadius) && (this.geomDirty = !0);
    const n = t.revealed, o = n !== void 0 && n !== this.lastProp;
    if (n !== void 0 && (this.lastProp = n), t.scrub != null) {
      this.scrubTo(t.scrub);
      return;
    }
    if (this.scrubbing) {
      this.scrubbing = !1, this.go(n ?? this.p >= 0.5 ? 1 : 0);
      return;
    }
    if (i) {
      this.p = n ? 1 : 0, this.held = !1, this.show(this.p), t.prewarm !== !1 && this.warm();
      return;
    }
    if (o) {
      this.go(n ? 1 : 0);
      return;
    }
    (this.styleDirty || this.geomDirty) && !this.run && this.p > 0 && this.p < 1 && this.invalidate();
  }
  /** The second view's element, when it comes or goes. */
  setRevealedLayer(t) {
    var e;
    t !== this.b && (this.b = t, this.slots.revealed = wt(), (e = this.renderer) == null || e.clearScreen("revealed"), this.shown = NaN, !this.run && !this.scrubbing && this.show(this.p >= 1 ? 1 : 0));
  }
  /** Runs the wave from the start, whatever was showing. */
  play(t) {
    this.destroyed || (this.halt(), this.scrubbing = !1, this.p = 0, this.held = !1, this.show(0), this.playOpts = t ?? null, this.go(1));
  }
  /** Runs it back to the first view. */
  reverse() {
    this.destroyed || (this.scrubbing = !1, this.go(0));
  }
  /** Straight back to the first view, with no wave. */
  reset() {
    var t;
    this.destroyed || (this.halt(), this.scrubbing = !1, this.p = 0, this.held = !1, this.mode = null, (t = this.renderer) == null || t.clear(), this.canvas && (this.canvas.style.display = "none"), this.show(0), this.rest());
  }
  /** Takes the pictures now, so the next wave starts with its lens. */
  async prepare() {
    this.destroyed || this.opts.capture === !1 || this.motionless() || !this.ensureRenderer() || (this.flush(), await Promise.all(this.needed().map((t) => this.fresh(t) ? void 0 : this.capture(t))));
  }
  /** What the wave is doing, for a bench. */
  get debug() {
    const t = (e) => ({ ready: e.ready, stale: e.stale, busy: e.busy, cost: e.cost, walk: e.walk, raster: e.raster, nodes: e.nodes, size: e.size, count: e.count });
    return {
      progress: this.p,
      running: !!this.run,
      mode: this.fading ? "fade" : this.mode,
      gain: this.lastGain,
      floor: this.lastFloor,
      draw: this.lastDraw,
      clearAt: this.clearAt,
      duration: this.total,
      geometry: this.geom,
      source: this.src,
      webgl: !!this.renderer && !this.renderer.lost,
      content: t(this.slots.content),
      revealed: t(this.slots.revealed)
    };
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.halt(), clearTimeout(this.refreshTimer), clearTimeout(this.releaseTimer), this.abort.abort(), this.observer.disconnect(), this.resizer.disconnect(), this.dropRenderer(), this.positioned && (this.root.style.position = ""));
  }
  // ─── Geometry and style ───
  measure() {
    var R, T;
    this.geomDirty = !1;
    const t = this.root, e = t.getBoundingClientRect(), i = getComputedStyle(t), n = t.offsetWidth;
    let o = n > 0 && e.width > 0 ? e.width / n : 1;
    (!(o > 0) || Math.abs(o - 1) < 0.01) && (o = 1);
    const a = at(i.borderLeftWidth), l = at(i.borderTopWidth), r = at(i.borderRightWidth), c = at(i.borderBottomWidth), u = e.width / o, h = e.height / o, f = Math.max(u - a - r, 1), w = Math.max(h - l - c, 1), x = Math.min(u, h) / 2, d = ($, P) => {
      const D = $.split(" ")[0], E = parseFloat(D) || 0;
      return Math.max(Math.min(D.endsWith("%") ? E / 100 * u : E, x) - P, 0);
    }, v = d(i.borderTopLeftRadius, a), g = d(i.borderTopRightRadius, r), A = d(i.borderBottomRightRadius, r), b = d(i.borderBottomLeftRadius, a), m = this.opts.cornerRadius, y = m != null && m >= 0 ? m : Math.max(v, g, A, b), C = m != null && m >= 0 && v + g + A + b === 0 ? `${m}px` : `${v}px ${g}px ${A}px ${b}px`, _ = this.opts.scale ?? "auto", F = typeof _ == "number" && _ > 0 ? _ : Xt(Math.sqrt(f * w / gi), 0.6, 2.2), k = ((R = this.renderer) == null ? void 0 : R.maxTextureSize) || 4096, L = this.opts.resolution && this.opts.resolution > 0 ? this.opts.resolution : (window.devicePixelRatio || 1) * o, z = Math.min(L, Math.sqrt(xi / (f * w)), k / f, k / w), B = Math.max(1, Math.round(f * z)), S = Math.max(1, Math.round(w * z)), M = this.geom, O = !M || M.W !== B || M.H !== S || M.w !== f || M.h !== w || M.bl !== a || M.bt !== l, N = !M || M.k !== F || M.radius !== y;
    this.geom = { w: f, h: w, bw: u, bh: h, bl: a, bt: l, anc: o, k: F, vw: f / F, vh: w / F, bs: z, W: B, H: S, radius: y, radii: C };
    const p = this.canvas;
    if (p && ((p.width !== B || p.height !== S) && (p.width = B, p.height = S), p.style.borderRadius !== C && (p.style.borderRadius = C)), O && (this.epoch++, this.slots.content.stale = !0, this.slots.revealed.stale = !0), (O || N || this.styleDirty) && (this.restyle(), this.run || this.scrubbing)) {
      if ((T = this.srcEl) != null && T.isConnected) {
        const $ = this.srcEl.getBoundingClientRect();
        $.width > 0 && $.height > 0 && (this.srcCss = this.local($));
      }
      this.retime();
    }
  }
  /** A viewport rectangle in the element's own CSS pixels. */
  local(t) {
    const e = this.geom, i = this.root.getBoundingClientRect();
    return { x: (t.left - i.left) / e.anc - e.bl, y: (t.top - i.top) / e.anc - e.bt, w: t.width / e.anc, h: t.height / e.anc };
  }
  restyle() {
    const t = this.geom;
    if (!t) return;
    this.styleDirty = !1;
    const e = this.opts, i = Ct(e.type ?? "vertical"), n = e.waveStyle;
    if (n) {
      const l = i, r = n;
      for (const c in r) {
        const u = r[c];
        c !== "palette" && c !== "type" && c !== "cornerRadius" && typeof u == "number" && isFinite(u) && (l[c] = u);
      }
    }
    i.palette = Si(e.palette ?? (n == null ? void 0 : n.palette), i.palette), i.cornerRadius = t.radius / t.k;
    const o = Math.sqrt(t.k);
    i.hairlineWidth /= o, i.particleSize /= o, this.style = i, this.total = tt(i);
    const a = `${Math.round(i.particleCount)}|${i.particleSize}|${i.particleLife}`;
    a !== this.particlesKey && (this.particlesKey = a, this.particles = Fe(i), this.dots.data.length < this.particles.length * 3 && (this.dots = { data: new Float32Array(this.particles.length * 3), count: 0 }));
  }
  /** Where the wave starts, read as it leaves. */
  aim(t) {
    var w, x;
    const e = this.opts, i = ((w = this.playOpts) == null ? void 0 : w.source) ?? e.source;
    if (t === 0 && this.held && i == null) return;
    const n = this.geom, o = performance.now(), a = this.press && o - this.press.t < Ei ? this.press : null;
    let l = null, r = null;
    if (i && typeof i.getBoundingClientRect == "function" ? l = i : i && "current" in i ? l = i.current : i && (r = i), !l && !r) {
      if ((x = a == null ? void 0 : a.el) != null && x.isConnected) l = a.el;
      else if (!a) {
        const d = document.activeElement;
        d && d !== this.root && this.root.contains(d) && (l = d);
      }
    }
    if (l) {
      const d = l.getBoundingClientRect();
      d.width > 0 && d.height > 0 ? r = this.local(d) : l = null;
    }
    const c = e.type ?? "vertical", u = a ? this.local({ left: a.x, top: a.y, width: 0, height: 0 }) : null;
    let h = null;
    const f = this.playOpts && "focus" in this.playOpts ? this.playOpts.focus : e.focus;
    if (f !== void 0 ? h = f : u && (!l || l === a.el) && (h = { x: u.x, y: u.y }), !r) {
      const d = n.k;
      if (c === "center") {
        const v = u ?? { x: n.w / 2, y: n.h / 2 };
        r = { x: v.x - 29 * d, y: v.y - 29 * d, w: 58 * d, h: 58 * d };
      } else if (c === "horizontal") {
        const v = Math.min(n.h * 0.5, 240 * d);
        r = { x: -20 * d, y: (n.h - v) / 2, w: 40 * d, h: v };
      } else {
        const v = Math.min(n.w - 48 * d, 345 * d);
        r = { x: (n.w - v) / 2, y: n.h - 82 * d, w: v, h: 58 * d };
      }
    }
    this.srcEl = l, this.srcCss = r, this.focusCss = h;
  }
  /** The source in points, and the moments the run turns on. */
  retime() {
    const t = this.geom, e = this.style, i = t.k, n = this.srcCss;
    this.src = { x: n.x / i, y: n.y / i, w: n.w / i, h: n.h / i }, this.focus = this.focusCss ? { x: this.focusCss.x / i, y: this.focusCss.y / i } : null, this.total = tt(e), this.launchAt = e.anticipation / this.total;
    const o = (r) => dt(r, this.src, t.vw, t.vh, e, this.focus, this.probe).hasCleared;
    if (!o(1)) {
      this.clearAt = 1;
      return;
    }
    let a = this.launchAt, l = 1;
    for (let r = 0; r < 22; r++) {
      const c = (a + l) / 2;
      o(c) ? l = c : a = c;
    }
    this.clearAt = l;
  }
  // ─── The run ───
  motionless() {
    var e;
    const t = this.opts.reducedMotion ?? "system";
    return t === "always" || t === "system" && !!((e = this.still) != null && e.matches);
  }
  needed() {
    return this.b ? Mi : ki;
  }
  fresh(t) {
    const e = this.slots[t];
    return e.ready && !e.stale;
  }
  halt() {
    cancelAnimationFrame(this.raf), this.raf = 0, this.run = null, this.fading = !1, this.playOpts = this.playOpts && null;
  }
  go(t) {
    var n;
    if (this.destroyed) return;
    clearTimeout(this.refreshTimer), clearTimeout(this.releaseTimer), this.flush();
    const e = !this.run && (this.p <= 0 || this.p >= 1);
    if (e && this.p === t) {
      this.playOpts = null;
      return;
    }
    if (cancelAnimationFrame(this.raf), this.raf = 0, this.motionless() || !this.ensureRenderer()) {
      (n = this.renderer) == null || n.clear(), this.canvas && (this.canvas.style.display = "none"), this.fading = !0, this.mode = null, this.run = { from: this.p, to: t, t0: -1, dur: yi * Math.abs(t - this.p), ease: Ht }, this.raf = requestAnimationFrame(this.tick);
      return;
    }
    this.fading = !1, this.measure(), (e || this.geomDirty) && (this.aim(t), this.mode = null), this.retime(), this.playOpts = null;
    const i = this.total;
    if (this.run = {
      from: this.p,
      to: t,
      t0: -1,
      dur: (t === 1 ? i : i / Math.max(this.style.returnSpeed, 0.05)) * 1e3,
      ease: t === 1 ? Ht : vi
    }, e) {
      const o = this.opts.capture !== !1;
      this.runAt = performance.now();
      let a = o;
      for (const l of this.needed()) {
        const r = this.fresh(l);
        this.waiting[l] = o && !r, r || (a = !1, o && !this.slots[l].busy && this.capture(l));
      }
      this.lensAt = a ? -1 / 0 : null;
    }
    this.canvas.style.display = "block", this.raf = requestAnimationFrame(this.tick);
  }
  paint(t) {
    if (this.fading || !this.renderer || this.renderer.lost) {
      this.show(this.p);
      return;
    }
    const e = performance.now();
    this.draw(t), this.lastDraw = performance.now() - e;
  }
  invalidate() {
    !this.raf && !this.destroyed && (this.raf = requestAnimationFrame(this.tick));
  }
  finish() {
    var e, i;
    const t = this.run.to;
    this.run = null, this.p = t, this.fading = !1, this.mode = null, this.lensAt = null, this.waiting.content = this.waiting.revealed = !1, this.lastGain = this.lastFloor = 0, this.held = t === 1, this.renderer && !this.renderer.lost && this.renderer.clear(), this.canvas && (this.canvas.style.display = "none"), this.show(t), this.rest(), (i = (e = this.opts).onFinish) == null || i.call(e, t === 1);
  }
  scrubTo(t) {
    const e = Xt(t, 0, 1);
    if (!this.scrubbing) {
      const i = !this.run && (this.p <= 0 || this.p >= 1);
      if (this.halt(), this.scrubbing = !0, clearTimeout(this.refreshTimer), clearTimeout(this.releaseTimer), this.flush(), this.motionless() || !this.ensureRenderer())
        this.fading = !0;
      else {
        if (this.measure(), i && (this.aim(1), this.mode = null), this.retime(), this.waiting.content = this.waiting.revealed = !1, this.lensAt = -1 / 0, this.opts.capture !== !1)
          for (const n of this.needed()) !this.fresh(n) && !this.slots[n].busy && this.capture(n);
        this.canvas.style.display = "block";
      }
    }
    e === this.p && this.shown === this.shown && !this.styleDirty && !this.geomDirty || (this.p = e, this.invalidate());
  }
  /** One frame of the wave at `this.p`. */
  draw(t) {
    const e = this.renderer;
    this.geomDirty ? this.measure() : this.styleDirty && (this.restyle(), this.retime());
    const i = this.geom, n = this.style, o = this.p;
    if (o <= 0 || o >= 1) {
      e.clear(), this.lastGain = this.lastFloor = 0, this.show(o >= 1 ? 1 : 0);
      return;
    }
    const a = !!this.b, l = dt(o, this.src, i.vw, i.vh, n, this.focus, this.front), r = this.slots.content, c = this.slots.revealed, u = this.opts.capture !== !1, h = u && r.ready && !this.waiting.content && (!a || c.ready && !this.waiting.revealed);
    let f = 0;
    h && (this.lensAt === null && (this.lensAt = t), f = this.scrubbing || this.lensAt === -1 / 0 ? 1 : I(0, bi, t - this.lensAt));
    let w = 0, x = !0, d = h;
    const v = wi / this.total;
    a && (!this.scrubbing && this.mode === null && o > this.launchAt && o < this.clearAt + v && (this.mode = h ? "lens" : "plain"), !this.scrubbing && this.mode !== null && (d = this.mode === "lens"), d ? (x = !1, o >= this.clearAt ? (this.show(1), w = 1 - I(this.clearAt, this.clearAt + v, o)) : this.show(0)) : (f = 0, this.show(l.hasCleared ? 1 : l.launched ? I(0.08, 0.7, l.moved) : 0))), this.lastGain = f, this.lastFloor = w, e.setSize(i.vw, i.vh), e.setBlur(n.blur);
    const g = Dt(o * this.total, i.vw, i.vh, n.cornerRadius, n.rimPulse), A = this.dots;
    let b = 0;
    if (l.time > 0) {
      const y = this.src, C = this.particles, _ = this.spot;
      for (let F = 0; F < C.length; F++) {
        const k = C[F];
        Le(k, l, y, n, _), !(_.a <= 2e-3) && (A.data[b * 3] = _.x, A.data[b * 3 + 1] = _.y, A.data[b * 3 + 2] = Math.floor(k.size * 10) + Math.min(_.a, 0.999), b++);
      }
    }
    A.count = b;
    const m = this.frame;
    m.floor = w, m.gain = f, m.same = x, h && this.patchLive(), e.render(l, n, g, A, m), u && this.chase(t, l, f > 0 && (l.energy > 0 || l.gravity > 0) || w > 0 || a && d && l.launched && o < this.clearAt + v);
  }
  /** Copies each live canvas (`<canvas data-dw-live>`) in a view onto that
      view's screen, over the part of the picture it covers, so the wave
      bends it as it animates. The picture leaves these canvases out; each
      frame lays the canvas over that part of the picture again. */
  patchLive() {
    const t = this.renderer, e = this.geom;
    if (!t || !e) return;
    const i = this.root.querySelectorAll("canvas[data-dw-live]");
    if (!i.length) return;
    let n = !1, o = !1;
    for (let a = 0; a < i.length; a++) {
      const l = i[a], r = this.a.contains(l) ? "content" : this.b && this.b.contains(l) ? "revealed" : null;
      if (!r || !l.width || !l.height) continue;
      const c = this.slots[r].canvas;
      if (!c || !t.has(r)) continue;
      const u = this.local(l.getBoundingClientRect()), h = e.bs, f = u.x * h, w = u.y * h, x = Math.max(0, Math.floor(f)), d = Math.max(0, Math.floor(w)), v = Math.min(c.width, Math.ceil(f + u.w * h)), g = Math.min(c.height, Math.ceil(w + u.h * h));
      if (v <= x || g <= d) continue;
      const A = v - x, b = g - d;
      let m = this.patch;
      m || (m = this.patch = document.createElement("canvas")), (m.width !== A || m.height !== b) && (m.width = A, m.height = b);
      const y = m.getContext("2d");
      if (!y) return;
      y.setTransform(1, 0, 0, 1, 0, 0), y.globalCompositeOperation = "copy", y.drawImage(c, x, d, A, b, 0, 0, A, b), y.globalCompositeOperation = "source-over", y.drawImage(l, 0, 0, l.width, l.height, f - x, w - d, u.w * h, u.h * h), t.patchScreen(r, m, x, d), r === "content" ? n = !0 : o = !0;
    }
    n && t.reblur("content"), o && t.reblur("revealed");
  }
  /** Keeps the pictures up with the element while the wave is out. */
  chase(t, e, i) {
    const n = this.opts.live ?? !0, o = this.needed();
    for (let a = 0; a < o.length; a++) {
      const l = o[a], r = this.slots[l];
      if (!(r.busy || r.broken)) {
        if (this.waiting[l] || !r.ready) {
          this.capture(l);
          continue;
        }
        if (n === !1 || !i || this.scrubbing) {
          this.scrubbing && r.stale && this.capture(l);
          continue;
        }
        t - r.last < Math.max(90, r.cost * 6) || (!r.stale && n === "animations" && this.animating(l) && (r.stale = !0), r.stale && this.capture(l));
      }
    }
  }
  animating(t) {
    const e = t === "content" ? this.a : this.b;
    return !e || typeof e.getAnimations != "function" ? !1 : e.getAnimations({ subtree: !0 }).some((i) => i.playState === "running");
  }
  /** Which view the element shows: 0 the first, 1 the second, between them
      the second fading in over the first. */
  show(t) {
    if (t === this.shown) return;
    this.shown = t;
    const e = this.b;
    if (!e)
      bt(this.a, 1, !0);
    else {
      const i = t > 0.5;
      bt(this.a, t >= 1 ? 0 : 1, !i), bt(e, t, i);
    }
    this.flush();
  }
  // ─── Pictures ───
  ensureRenderer() {
    if (this.renderer) return this.renderer.lost ? null : this.renderer;
    if (this.failed || this.destroyed) return null;
    const t = document.createElement("canvas");
    t.setAttribute("data-dw-skip", ""), t.setAttribute("aria-hidden", "true");
    const e = t.style;
    e.position = "absolute", e.left = e.top = "0", e.width = e.height = "100%", e.pointerEvents = "none", e.zIndex = "1", e.display = "none";
    const i = new Bt(t, { alpha: !0 });
    if (!i.ok)
      return this.failed = !0, null;
    const n = { signal: this.abort.signal };
    return t.addEventListener(
      "webglcontextlost",
      (o) => {
        o.preventDefault(), this.slots.content.ready = this.slots.revealed.ready = !1, this.run && this.finish();
      },
      n
    ), t.addEventListener(
      "webglcontextrestored",
      () => {
        this.destroyed || this.canvas !== t || (this.renderer = new Bt(t, { alpha: !0 }), this.primed = !1, this.slots.content.stale = this.slots.revealed.stale = !0, this.scheduleRefresh(!0));
      },
      n
    ), this.root.appendChild(t), this.canvas = t, this.renderer = i, this.primed = !1, this.slots.content.ready = this.slots.revealed.ready = !1, this.geomDirty = !0, this.flush(), i;
  }
  dropRenderer() {
    var i, n;
    const t = this.renderer, e = this.canvas;
    this.renderer = null, this.canvas = null;
    for (const o of ["content", "revealed"]) {
      const a = this.slots[o];
      a.ready = !1, a.stale = !0, a.canvas = null;
    }
    t != null && t.ok && (t.dispose(), (n = (i = e == null ? void 0 : e.getContext("webgl2")) == null ? void 0 : i.getExtension("WEBGL_lose_context")) == null || n.loseContext()), e == null || e.remove(), this.destroyed || this.flush();
  }
  async capture(t) {
    const e = this.slots[t], i = t === "content" ? this.a : this.b, n = this.renderer;
    if (e.busy || this.destroyed || !i || !n || n.lost) return;
    this.flush(), (this.geomDirty || !this.geom) && this.measure();
    const o = this.geom, a = this.root, l = this.canvas, r = t === "content" ? this.b : this.a, c = e.dirty, u = this.epoch, h = performance.now();
    e.busy = !0, e.began = h;
    let f = !1;
    try {
      const w = (g) => g === l || g === r || g.hasAttribute("data-dw-skip") || g.hasAttribute("data-dw-live"), x = ui(a);
      let d;
      const v = this.opts.capture;
      if (typeof v == "function")
        d = await v({ element: a, slot: t, width: o.w, height: o.h, scale: o.bs, background: x, ignore: w });
      else {
        const g = {
          "border-radius": "0",
          position: "absolute",
          left: `${-o.bl}px`,
          top: `${-o.bt}px`,
          right: "auto",
          bottom: "auto",
          margin: "0",
          transform: "none",
          translate: "none",
          rotate: "none",
          scale: "none",
          opacity: "1",
          visibility: "visible",
          width: `${o.bw}px`,
          height: `${o.bh}px`,
          "box-sizing": "border-box",
          "min-width": "0",
          "min-height": "0",
          "max-width": "none",
          "max-height": "none"
        }, A = { opacity: "1", visibility: "visible" }, b = await mi(a, {
          width: o.w,
          height: o.h,
          scale: o.bs,
          background: x,
          skip: w,
          force: (m) => m === a ? g : m === i ? A : void 0,
          into: e.canvas ?? void 0
        });
        e.canvas = b.canvas, e.walk = b.walk, e.raster = b.raster, e.nodes = b.nodes, e.size = b.size, d = b.canvas;
      }
      if (this.destroyed || this.renderer !== n || n.lost || u !== this.epoch) return;
      n.setScreen(d, o.vw, o.vh, this.style.blur, t), e.ready = !0, e.stale = e.dirty !== c, e.broken = !1, e.count++, f = !0;
    } catch (w) {
      e.broken = !0, typeof console < "u" && console.warn("distortion-waves: could not picture the element; the wave runs without its lens.", w);
    } finally {
      e.busy = !1, e.last = performance.now(), e.cost = e.last - h;
    }
    this.destroyed || (f && (h >= this.runAt || !e.stale) && (this.waiting[t] = !1), e.broken && (this.waiting[t] = !1), this.scrubbing ? this.invalidate() : this.run || (f && this.prime(), this.scheduleRefresh()));
  }
  /** One frame nobody sees, once the pictures are in at rest, so that the
      first frame of the first wave does not wait on the GPU (see
      WaveRenderer.prime). Once for each renderer. */
  prime() {
    const t = this.renderer, e = this.geom;
    if (this.primed || !t || t.lost || !e) return;
    const i = this.needed();
    for (let c = 0; c < i.length; c++) if (!this.slots[i[c]].ready) return;
    this.primed = !0;
    const n = this.style, o = Math.min(e.vw, e.vh) / 4, a = { x: (e.vw - o) / 2, y: (e.vh - o) / 2, w: o, h: o }, l = dt((n.anticipation + n.travel * 0.1) / tt(n), a, e.vw, e.vh, n, null, this.probe), r = this.dots.data.length >= 3 ? this.dots : null;
    r && (r.data[0] = e.vw / 2, r.data[1] = e.vh / 2, r.data[2] = 10.5, r.count = 1), t.setSize(e.vw, e.vh), t.setBlur(n.blur), t.prime(l, n, Dt(0, e.vw, e.vh, n.cornerRadius, n.rimPulse), r, { floor: 0, gain: 1, round: !0, same: !this.b }), r && (r.count = 0);
  }
  /** Makes the renderer and takes the first pictures, when the browser has
      a moment. */
  warm() {
    this.opts.capture !== !1 && Vt(() => {
      this.destroyed || this.run || this.scrubbing || this.motionless() || !this.ensureRenderer() || (this.refresh(), this.rest());
    });
  }
  refresh() {
    if (!(this.destroyed || this.run || this.scrubbing || this.opts.capture === !1 || !this.renderer || this.renderer.lost)) {
      this.flush();
      for (const t of this.needed()) {
        const e = this.slots[t];
        !this.fresh(t) && !e.busy && !e.broken && this.capture(t);
      }
    }
  }
  /** At rest the pictures are kept up only while someone is near: a pointer
      over the element, or focus inside it. `eager` is for the rare changes
      worth a picture anyway: a new size, an image or a font arriving. */
  scheduleRefresh(t = !1) {
    if (this.destroyed || this.run || this.scrubbing || this.opts.capture === !1 || !this.renderer || this.renderer.lost || !t && !this.pointerInside && !this.focusInside || this.fresh("content") && (!this.b || this.fresh("revealed"))) return;
    clearTimeout(this.refreshTimer);
    const e = Math.max(this.slots.content.cost, this.slots.revealed.cost);
    this.refreshTimer = window.setTimeout(() => Vt(() => this.refresh()), Math.max(140, e * 8));
  }
  /** Nothing to do: keep the pictures fresh if someone is near, and let the
      GPU memory go if nobody is for a while. */
  rest() {
    this.destroyed || (this.scheduleRefresh(), clearTimeout(this.releaseTimer), !(this.pointerInside || this.focusInside || !this.renderer) && (this.releaseTimer = window.setTimeout(() => {
      this.destroyed || this.run || this.scrubbing || this.pointerInside || this.focusInside || this.dropRenderer();
    }, Ri)));
  }
  // ─── What changes a picture ───
  /** Notes a change to what the pictures show. False when the change is in
      something the pictures leave out, such as the overlay. */
  mark(t) {
    if (t && t !== this.root) {
      const a = t.nodeType === 1 ? t : t.parentElement, l = a && typeof a.closest == "function" ? a.closest("[data-dw-skip],canvas[data-dw-live]") : null;
      if (l && this.root.contains(l)) return !1;
    }
    const e = this.slots.content, i = this.slots.revealed, n = !!t && this.a.contains(t);
    return !n && !!t && !!this.b && this.b.contains(t) || (e.dirty++, e.stale = !0, e.broken = !1), n || (i.dirty++, i.stale = !0, i.broken = !1), !0;
  }
  onMutations(t) {
    let e = !1;
    for (const i of t) {
      const n = i.target;
      if (n !== this.canvas) {
        if (i.type === "attributes") {
          if ((n === this.a || n === this.b) && (i.attributeName === "style" || i.attributeName === "inert" || i.attributeName === "aria-hidden")) continue;
        } else if (i.type === "childList" && n === this.root) {
          let o = !0;
          for (const a of [i.addedNodes, i.removedNodes])
            for (let l = 0; l < a.length; l++) {
              const r = a[l];
              r.nodeType === 1 && r.hasAttribute("data-dw-skip") || (o = !1);
            }
          if (o) continue;
        }
        this.mark(n) && (e = !0);
      }
    }
    e && this.scheduleRefresh();
  }
  /** Counts the changes the observer has not yet reported. */
  flush() {
    const t = this.observer.takeRecords();
    t.length && this.onMutations(t);
  }
  onResize() {
    const t = this.geom;
    this.geomDirty = !0, t && (this.scrubbing ? this.invalidate() : this.run || this.scheduleRefresh(!0));
  }
  listen() {
    var a;
    const t = this.root, e = { signal: this.abort.signal, passive: !0 }, i = { ...e, capture: !0 }, n = (l) => {
      this.mark(l.target) && this.scheduleRefresh();
    };
    t.addEventListener(
      "pointerdown",
      (l) => {
        const r = l.target, c = r && typeof r.closest == "function" ? r.closest(Ai) : null;
        this.press = { el: c && t.contains(c) ? c : null, x: l.clientX, y: l.clientY, t: performance.now() };
      },
      i
    ), t.addEventListener(
      "pointerenter",
      () => {
        this.pointerInside = !0, clearTimeout(this.releaseTimer), !this.renderer && !this.run && this.opts.capture !== !1 ? this.warm() : this.scheduleRefresh();
      },
      e
    ), t.addEventListener(
      "pointerleave",
      () => {
        this.pointerInside = !1, !this.run && !this.scrubbing && this.rest();
      },
      e
    ), t.addEventListener("pointerover", n, e), t.addEventListener("pointerout", n, e), t.addEventListener(
      "focusin",
      (l) => {
        this.focusInside = !0, clearTimeout(this.releaseTimer), n(l);
      },
      e
    ), t.addEventListener(
      "focusout",
      (l) => {
        const r = l.relatedTarget;
        this.focusInside = !!r && t.contains(r), n(l), !this.focusInside && !this.run && !this.scrubbing && this.rest();
      },
      e
    );
    for (const l of ["input", "change", "transitionend", "animationend"]) t.addEventListener(l, n, e);
    t.addEventListener("scroll", n, i), t.addEventListener(
      "load",
      (l) => {
        this.mark(l.target), this.scheduleRefresh(!0);
      },
      i
    );
    const o = document.fonts;
    (a = o == null ? void 0 : o.addEventListener) == null || a.call(
      o,
      "loadingdone",
      () => {
        pi(), this.mark(null), this.scheduleRefresh(!0);
      },
      e
    );
  }
}
const Yt = typeof window < "u" ? me : pe, St = { gridArea: "1 / 1", minWidth: 0, minHeight: 0, isolation: "isolate" }, Kt = { ...St, opacity: 0, pointerEvents: "none" }, Li = { gridArea: "1 / 1", minWidth: 0, minHeight: 0, position: "relative", zIndex: 2, pointerEvents: "none" }, Pi = ':where([data-dw-layer="overlay"])>*{pointer-events:auto}', Di = ue(function(t, e) {
  const {
    children: i,
    revealedContent: n,
    overlay: o,
    revealed: a,
    type: l,
    source: r,
    focus: c,
    waveStyle: u,
    palette: h,
    scale: f,
    cornerRadius: w,
    scrub: x,
    capture: d,
    live: v,
    prewarm: g,
    resolution: A,
    reducedMotion: b,
    onFinish: m,
    style: y,
    ...C
  } = t, _ = st(null), F = st(null), k = st(null), L = st(null), [z] = fe(() => !!a), B = n != null && n !== !1;
  return Yt(() => {
    const S = new Fi(_.current, F.current, k.current);
    return L.current = S, () => {
      S.destroy(), L.current = null;
    };
  }, []), Yt(() => {
    const S = L.current;
    S && (S.setRevealedLayer(k.current), S.update({ revealed: a, type: l, source: r, focus: c, waveStyle: u, palette: h, scale: f, cornerRadius: w, scrub: x, capture: d, live: v, prewarm: g, resolution: A, reducedMotion: b, onFinish: m }));
  }), de(
    e,
    () => ({
      play: (S) => {
        var M;
        return (M = L.current) == null ? void 0 : M.play(S);
      },
      reverse: () => {
        var S;
        return (S = L.current) == null ? void 0 : S.reverse();
      },
      reset: () => {
        var S;
        return (S = L.current) == null ? void 0 : S.reset();
      },
      prepare: () => {
        var S;
        return ((S = L.current) == null ? void 0 : S.prepare()) ?? Promise.resolve();
      },
      get element() {
        return _.current;
      },
      get controller() {
        return L.current;
      }
    }),
    []
  ), /* @__PURE__ */ Pt("div", { ref: _, "data-distortion-wave": "", ...C, style: { display: "grid", isolation: "isolate", ...y }, children: [
    /* @__PURE__ */ ft("div", { ref: F, "data-dw-layer": "content", style: B && z ? Kt : St, children: i }),
    B ? /* @__PURE__ */ ft("div", { ref: k, "data-dw-layer": "revealed", style: z ? St : Kt, children: n }) : null,
    o != null && o !== !1 ? /* @__PURE__ */ Pt("div", { "data-dw-layer": "overlay", "data-dw-skip": "", style: Li, children: [
      /* @__PURE__ */ ft("style", { "data-dw-skip": "", children: Pi }),
      o
    ] }) : null
  ] });
});
export {
  Qt as COVER_ZONE,
  Di as DistortionWave,
  Y as LUMPS,
  ct as PALETTES,
  Fi as WaveController,
  Bt as WaveRenderer,
  ui as backgroundOf,
  ut as bezierEase,
  Ct as defaultStyle,
  tt as duration,
  ve as hexToRgb,
  Fe as makeParticles,
  yt as newFront,
  Le as particleAt,
  $i as rgbToHex,
  Dt as rimLumps,
  ge as singlePalette,
  I as smooth,
  mi as snapshot,
  dt as waveFront
};
