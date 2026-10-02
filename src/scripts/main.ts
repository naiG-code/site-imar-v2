/*
 * IMar Júnior v2 · animações e interações
 * GSAP (ScrollTrigger + SplitText) + Three.js (oceano do topo).
 * A rolagem é a nativa do navegador, sem atraso.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)]
const html = document.documentElement
const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function iniciar() {
  transicaoDePagina()
  ancoras()
  navegacao()
  menuMobile()
  formulario()
  oceano()
  carrossel()
  servicosLista()
  depoimentos()

  if (reduzido) {
    html.classList.add('hero-ready')
    gsap.set('.hero__in', { y: 0, yPercent: 0 })
    gsap.set('[data-hero-in], [data-reveal]', { opacity: 1 })
    contadores(true)
    return
  }

  entradaHero()
  magneticos()
  document.fonts.ready.then(() => {
    titulos()
    revelar()
    revelarImagens()
    contadores(false)
    etapas()
    decada()
    rodape()
    ScrollTrigger.refresh()
  })
}

/* O oceano 3D (Three.js) carrega depois do resto da página, sem travar nada */
function oceano() {
  const canvas = $<HTMLCanvasElement>('[data-ocean]')
  const hero = $('[data-hero]')
  if (!canvas || !hero) return
  const carregar = () =>
    import('./ocean').then(({ criarOceano }) => {
      const mar = criarOceano(canvas, { reduzido })
      if (!mar) return
      let pendente = false
      window.addEventListener('scroll', () => {
        if (pendente) return
        pendente = true
        requestAnimationFrame(() => {
          pendente = false
          mar.setMergulho(Math.min(1, scrollY / hero.offsetHeight))
        })
      }, { passive: true })
    })
  if ('requestIdleCallback' in window) requestIdleCallback(carregar, { timeout: 1200 })
  else setTimeout(carregar, 300)
}

function irPara(alvo: number | HTMLElement) {
  const top = typeof alvo === 'number' ? alvo : alvo.getBoundingClientRect().top + scrollY
  window.scrollTo({ top, behavior: reduzido ? 'auto' : 'smooth' })
}

/* ---------------- Transição entre páginas (onda) ---------------- */
function transicaoDePagina() {
  const onda = $('[data-onda]')
  if (!onda) return
  const paineis = $$('.onda__p', onda)

  // Chegando de outra página: a onda (que começou cobrindo a tela) sai por cima
  if (html.classList.contains('onda-entrando')) {
    gsap.set(paineis, { y: 0, yPercent: 0 })
    gsap.to(paineis, {
      yPercent: -120,
      duration: 1,
      ease: 'expo.inOut',
      stagger: { each: 0.12, from: 'end' },
      delay: 0.1,
      onComplete: () => {
        html.classList.remove('onda-entrando')
        gsap.set(paineis, { clearProps: 'transform' })
      },
    })
  }

  // Voltando pelo botão "voltar" do navegador: garante que a onda não fique na tela
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return
    html.classList.remove('onda-entrando', 'onda-saindo')
    gsap.set(paineis, { clearProps: 'transform' })
  })

  if (reduzido) return
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return
    const destino = new URL(a.href, location.href)
    if (destino.origin !== location.origin) return
    // Mesmo endereço (só muda o #): deixa a rolagem cuidar
    if (destino.pathname === location.pathname && destino.search === location.search) return
    e.preventDefault()
    fecharMenu()
    try {
      sessionStorage.setItem('imar-onda', '1')
    } catch {}
    html.classList.add('onda-saindo')
    gsap.fromTo(paineis, { y: 0, yPercent: 115 }, {
      y: 0,
      yPercent: 0,
      duration: 0.75,
      ease: 'expo.inOut',
      stagger: 0.1,
      onComplete: () => location.assign(destino.href),
    })
  })
}

