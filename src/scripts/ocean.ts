/*
 * Oceano 3D do topo do site: um mar de partículas animado por shader.
 * O mouse cria ondulações; ao rolar a página, a câmera "mergulha".
 */
import {
  AdditiveBlending,
  Color,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseK;
  uniform float uPR;
  uniform float uSize;
  varying float vH;
  varying float vFade;

  float wave(vec2 p) {
    float h = 0.0;
    h += sin(p.x * 0.32 + uTime * 0.55) * 0.38;
    h += sin(p.y * 0.48 + uTime * 0.75 + p.x * 0.18) * 0.26;
    h += sin((p.x + p.y) * 0.85 - uTime * 1.05) * 0.09;
    h += cos(p.x * 1.55 - p.y * 0.65 + uTime * 1.25) * 0.05;
    return h;
  }

  void main() {
    vec3 pos = position;
    float h = wave(pos.xz);
    float d = distance(pos.xz, uMouse);
    h += sin(d * 2.6 - uTime * 4.2) * exp(-d * 0.55) * 0.42 * uMouseK;
    pos.y += h;
    vH = h;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPR * (1.0 + h * 0.7) / -mv.z;
    vFade = smoothstep(42.0, 7.0, -mv.z) * smoothstep(0.5, 3.0, -mv.z);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uOpacity;
  uniform float uGlow;
  varying float vH;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.05, r);
    float k = smoothstep(-0.25, 0.6, vH);
    vec3 col = mix(uA, uB, k);
    float alpha = a * vFade * uOpacity * (0.35 + k * uGlow);
    gl_FragColor = vec4(col, alpha);
  }
`

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const isLight = () => document.documentElement.style.colorScheme === 'light' || getComputedStyle(document.documentElement).colorScheme === 'light'

export function criarOceano(canvas: HTMLCanvasElement, opts: { reduzido: boolean }) {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
  } catch {
    canvas.remove()
    return null
  }

  const mobile = window.matchMedia('(max-width: 760px)').matches
  const pr = Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.5)
  renderer.setPixelRatio(pr)
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(55, 1, 0.1, 100)
  const baseCam = new Vector3(0, 2.4, 7)
  camera.position.copy(baseCam)
  camera.lookAt(0, 0, -6)

  const geo = new PlaneGeometry(44, 40, mobile ? 90 : 160, mobile ? 70 : 130)
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, 0, -14)

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new Vector2(0, -4) },
    uMouseK: { value: 0 },
    uPR: { value: pr },
    uSize: { value: mobile ? 40 : 38 },
    uA: { value: new Color() },
    uB: { value: new Color() },
    uOpacity: { value: 0 },
    uGlow: { value: 1 },
  }

  const mat = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    transparent: true,
    depthWrite: false,
  })
  const points = new Points(geo, mat)
  scene.add(points)

  const aplicarTema = () => {
    const light = isLight()
    uniforms.uA.value.set(light ? cssVar('--wave-3') || '#1d5fa8' : cssVar('--wave') || '#3b8fd9')
    uniforms.uB.value.set(cssVar('--accent') || '#3df2c9')
    uniforms.uGlow.value = light ? 0.9 : 1.15
    mat.blending = light ? NormalBlending : AdditiveBlending
    mat.needsUpdate = true
  }
  aplicarTema()
  window.addEventListener('imar:tema', aplicarTema)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 700 ? 68 : 55
    camera.updateProjectionMatrix()
  }
  resize()
  new ResizeObserver(resize).observe(canvas)

  // Mouse → ponto no plano do mar (y = 0)
  const target = new Vector2(0, -4)
  let mouseK = 0
  const ndc = new Vector2()
  const dir = new Vector3()
  canvas.parentElement?.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    dir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize()
    if (dir.y < -0.01) {
      const t = -camera.position.y / dir.y
      target.set(camera.position.x + dir.x * t, camera.position.z + dir.z * t)
    }
    mouseK = 1
  })

  // Rolagem: 0 no topo, 1 quando o hero sai da tela
  let mergulho = 0
  let visivel = true
  new IntersectionObserver(([e]) => (visivel = e.isIntersecting)).observe(canvas)

  let t0 = performance.now()
  let fadeIn = 0
  const loop = (now: number) => {
    requestAnimationFrame(loop)
    if (!visivel || document.hidden) {
      t0 = now
      return
    }
    const dt = Math.min((now - t0) / 1000, 0.05)
    t0 = now
    uniforms.uTime.value += dt
    fadeIn = Math.min(1, fadeIn + dt * 0.6)
    mouseK *= 0.985
    uniforms.uMouseK.value += (mouseK - uniforms.uMouseK.value) * 0.06
    uniforms.uMouse.value.lerp(target, 0.08)
    uniforms.uOpacity.value = fadeIn * (1 - mergulho * 0.85)

    camera.position.y = baseCam.y - mergulho * 2.6
    camera.position.z = baseCam.z - mergulho * 1.5
    camera.lookAt(0, -mergulho * 1.8, -6)
    renderer.render(scene, camera)
  }

  if (opts.reduzido) {
    uniforms.uOpacity.value = 1
    uniforms.uTime.value = 3
    renderer.render(scene, camera)
  } else {
    requestAnimationFrame(loop)
  }

  return {
    setMergulho(p: number) {
      mergulho = p
      if (opts.reduzido) renderer.render(scene, camera)
    },
    reaplicarTema: aplicarTema,
  }
}
