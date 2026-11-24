import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/*
  Full-bleed fragment shader: domain-warped fbm "light leak" in ember + ink,
  an anamorphic lens flare that follows the pointer, film grain and gate weave.
  Raw WebGL — one full-screen triangle, with automatic fallback to an animated
  CSS cinema light-leak if WebGL is unavailable or loses context.
*/

const vert = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`

const frag = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uFade;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
  vec2 u = f*f*(3.-2.*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for(int i=0;i<5;i++){ v += a*noise(p); p = r*p*2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x/uRes.y, 1.0);
  float t = uTime * 0.06;

  // gate weave — subtle jitter of film in a projector gate
  p += vec2(sin(uTime*13.0), cos(uTime*11.0)) * 0.0007;

  vec2 q = vec2(fbm(p*1.4 + vec2(0.0, t)), fbm(p*1.4 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p*1.6 + 3.5*q + vec2(1.7, 9.2) + t*1.3), fbm(p*1.6 + 3.5*q + vec2(8.3, 2.8) - t));
  float f = fbm(p*1.2 + 3.0*r + (m*0.35));

  vec3 ink   = vec3(0.039, 0.043, 0.051);
  vec3 deep  = vec3(0.10, 0.045, 0.03);
  vec3 ember = vec3(0.957, 0.365, 0.173);
  vec3 bone  = vec3(0.925, 0.906, 0.867);

  // weight the leak towards the right side, keeping the left calm for type
  float side = smoothstep(-0.9, 0.9, p.x + 0.25*sin(t*2.0));
  float leak = smoothstep(0.42, 0.95, f) * (0.35 + 0.85*side);

  vec3 col = ink;
  col = mix(col, deep, smoothstep(0.2, 0.8, f) * 0.9);
  col = mix(col, ember, leak * 0.75);
  col += bone * pow(leak, 4.0) * 0.35;

  // anamorphic flare tracking the pointer
  vec2 d = p - m;
  float core = exp(-dot(d, d) * 38.0);
  float streak = exp(-abs(d.y) * 120.0) * exp(-abs(d.x) * 1.6);
  col += ember * core * 0.35 + vec3(1.0, 0.62, 0.45) * streak * 0.22;

  // vignette
  float v = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(1.25, 1.0)));
  col *= mix(0.35, 1.0, v);

  // grain + faint scanlines
  float g = hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5;
  col += g * 0.055;
  col *= 0.96 + 0.04 * sin(gl_FragCoord.y * 1.4);

  gl_FragColor = vec4(mix(ink, col, uFade), 1.0);
}
`

export default function ShaderField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (fallback) return
    const canvas = ref.current
    if (!canvas) return

    const onContextLost = (e: Event) => {
      e.preventDefault()
      setFallback(true)
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl || gl.isContextLost()) {
      setFallback(true)
      return () => canvas.removeEventListener('webglcontextlost', onContextLost)
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, vert)
    const fs = compile(gl.FRAGMENT_SHADER, frag)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) {
      setFallback(true)
      return () => canvas.removeEventListener('webglcontextlost', onContextLost)
    }

    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS) || gl.isContextLost()) {
      setFallback(true)
      return () => canvas.removeEventListener('webglcontextlost', onContextLost)
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uFade = gl.getUniformLocation(prog, 'uFade')

    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(w * scale))
      canvas.height = Math.max(1, Math.floor(h * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const target = { x: 0.72, y: 0.58 }
    const mouse = { x: 0.72, y: 0.58 }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    const reduced = prefersReducedMotion()
    const start = performance.now()
    let raf = 0
    const loop = (now: number) => {
      if (gl.isContextLost()) {
        setFallback(true)
        return
      }
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const t = (now - start) / 1000
      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05
      gl.uniform1f(uTime, reduced ? 12.0 : t + 12.0)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.uniform1f(uFade, Math.min(1, 0.25 + t / 1.4))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [fallback])

  if (fallback) {
    return (
      <div className="shader shader--fallback" aria-hidden="true">
        <span className="shader__leak shader__leak--a" />
        <span className="shader__leak shader__leak--b" />
        <span className="shader__streak" />
      </div>
    )
  }

  return <canvas ref={ref} className="shader" aria-hidden="true" />
}