function ancoras() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]')
    if (!a) return
    const destino = new URL(a.href, location.href)
    if (destino.pathname !== location.pathname || destino.search !== location.search) return
    const id = destino.hash
    if (id === '#' || id === '#conteudo') return
    const alvo = id === '#topo' ? 0 : $(id)
    if (alvo === null) return
    e.preventDefault()
    fecharMenu()
    irPara(alvo as number | HTMLElement)
    history.replaceState(null, '', id === '#topo' ? location.pathname : id)
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
  window.addEventListener('scroll', () => aoRolar(scrollY), { passive: true })
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
    gsap.timeline()
      .fromTo(bg, { clipPath: 'circle(0% at calc(100% - 48px) 40px)' }, { clipPath: 'circle(150% at calc(100% - 48px) 40px)', duration: 0.9, ease: 'expo.inOut' })
      .fromTo(itens, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, '-=.4')
    $<HTMLButtonElement>('[data-menu-close]', menu)?.focus()
  }
  fecharMenu = () => {
    if (!aberto) return
    aberto = false
    abrir.setAttribute('aria-expanded', 'false')
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

/* Imagens reveladas com uma "cortina" que sobe */
function revelarImagens() {
  $$('[data-wave-reveal]').forEach((el) => {
    const img = $('img, .proj__art', el)
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } })
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.6, ease: 'expo.inOut' })
    if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.2)
  })
}

function contadores(imediato: boolean) {
  $$('[data-count]').forEach((el) => {
    const fim = Number(el.dataset.count)
    const casas = Number(el.dataset.casas) || 0
    // 2000 -> "2.000", 4.9 -> "4,9"
    const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
    if (imediato) return void (el.textContent = fmt(fim))
    const n = { v: 0 }
    el.textContent = fmt(0)
    gsap.to(n, {
      v: fim,
      duration: fim > 100 ? 2.2 : 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = fmt(casas ? n.v : Math.round(n.v))),
    })
  })
}

