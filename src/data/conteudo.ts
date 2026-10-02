/*
 * Textos das seções do site. Edite só o que está entre aspas.
 */

export const hero = {
  /** A palavra em itálico troca sozinha entre as opções abaixo. */
  linha1: 'Soluções sustentáveis',
  linha2: 'com a',
  palavras: ['profundidade', 'ciência', 'energia', 'leveza'],
  linha3: 'do oceano.',
  texto:
    'Ajudamos empresas, escolas, organizações e eventos da Baixada Santista a adotar práticas sustentáveis, com ciência de verdade e preço de Empresa Júnior.',
}

export const valores = ['Transparência', 'Resiliência', 'Ética', 'Protagonismo', 'Inconformismo', 'União', 'Proatividade']

export const sobre = {
  /** A palavra entre [colchetes] aparece em azul. */
  titulo: 'Nascemos para [conectar] a universidade ao mercado',
  texto: [
    'Fundada em 2015, a IMar Júnior é uma Empresa Júnior comprometida com soluções capazes de gerar impacto na sociedade e no meio ambiente. Somos vinculados ao Instituto do Mar da Universidade Federal de São Paulo (Unifesp), no campus Baixada Santista.',
    'Acreditamos que o futuro é construído por meio da sustentabilidade, da inovação e do compromisso com a sociedade. Desenvolvemos soluções que unem o conhecimento acadêmico à prática empresarial para gerar impacto positivo e impulsionar o mercado de amanhã.',
  ],
  cursos: [
    { sigla: 'BICT', nome: 'Ciência e Tecnologia do Mar' },
    { sigla: 'ENG·AMB', nome: 'Engenharia Ambiental' },
    { sigla: 'ENG·PET', nome: 'Engenharia de Petróleo' },
    { sigla: 'OCEANO', nome: 'Oceanografia' },
  ],
  missao:
    'Criar hoje as soluções sustentáveis e profissionais que vão mover o futuro do mercado, formando pessoas comprometidas com o desenvolvimento da sociedade e do meio ambiente.',
  visao:
    'Ser referência na formação de líderes capacitados e na excelência em soluções sustentáveis, consolidando a IMar Jr. como referência em sustentabilidade no litoral paulista.',
}

/*
 * Para quem trabalhamos (filtro da seção de Serviços).
 * `frase` completa o título "Soluções ambientais para ___".
 * `servicos` usa os `id` de servicos.ts.
 */
export const publicos = [
  {
    id: 'todos',
    nome: 'Todos',
    frase: 'o seu negócio',
    texto: 'Seis frentes de atuação, uma mesma base: a ciência do Instituto do Mar aplicada à sua realidade.',
    servicos: [] as string[], // vazio = mostra todos os serviços
  },
  {
    id: 'empresas',
    nome: 'Empresas',
    frase: 'a sua empresa',
    texto: 'Reduza custos e riscos, cumpra a legislação e mostre ao mercado o seu compromisso ESG.',
    servicos: ['consultoria-esg', 'pgrs', 'licenciamento', 'personalizado'],
  },
  {
    id: 'escolas',
    nome: 'Escolas',
    frase: 'a sua escola',
    texto: 'Feiras, aulas e oficinas que fazem alunos e professores se apaixonarem pelo oceano.',
    servicos: ['educacao-ambiental', 'personalizado'],
  },
  {
    id: 'eventos',
    nome: 'Eventos',
    frase: 'o seu evento',
    texto: 'Eventos com menos resíduo e mais propósito, do coffee break à destinação final.',
    servicos: ['coffee-break', 'pgrs', 'educacao-ambiental', 'consultoria-esg'],
  },
  {
    id: 'organizacoes',
    nome: 'Organizações',
    frase: 'a sua organização',
    texto: 'ONGs, associações e poder público com projetos sob medida e base científica.',
    servicos: ['personalizado', 'educacao-ambiental', 'consultoria-esg'],
  },
]

/*
 * Números da IMar (página inicial e Quem somos).
 * `confirmado: false` = número de exemplo: aparece só no seu computador (npm run dev),
 * com uma etiqueta "exemplo". No site publicado, só aparecem os confirmados.
 * Depois de colocar o valor real, troque para `confirmado: true`.
 */
/*
 * Foto da apresentação na página inicial (ao lado de "Estudantes do mar...").
 * Coloque o arquivo em public/img/ e preencha, ex.: imagem: 'img/apresentacao.jpg'
 * Vazio = aparece um espaço reservado com ondas.
 */
export const apresentacao = {
  imagem: 'img/apresentacao.jpg',
  alt: 'Membros da IMar Júnior reunidos em sala de aula segurando a bandeira da empresa',
}

export const numeros: { valor: number; prefixo?: string; sufixo?: string; rotulo: string; confirmado: boolean }[] = [
  { valor: 30, prefixo: '+', rotulo: 'projetos realizados', confirmado: true },
  { valor: 20, prefixo: '+', rotulo: 'clientes atendidos', confirmado: false }, // TODO: número real
  { valor: 2000, prefixo: '+', rotulo: 'pessoas impactadas', confirmado: false }, // TODO: número real
  { valor: 4.9, rotulo: 'de satisfação dos clientes', confirmado: false }, // TODO: nota real (de 0 a 5)
]

