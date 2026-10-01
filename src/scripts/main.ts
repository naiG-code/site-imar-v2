/*
 * IMar Júnior v2 · animações e interações
 * GSAP (ScrollTrigger + SplitText) + Lenis (rolagem suave) + Three.js (oceano)
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { criarNeve } from './snow'

gsap.registerPlugin(ScrollTrigger, SplitText)

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)]
const html = document.documentElement
const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches

let lenis: Lenis | null = null

export function iniciar() {
  rolagemSuave()
  ancoras()
  tema()
  navegacao()
  menuMobile()
  formulario()

  // O oceano 3D (Three.js) é carregado à parte para não atrasar o resto da página
  const oceano = $<HTMLCanvasElement>('[data-ocean]')
  let mar: { setMergulho(p: number): void } | null = null
  let heroAtual = 0
  if (oceano) {
    import('./ocean').then(({ criarOceano }) => {
      mar = criarOceano(oceano, { reduzido })
      mar?.setMergulho(heroAtual)
    })
  }
  const neve = !reduzido ? criarNeve($<HTMLCanvasElement>('[data-snow]')!) : null
  profundidade((p, heroP) => {
    heroAtual = heroP
    neve?.setProfundidade(p)
    mar?.setMergulho(heroP)
  })

  if (reduzido) {
    html.classList.add('hero-ready')
    gsap.set('.hero__in', { y: 0, yPercent: 0 })
    gsap.set('[data-hero-in], [data-reveal]', { opacity: 1 })
    contadores(true)
    return
  }

  document.fonts.ready.then(() => {
    titulos()
    revelar()
    palavrasNoScroll()
    revelarImagens()
    parallax()
    contadores(false)
    rolagemHorizontal()
    etapas()
    decada()
    rodape()
    ScrollTrigger.refresh()
  })
  letreiros()
  inclinar()
  magneticos()
  cursor()
  preloader().then(entradaHero)
}

/* ---------------- Rolagem suave ---------------- */
function rolagemSuave() {
  if (reduzido) return
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

function irPara(alvo: string | number | HTMLElement, duracao = 1.6) {
  if (lenis) lenis.scrollTo(alvo, { duration: duracao, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else if (typeof alvo === 'number') window.scrollTo({ top: alvo })
  else (typeof alvo === 'string' ? $(alvo) : alvo)?.scrollIntoView()
}

function ancoras() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')!
    if (id === '#' || id === '#conteudo') return
    const alvo = id === '#topo' ? 0 : $(id)
    if (alvo === null) return
    e.preventDefault()
    fecharMenu()
    irPara(alvo as number | HTMLElement, id === '#topo' ? 2.4 : 1.6)
    history.replaceState(null, '', id === '#topo' ? location.pathname : id)
  })
}

/* ---------------- Tema claro/escuro ---------------- */
function tema() {
  const btn = $('[data-theme-toggle]')
  if (!btn) return
  const atual = () =>
    html.dataset.theme ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

  btn.addEventListener('click', (e) => {
    const novo = atual() === 'light' ? 'dark' : 'light'
    const aplicar = () => {
      html.dataset.theme = novo
      try {
        localStorage.setItem('imar-tema', novo)
      } catch {}
      window.dispatchEvent(new Event('imar:tema'))
    }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    if (!doc.startViewTransition || reduzido) return aplicar()

    const { clientX: x, clientY: y } = e as MouseEvent
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    doc.startViewTransition(aplicar).ready.then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  })
}

/* ---------------- Navegação ---------------- */
function navegacao() {
  const nav = $('[data-nav]')
  if (!nav) return
  let ultimo = 0
  const aoRolar = (y: number) => {
    nav.classList.toggle('is-scrolled', y > 20)
    const menuAberto = !$('[data-menu]')?.hasAttribute('hidden')
    nav.classList.toggle('is-hidden', y > 500 && y > ultimo && !menuAberto)
    ultimo = y
  }
  if (lenis) lenis.on('scroll', (l: Lenis) => aoRolar(l.scroll))
  else window.addEventListener('scroll', () => aoRolar(scrollY), { passive: true })

  const links = $$<HTMLAnchorElement>('[data-nav-link]')
  links.forEach((a) => {
    const sec = $(a.getAttribute('href')!)
    if (!sec) return
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (st) => a.classList.toggle('is-active', st.isActive),
    })
  })
}