/* ---------------- Serviços: carrossel + filtro "Você é" ---------------- */
function carrossel() {
  const track = $('[data-car-track]')
  if (!track) return
  const todosCards = $$('[data-svc]', track)
  const todosDots = $$<HTMLButtonElement>('[data-car-dot]')
  const tempo = 6 // segundos em cada serviço
  let cards = todosCards
  let dots = todosDots
  let atual = 0
  let timer: gsap.core.Tween | null = null
  let visivel = false
  let pausado = false

  const desenhar = (card: HTMLElement) => {
    if (reduzido) return
    const paths = $$<SVGGeometryElement>('[data-draw] path, [data-draw] circle', card)
    paths.forEach((p) => p.setAttribute('pathLength', '1'))
    gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.08 })
  }

  const ativar = (i: number) => {
    atual = i
    cards.forEach((c, k) => c.classList.toggle('is-on', k === i))
    dots.forEach((d, k) => {
      d.classList.toggle('is-on', k === i)
      d.classList.toggle('is-done', k < i)
      d.setAttribute('aria-selected', String(k === i))
      gsap.set($('b', d), { clearProps: 'transform' })
    })
    if (cards[i]) desenhar(cards[i])
    pausado = !!cards[i] && sobMouse === cards[i]
    reiniciarTimer()
  }

  const ir = (i: number, instantaneo = false) => {
    if (!cards.length) return
    const n = (i + cards.length) % cards.length
    track.scrollTo({ left: cards[n].offsetLeft - cards[0].offsetLeft, behavior: instantaneo ? 'auto' : 'smooth' })
    ativar(n)
  }

  // Troca automática, com a barrinha do indicador enchendo
  const reiniciarTimer = () => {
    timer?.kill()
    timer = null
    if (reduzido || cards.length < 2) return
    const barra = $('b', dots[atual])
    timer = gsap.fromTo(barra, { scaleX: 0 }, { scaleX: 1, duration: tempo, ease: 'none', paused: !visivel || pausado, onComplete: () => ir(atual + 1) })
  }
  const atualizarPausa = () => (visivel && !pausado ? timer?.play() : timer?.pause())

  $('[data-car-prev]')?.addEventListener('click', () => ir(atual - 1))
  $('[data-car-next]')?.addEventListener('click', () => ir(atual + 1))
  todosDots.forEach((d) => d.addEventListener('click', () => ir(dots.indexOf(d))))

  // Arrastar com o dedo/trackpad: descobre qual card ficou em primeiro
  let espera = 0
  track.addEventListener('scroll', () => {
    clearTimeout(espera)
    espera = window.setTimeout(() => {
      if (cards.length < 2) return
      const passo = cards[1].offsetLeft - cards[0].offsetLeft
      const i = Math.min(cards.length - 1, Math.round(track.scrollLeft / passo))
      if (i !== atual) ativar(i)
    }, 120)
  }, { passive: true })

  // Só pausa com o mouse em cima do serviço que está em destaque
  let sobMouse: HTMLElement | null = null
  const checarPausa = () => {
    const ativo = cards[atual]
    pausado = !!ativo && (sobMouse === ativo || ativo.contains(document.activeElement))
    atualizarPausa()
  }
  todosCards.forEach((c) => {
    c.addEventListener('pointerenter', () => { sobMouse = c; checarPausa() })
    c.addEventListener('pointerleave', () => { if (sobMouse === c) sobMouse = null; checarPausa() })
    c.addEventListener('focusin', checarPausa)
    c.addEventListener('focusout', () => requestAnimationFrame(checarPausa))
  })
  ScrollTrigger.create({ trigger: track, start: 'top 85%', end: 'bottom top', onToggle: (st) => { visivel = st.isActive; atualizarPausa() } })

  /* ----- Filtro por público ----- */
  const botoes = $$<HTMLButtonElement>('[data-filtro-btn]')
  const blob = $('[data-filtro-blob]')
  const frase = $('[data-filtro-frase]')
  const texto = $('[data-filtro-texto]')

  const moverBlob = (btn: HTMLElement, animar = true) => {
    if (!blob) return
    if (!animar) blob.style.transition = 'none'
    blob.style.width = `${btn.offsetWidth}px`
    blob.style.height = `${btn.offsetHeight}px`
    blob.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`
    if (!animar) requestAnimationFrame(() => (blob.style.transition = ''))
  }

  const trocarTexto = (el: HTMLElement | null, novo: string) => {
    if (!el || el.textContent === novo) return
    if (reduzido) return void (el.textContent = novo)
    gsap.timeline()
      .to(el, { yPercent: -40, opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => void (el.textContent = novo))
      .fromTo(el, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' })
  }

  const filtrar = (btn: HTMLButtonElement, animar = true) => {
    botoes.forEach((b) => {
      b.classList.toggle('is-on', b === btn)
      b.setAttribute('aria-checked', String(b === btn))
    })
    moverBlob(btn, animar)
    trocarTexto(frase, btn.dataset.frase ?? '')
    trocarTexto(texto, btn.dataset.texto ?? '')

    const ids = (btn.dataset.servicos ?? '').split(' ').filter(Boolean)
    const passa = (id?: string) => !ids.length || ids.includes(id ?? '')
    todosCards.forEach((c) => c.classList.toggle('is-out', !passa(c.dataset.id)))
    todosDots.forEach((d) => d.classList.toggle('is-out', !passa(d.dataset.id)))
    cards = todosCards.filter((c) => !c.classList.contains('is-out'))
    dots = todosDots.filter((d) => !d.classList.contains('is-out'))
    ir(0, true)

    if (animar && !reduzido) {
      gsap.fromTo(cards, { x: 80, opacity: 0 }, { x: 0, opacity: (k) => (k === 0 ? 1 : 0.35), duration: 0.9, ease: 'expo.out', stagger: 0.07, clearProps: 'opacity,transform' })
    }
  }

  botoes.forEach((b) => b.addEventListener('click', () => filtrar(b)))
  const inicial = botoes[0]
  if (inicial) {
    moverBlob(inicial, false)
    window.addEventListener('resize', () => moverBlob(botoes.find((b) => b.classList.contains('is-on')) ?? inicial, false))
    document.fonts.ready.then(() => moverBlob(botoes.find((b) => b.classList.contains('is-on')) ?? inicial, false))
  }

  ativar(0)
}

/* ---------------- Página de Serviços: filtro "Você é" ---------------- */
function servicosLista() {
  const grupo = $('[data-lista-filtro]')
  if (!grupo) return
  const botoes = $$<HTMLButtonElement>('[data-lista-btn]', grupo)
  const blob = $('[data-lista-blob]', grupo)
  const texto = $('[data-lista-texto]')
  const itens = $$('[data-lista-item]')

  const moverBlob = (b: HTMLElement, animar = true) => {
    if (!blob) return
    if (!animar) blob.style.transition = 'none'
    blob.style.width = `${b.offsetWidth}px`
    blob.style.height = `${b.offsetHeight}px`
    blob.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`
    if (!animar) requestAnimationFrame(() => (blob.style.transition = ''))
  }

  const filtrar = (b: HTMLButtonElement) => {
    botoes.forEach((x) => {
      x.classList.toggle('is-on', x === b)
      x.setAttribute('aria-checked', String(x === b))
    })
    moverBlob(b)
    if (texto) {
      if (reduzido) texto.textContent = b.dataset.texto ?? ''
      else gsap.timeline()
        .to(texto, { opacity: 0, y: -8, duration: 0.2 })
        .add(() => void (texto.textContent = b.dataset.texto ?? ''))
        .to(texto, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' })
    }
    const ids = (b.dataset.servicos ?? '').split(' ').filter(Boolean)
    itens.forEach((it) => it.classList.toggle('is-out', ids.length > 0 && !ids.includes(it.dataset.id ?? '')))
    const visiveis = itens.filter((it) => !it.classList.contains('is-out'))
    if (!reduzido) gsap.fromTo(visiveis, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07, clearProps: 'transform,opacity' })
    ScrollTrigger.refresh()
  }

  botoes.forEach((b) => b.addEventListener('click', () => filtrar(b)))
  const ativo = () => botoes.find((b) => b.classList.contains('is-on')) ?? botoes[0]
  moverBlob(ativo(), false)
  window.addEventListener('resize', () => moverBlob(ativo(), false))
  document.fonts.ready.then(() => moverBlob(ativo(), false))

  // Ícones se desenham quando cada serviço aparece
  if (!reduzido) {
    itens.forEach((it) => {
      const paths = $$<SVGGeometryElement>('[data-draw] path, [data-draw] circle', it)
      paths.forEach((p) => p.setAttribute('pathLength', '1'))
      gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.1,
        scrollTrigger: { trigger: it, start: 'top 80%', once: true },
      })
      gsap.fromTo(it, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: it, start: 'top 88%', once: true } })
    })
  }
}

/* ---------------- Depoimentos: setas do carrossel ---------------- */
function depoimentos() {
  const trilho = $('[data-dep-track]')
  if (!trilho) return
  const passo = () => {
    const c = trilho.firstElementChild as HTMLElement | null
    return c ? c.offsetWidth + 20 : 400
  }
  $('[data-dep-prev]')?.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }))
  $('[data-dep-next]')?.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }))
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

/* ---------------- Formulário ---------------- */
function formulario() {
  const form = $<HTMLFormElement>('[data-form]')
  if (!form) return
  const status = $('[data-form-status]', form)!
  const hud = $('[data-form-hud]', form)!
  const select = $<HTMLSelectElement>('[data-form-servico]', form)!
  const botao = $<HTMLButtonElement>('button[type=submit]', form)!

  // Veio de "Quero esse serviço" em outra página (?servico=pgrs): já escolhe o serviço
  const pedido = new URLSearchParams(location.search).get('servico')
  if (pedido) {
    const opt = $$<HTMLOptionElement>('option', select).find((o) => o.dataset.id === pedido)
    if (opt) select.value = opt.value
  }

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
