/*
 * "Neve marinha": partículas que sobem devagar pelo fundo do site.
 * Aparecem mais conforme a página fica mais "funda".
 */

type P = { x: number; y: number; r: number; v: number; ph: number; bolha: boolean }

export function criarNeve(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { setProfundidade() {} }

  let w = 0
  let h = 0
  let ps: P[] = []
  let profundidade = 0
  const pr = Math.min(window.devicePixelRatio, 2)

  const criar = (): P => {
    const bolha = Math.random() < 0.12
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: bolha ? 2 + Math.random() * 4 : 0.6 + Math.random() * 1.4,
      v: bolha ? 18 + Math.random() * 30 : 4 + Math.random() * 10,
      ph: Math.random() * Math.PI * 2,
      bolha,
    }
  }

  const resize = () => {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * pr
    canvas.height = h * pr
    ctx.setTransform(pr, 0, 0, pr, 0, 0)
    const n = Math.round(Math.min(110, (w * h) / 14000))
    ps = Array.from({ length: n }, criar)
  }
  resize()
  window.addEventListener('resize', resize)

  let cor = '140,200,240'
  const lerCor = () => {
    const light = getComputedStyle(document.documentElement).colorScheme === 'light'
    cor = light ? '29,95,168' : '140,200,240'
  }
  lerCor()
  window.addEventListener('imar:tema', lerCor)

  let last = performance.now()
  const loop = (now: number) => {
    requestAnimationFrame(loop)
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    if (document.hidden) return
    ctx.clearRect(0, 0, w, h)
    const alfa = Math.min(1, profundidade * 5)
    if (alfa <= 0.01) return

    for (const p of ps) {
      p.y -= p.v * dt
      p.ph += dt
      if (p.y < -10) {
        p.y = h + 10
        p.x = Math.random() * w
      }
      const x = p.x + Math.sin(p.ph * 0.8) * (p.bolha ? 8 : 4)
      ctx.beginPath()
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2)
      if (p.bolha) {
        ctx.strokeStyle = `rgba(${cor},${0.35 * alfa})`
        ctx.lineWidth = 1
        ctx.stroke()
      } else {
        ctx.fillStyle = `rgba(${cor},${0.4 * alfa})`
        ctx.fill()
      }
    }
  }
  requestAnimationFrame(loop)

  return {
    setProfundidade(p: number) {
      profundidade = p
    },
  }
}