let fecharMenu = () => {}
function menuMobile() {
  const menu = $('[data-menu]')
  const abrir = $('[data-menu-open]')
  if (!menu || !abrir) return
  const bg = $('[data-menu-bg]', menu)!
  const itens = $$('[data-menu-link]', menu)
  let aberto = false

  const abrirMenu = () => {
    aberto = true
    menu.hidden = false
    abrir.setAttribute('aria-expanded', 'true')
    lenis?.stop()
    gsap.timeline()
      .fromTo(bg, { clipPath: 'circle(0% at calc(100% - 48px) 40px)' }, { clipPath: 'circle(150% at calc(100% - 48px) 40px)', duration: 0.9, ease: 'expo.inOut' })
      .fromTo(itens, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, '-=.4')
    $<HTMLButtonElement>('[data-menu-close]', menu)?.focus()
  }
  fecharMenu = () => {
    if (!aberto) return
    aberto = false
    abrir.setAttribute('aria-expanded', 'false')
    lenis?.start()
    gsap.to(bg, {
      clipPath: 'circle(0% at calc(100% - 48px) 40px)',
      duration: 0.7,
      ease: 'expo.inOut',
      onComplete: () => {
        menu.hidden = true
      },
    })
    gsap.to(itens, { opacity: 0, duration: 0.25 })
    abrir.focus()
  }
  abrir.addEventListener('click', abrirMenu)
  $('[data-menu-close]', menu)?.addEventListener('click', fecharMenu)
  document.addEventListener('keydown', (e) => e.key === 'Escape' && fecharMenu())
}

/* ---------------- Profundímetro ---------------- */
const zonas = [
  { ate: 200, nome: 'Epipelágica' },
  { ate: 1000, nome: 'Mesopelágica' },
  { ate: 4000, nome: 'Batipelágica' },
  { ate: Infinity, nome: 'Abissopelágica' },
]

function profundidade(cb: (p: number, heroP: number) => void) {
  const valor = $('[data-depth]')
  const zona = $('[data-zone]')
  const barra = $('[data-gauge-bar]')
  const hero = $('[data-hero]')
  let zonaAtual = ''

  const atualizar = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    const y = lenis ? lenis.scroll : scrollY
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
    const heroP = hero ? Math.min(1, y / hero.offsetHeight) : 0
    html.style.setProperty('--depth', p.toFixed(4))
    html.classList.toggle('depth-on', y > innerHeight * 0.6)
    const m = Math.round(p * 5000)
    if (valor) valor.textContent = String(m).padStart(4, '0')
    if (barra) barra.style.transform = `translateY(${p * 113}px)`
    const z = zonas.find((z) => m < z.ate)!.nome
    if (zona && z !== zonaAtual) {
      zonaAtual = z
      zona.textContent = z
      if (!reduzido) gsap.fromTo(zona, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5 })
    }
    cb(p, heroP)
  }
  if (lenis) lenis.on('scroll', atualizar)
  else window.addEventListener('scroll', atualizar, { passive: true })
  window.addEventListener('resize', atualizar)
  atualizar()
}

/* ---------------- Preloader ---------------- */
function preloader(): Promise<void> {
  const pre = $('[data-preloader]')
  const visivel = pre && getComputedStyle(pre).display !== 'none'
  if (!pre || !visivel) {
    pre?.remove()
    return Promise.resolve()
  }
  try {
    sessionStorage.setItem('imar-visitou', '1')
  } catch {}
  lenis?.stop()
  const fill = $('[data-preloader-fill]', pre)
  const count = $('[data-preloader-count]', pre)
  const wave = $('[data-preloader-wave]', pre)
  const n = { v: 0 }

  return new Promise((resolve) => {
    gsap.timeline({
      onComplete: () => {
        pre.remove()
        lenis?.start()
      },
    })
      .to(n, {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(n.v)).padStart(3, '0')
          if (fill) fill.style.clipPath = `inset(${100 - n.v}% 0 0 0)`
        },
      })
      .to('.preloader__inner', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=.15')
      .add(resolve, '-=.05')
      .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<')
      .to(wave, { attr: { d: 'M0 0 L0 0 C 240 0 480 0 720 0 C 960 0 1200 0 1440 0 L1440 0 Z' }, duration: 1.1, ease: 'expo.inOut' }, '<')
  })
}

/* ---------------- Hero ---------------- */
function entradaHero() {
  html.classList.add('hero-ready')
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.fromTo('.hero__in', { y: 0, yPercent: 110, rotate: 3 }, { y: 0, yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.12 }, 0.15)
    .fromTo('[data-hero-in]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.5)
  rotador()
}

function rotador() {
  const box = $('[data-rotator]')
  if (!box) return
  const palavras = $$('em', box)
  const splits = palavras.map((p) => SplitText.create(p, { type: 'chars', mask: 'chars', charsClass: 'rc' }))
  palavras.forEach((p, i) => i !== 0 && gsap.set(splits[i].chars, { yPercent: 150 }))
  gsap.set(palavras, { opacity: 1 })
  let i = 0
  gsap.delayedCall(3, function troca() {
    const prox = (i + 1) % palavras.length
    gsap.to(splits[i].chars, { yPercent: -150, duration: 0.7, ease: 'power3.in', stagger: 0.025 })
    gsap.fromTo(splits[prox].chars, { yPercent: 150 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.03, delay: 0.45 })
    i = prox
    gsap.delayedCall(3.2, troca)
  })
}

/* ---------------- Títulos que sobem linha a linha ---------------- */
function titulos() {
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          rotate: 2,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    })
  })
}