export const porqueEJ = [
  { simbolo: '+', titulo: 'Qualidade', texto: 'Projetos feitos por quem estuda o tema a fundo, com a base científica do Instituto do Mar.' },
  { simbolo: '−', titulo: 'Custo', texto: 'Preço abaixo do mercado, sem abrir mão do rigor técnico.' },
  { simbolo: '∞', titulo: 'Impacto', texto: 'Cada projeto forma novos profissionais e gera valor para a Baixada Santista.' },
]

export const metodo = [
  { titulo: 'Reunião inicial', texto: 'Entendemos o seu negócio, seus desafios e seus objetivos. Sem custo e sem compromisso.' },
  { titulo: 'Diagnóstico', texto: 'Levantamento técnico dos processos, resíduos e pontos de impacto.' },
  { titulo: 'Proposta sob medida', texto: 'Escopo, prazo e investimento pensados para a sua realidade.' },
  { titulo: 'Execução e entrega', texto: 'Implementação acompanhada, relatório final e orientação contínua.' },
]

/*
 * Projetos realizados (página Projetos; o primeiro com `destaque: true` aparece na página inicial).
 * Para trocar a foto: coloque o arquivo em public/img/ e mude `imagem`.
 * Sem `imagem`, o card mostra uma arte de ondas.
 * Se a foto for vertical, ajuste `foco` para escolher a parte que aparece no card.
 * `galeria` recebe mais fotos do projeto: [{ src: 'img/projetos/foto.jpg', alt: 'descrição' }]
 */
export type Projeto = {
  tag: string
  titulo: string
  local: string
  ano?: number
  texto: string
  parceiros: string
  imagem?: string
  alt?: string
  /** Qual parte da foto aparece quando ela é cortada (ex.: '50% 80%' = centro, mais para baixo). */
  foco?: string
  galeria?: { src: string; alt: string }[]
  destaque?: boolean
}

export const projetos: Projeto[] = [
  {
    tag: 'Educação Ambiental',
    titulo: 'Feira de Educação Ambiental',
    local: 'Cultura Inglesa',
    // TODO: conteúdo real — confirmar texto, cidade, ano e público
    texto:
      'Em parceria com a Cultura Inglesa, levamos o oceano para dentro da escola: uma feira de educação ambiental com estações interativas, experimentos e muita conversa sobre o mar e o consumo consciente. O painel "O oceano em nossas mãos" reuniu as marcas de quem passou por lá.',
    parceiros: 'Parceria · Cultura Inglesa',
    imagem: 'img/feira-cultura-inglesa.jpg',
    alt: 'Equipe da IMar Júnior na Cultura Inglesa segurando o painel "O oceano em nossas mãos" com marcas de mãos azuis',
    foco: '50% 78%',
    galeria: [], // TODO: mais fotos da feira
    destaque: true,
  },
]

/*
 * Quem já navegou com a gente (faixa de logos logo abaixo do topo).
 * Para colocar um logo: salve o arquivo em public/img/parceiros/ (de preferência
 * .svg ou .png com fundo transparente) e preencha `logo`, ex.: logo: 'img/parceiros/ambev.svg'
 * Sem `logo`, aparece o nome escrito. `mostrarNome: true` mostra o logo e o nome juntos.
 * `escala` aumenta ou diminui um logo que ficou grande ou pequeno demais (1 = normal).
 */
export const parceiros: { nome: string; logo?: string; mostrarNome?: boolean; escala?: number }[] = [
  { nome: 'Ambev', logo: 'img/parceiros/ambev.png', escala: 0.8 },
  { nome: 'Bloom Ocean', logo: 'img/parceiros/bloom.png' },
  { nome: 'Unifesp', logo: 'img/parceiros/unifesp.png', escala: 1.6 },
  { nome: 'Projeto Mantas do Brasil' }, // TODO: logo (site oficial fora do ar)
  { nome: 'Cultura Inglesa', logo: 'img/parceiros/cultura.png' },
  { nome: 'Seiva Jr.', logo: 'img/parceiros/seiva.png', mostrarNome: true },
  { nome: 'IPT', logo: 'img/parceiros/ipt.png' },
  { nome: 'IO Jr.', logo: 'img/parceiros/iojr.png', escala: 1.25 },
]

export const ods = [
  { numero: 4, cor: '#C5192D', titulo: 'Educação de qualidade', texto: 'Palestras, aulas e feiras de educação ambiental para escolas e empresas.' },
  { numero: 11, cor: '#FD9D24', titulo: 'Cidades e comunidades sustentáveis', texto: 'Gestão de resíduos e projetos com comunidades do litoral paulista.' },
  { numero: 13, cor: '#3F7E44', titulo: 'Ação contra a mudança do clima', texto: 'Estratégias ESG que reduzem impactos e emissões das operações.' },
  { numero: 14, cor: '#0A97D9', titulo: 'Vida na água', texto: 'Conservação dos ecossistemas marinhos: o que nos trouxe até aqui.' },
]

export const facaParte = {
  /** A palavra entre [colchetes] aparece em destaque. */
  titulo: 'Seu lugar também é [aqui]',
  texto:
    'Se você estuda BICT Mar, Engenharia Ambiental, Engenharia de Petróleo ou Oceanografia no Instituto do Mar, venha viver o Movimento Empresa Júnior com a gente. Acompanhe o Instagram para saber quando abre o próximo processo seletivo.',
}

export const contato = {
  titulo: 'Transforme desafios em oportunidades.',
  texto:
    'Conte o que você precisa. A primeira reunião é gratuita e sem compromisso, e a gente volta com uma proposta pensada para a sua realidade.',
}