function revelar() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  })
}

/* Manifesto: as palavras "acendem" conforme a rolagem */
function palavrasNoScroll() {
  $$('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'split-word' })
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
    )
  })
}

/* Imagens reveladas com uma "cortina" que sobe */
function revelarImagens() {
  $$('[data-wave-reveal]').forEach((el) => {
    const img = $('img, .proj__art', el)
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } })
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.6, ease: 'expo.inOut' })
    if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.2)
  })
}

function parallax() {
  $$('[data-parallax]').forEach((el) => {
    const v = Number(el.dataset.parallax) || -10
    gsap.fromTo(el, { yPercent: 0 }, {
      yPercent: v,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

function contadores(imediato: boolean) {
  $$('[data-count]').forEach((el) => {
    const fim = Number(el.dataset.count)
    if (imediato) return void (el.textContent = String(fim))
    const n = { v: 0 }
    el.textContent = '0'
    gsap.to(n, {
      v: fim,
      duration: fim > 100 ? 2.4 : 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = String(Math.round(n.v))),
    })
  })
}

/* ---------------- Letreiros (marquee) ---------------- */
function letreiros() {
  $$('[data-marquee]').forEach((m) => {
    const track = $('[data-marquee-track]', m)!
    const dir = Number(m.dataset.dir) || 1
    const tween = dir > 0
      ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 })
      : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 50, ease: 'none', repeat: -1 })
    lenis?.on('scroll', (l: Lenis) => {
      const v = Math.min(Math.abs(l.velocity), 60)
      gsap.to(tween, {
        timeScale: 1 + v / 5,
        duration: 0.2,
        overwrite: true,
        onComplete: () => void gsap.to(tween, { timeScale: 1, duration: 1.4, ease: 'power2.out' }),
      })
      gsap.to(track, { skewX: -Math.sign(l.velocity) * v * 0.12 * dir, duration: 0.4, overwrite: 'auto' })
    })
  })
}

/* ---------------- Serviços: rolagem horizontal ---------------- */
function rolagemHorizontal() {
  const pin = $('[data-hscroll]')
  const track = $('[data-hscroll-track]')
  const barra = $('[data-hscroll-bar]')
  if (!pin || !track) return

  const desenhar = (svg: SVGElement, opts: ScrollTrigger.Vars) => {
    const paths = $$<SVGGeometryElement>('path, circle', svg)
    paths.forEach((p) => p.setAttribute('pathLength', '1'))
    gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.12, scrollTrigger: opts,
    })
  }

  const mm = gsap.matchMedia()
  mm.add('(min-width: 901px)', () => {
    const distancia = () => track.scrollWidth - innerWidth
    const tween = gsap.to(track, {
      x: () => -distancia(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top+=40',
        end: () => `+=${distancia()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (st) => barra && gsap.set(barra, { scaleX: st.progress }),
      },
    })
    $$('[data-svc]').forEach((card) => {
      gsap.fromTo(card, { rotateY: -14, opacity: 0.4, transformPerspective: 1200 }, {
        rotateY: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 55%', scrub: true },
      })
      const svg = $<SVGElement>('[data-draw]', card)
      if (svg) desenhar(svg, { trigger: card, containerAnimation: tween, start: 'left 80%', once: true })
    })
  })
  mm.add('(max-width: 900px)', () => {
    $$('[data-svc]').forEach((card) => {
      gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
      const svg = $<SVGElement>('[data-draw]', card)
      if (svg) desenhar(svg, { trigger: card, start: 'top 80%', once: true })
    })
  })
}

/* ---------------- Método: linha que se desenha ---------------- */
function etapas() {
  const list = $('.steps__list')
  const linha = $('[data-steps-line]')
  if (!list || !linha) return
  gsap.to(linha, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: true } })
  $$('[data-step]').forEach((s) =>
    ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'max', toggleClass: 'is-on' }),
  )
}

function decada() {
  const b = $('[data-decade-bar]')
  if (!b) return
  const p = Math.min(1, Math.max(0, (new Date().getFullYear() - 2021) / 9))
  gsap.to(b, { scaleX: p, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 90%', once: true } })
}

function rodape() {
  const w = $('[data-foot-wave]')
  if (w) {
    gsap.to(w, {
      attr: { d: 'M0 60 C 240 100 480 20 720 60 S 1200 100 1440 60 L1440 120 L0 120 Z' },
      duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })
  }
  const word = $('[data-foot-word]')
  if (word) {
    gsap.fromTo(word, { yPercent: 40, opacity: 0.2 }, {
      yPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  }
}

/* ---------------- Interações de ponteiro ---------------- */
function inclinar() {
  if (!ponteiroFino) return
  $$('[data-tilt]').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 10)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
    })
    el.addEventListener('pointerleave', () => {
      rx(0)
      ry(0)
    })
  })
}

function magneticos() {
  if (!ponteiroFino) return
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * 0.3)
      y((e.clientY - r.top - r.height / 2) * 0.35)
    })
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' })
    })
  })
}

function cursor() {
  const c = $('[data-cursor]')
  const label = $('[data-cursor-label]')
  if (!c || !ponteiroFino) return
  html.classList.add('has-cursor')
  const x = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' })
  const y = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' })
  window.addEventListener('pointermove', (e) => {
    x(e.clientX)
    y(e.clientY)
  })
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement
    const comLabel = t.closest<HTMLElement>('[data-cursor]:not(.cursor)')
    const link = t.closest('a, button, label, select, input, textarea')
    c.classList.toggle('is-label', !!comLabel && !link)
    c.classList.toggle('is-hover', !!link)
    if (label) label.textContent = comLabel && !link ? comLabel.dataset.cursor ?? '' : ''
  })
  document.addEventListener('pointerleave', () => html.classList.remove('has-cursor'))
  document.addEventListener('pointerenter', () => html.classList.add('has-cursor'))
}

/* ---------------- Formulário ---------------- */
function formulario() {
  const form = $<HTMLFormElement>('[data-form]')
  if (!form) return
  const status = $('[data-form-status]', form)!
  const hud = $('[data-form-hud]', form)!
  const select = $<HTMLSelectElement>('[data-form-servico]', form)!
  const botao = $<HTMLButtonElement>('button[type=submit]', form)!

  // "Quero esse serviço" já escolhe o serviço no formulário
  $$<HTMLAnchorElement>('[data-servico]').forEach((a) =>
    a.addEventListener('click', () => {
      const opt = $$<HTMLOptionElement>('option', select).find((o) => o.dataset.id === a.dataset.servico)
      if (opt) select.value = opt.value
      if (!reduzido) gsap.fromTo(select, { boxShadow: '0 0 0 0px var(--accent)' }, { boxShadow: '0 0 0 6px transparent', duration: 1.6, delay: 1.2 })
    }),
  )

  const setHud = (t: string) => (hud.lastChild!.textContent = ` ${t}`)
  const setStatus = (t: string, tipo: '' | 'ok' | 'err' = '') => {
    status.textContent = t
    status.className = `form__status${tipo ? ` is-${tipo}` : ''}`
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const obrigatorios = $$<HTMLInputElement | HTMLTextAreaElement>('[required]', form)
    let ok = true
    obrigatorios.forEach((f) => {
      const valido = f.value.trim() !== '' && f.checkValidity()
      f.setAttribute('aria-invalid', String(!valido))
      if (!valido && ok) {
        f.focus()
        ok = false
      }
    })
    if (!ok) return setStatus('Preencha nome, um e-mail válido e a mensagem.', 'err')

    const dados = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (dados.botcheck) return
    const chave = form.dataset.key

    // Sem chave do Web3Forms: abre o app de e-mail com a mensagem pronta
    if (!chave) {
      const corpo = `Nome: ${dados.nome}\nE-mail: ${dados.email}\nWhatsApp: ${dados.telefone || '-'}\nPerfil: ${dados.perfil}\nOrganização: ${dados.organizacao || '-'}\nServiço: ${dados.servico}\n\n${dados.mensagem}`
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Contato pelo site · ${dados.servico}`)}&body=${encodeURIComponent(corpo)}`
      return setStatus('Abrimos seu app de e-mail com a mensagem pronta.', 'ok')
    }

    botao.disabled = true
    setHud('Transmitindo')
    setStatus('Enviando…')
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: chave,
          subject: `Novo contato pelo site · ${dados.servico}`,
          from_name: 'Site IMar Júnior',
          replyto: dados.email,
          ...dados,
        }),
      })
      const j = await r.json()
      if (!r.ok || !j.success) throw new Error(j.message)
      form.reset()
      setHud('Recebido')
      setStatus('Mensagem recebida! Em breve entraremos em contato.', 'ok')
    } catch {
      setHud('Falha')
      setStatus('Não conseguimos enviar agora. Tente pelo WhatsApp ou pelo e-mail ao lado.', 'err')
    } finally {
      botao.disabled = false
    }
  })
}
